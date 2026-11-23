import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { once } from 'node:events'
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const packagePath = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('..', import.meta.url))
const scratch = mkdtempSync(join(realpathSync(tmpdir()), 'pstack-test-'))
const env = {
  ...process.env,
  XDG_CONFIG_HOME: join(scratch, 'config'),
  XDG_CACHE_HOME: join(scratch, 'cache'),
  XDG_DATA_HOME: join(scratch, 'data'),
  XDG_STATE_HOME: join(scratch, 'state'),
  OPENCODE_DB: ':memory:',
  OPENCODE_SERVER_PASSWORD: randomBytes(24).toString('hex'),
}

let server
let url

function get(project, path) {
  const location = new URLSearchParams({ 'location[directory]': project })
  const output = execFileSync('opencode', ['api', '--server', url, 'get', `${path}?${location}`], {
    cwd: project, env, encoding: 'utf8', timeout: 30_000, maxBuffer: 4 * 1024 * 1024,
  })
  const result = JSON.parse(output)
  assert.equal(result.location.directory, project)
  return result.data
}

async function loadProject(name, agents) {
  const project = join(scratch, name)
  mkdirSync(project)
  writeFileSync(join(project, 'opencode.json'), JSON.stringify({ plugins: [packagePath], agents }))
  const deadline = Date.now() + 15_000
  while (Date.now() < deadline) {
    const plugin = get(project, '/api/plugin').find(plugin => plugin.source.path === packagePath)
    if (plugin) {
      assert.equal(plugin.state.status, 'active', JSON.stringify(plugin.state))
      return project
    }
    await delay(100)
  }
  assert.fail(`OpenCode did not load ${packagePath}`)
}

try {
  const startup = new AbortController()
  const startupTimeout = setTimeout(() => startup.abort(), 15_000)
  server = spawn('opencode', ['serve', '--hostname', '127.0.0.1', '--port', '0'], { cwd: scratch, env })
  try {
    const [chunk] = await once(server.stdout, 'data', { signal: startup.signal })
    url = chunk.toString().match(/server listening on (http:\/\/\S+)/)?.[1]
    assert.ok(url, 'OpenCode did not announce its listen URL')
  } finally {
    clearTimeout(startupTimeout)
  }

  const project = await loadProject('project')
  const skills = get(project, '/api/skill')
  const mode = skills.find(skill => skill.id === 'poteto-mode')
  assert.equal(mode?.path, resolve(packagePath, '.agents/skills/poteto-mode/SKILL.md'))
  assert.equal(mode.autoinvoke, false)

  const agents = get(project, '/api/agent')
  const roles = ['poteto-agent', 'comment-sicko']
  const missing = roles.filter(id => !agents.some(agent => agent.id === id && agent.mode === 'subagent'))
  assert.deepEqual(missing, [], `Missing pstack subagents: ${missing.join(', ')}`)
  for (const id of roles) {
    const agent = get(project, `/api/agent/${id}`)
    assert.equal(agent.model, undefined)
    assert.match(agent.system, id === 'poteto-agent' ? /# Poteto subagent/ : /# Comment Sicko/)
  }
  console.log('OpenCode loads the packaged skills and both pstack subagents')

  const overridden = await loadProject('overridden', { 'poteto-agent': { mode: 'subagent', system: 'Project override' } })
  assert.equal(get(overridden, '/api/agent/poteto-agent').system, 'Project override')
  console.log('OpenCode keeps project-defined agents with the same ID')
} finally {
  if (server?.pid && server.exitCode === null && server.signalCode === null) {
    server.kill()
    await once(server, 'exit')
  }
  rmSync(scratch, { recursive: true, force: true })
}
