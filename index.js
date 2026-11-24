import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Plugin } from '@opencode/plugin'
import { parse } from 'yaml'

const skillsRoot = fileURLToPath(new URL('./.agents/skills', import.meta.url))
const agentsRoot = fileURLToPath(new URL('./agents', import.meta.url))

async function readMarkdown(path) {
  const source = await readFile(path, 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source)
  if (!match) throw new Error(`Missing frontmatter: ${path}`)
  return { meta: parse(match[1]), content: source.slice(match[0].length).trim() }
}

export default Plugin.define({
  id: 'opencode-pstack',
  async setup(ctx) {
    const skills = []
    for (const entry of await readdir(skillsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const path = join(skillsRoot, entry.name, 'SKILL.md')
      const { meta, content } = await readMarkdown(path)
      skills.push({ id: entry.name, name: meta.name, description: meta.description,
        autoinvoke: meta['disable-model-invocation'] !== true, path, content })
    }
    await ctx.skill.transform(editor => {
      for (const skill of skills) if (!editor.get(skill.id)) editor.add(skill)
    })

    const agents = []
    for (const entry of await readdir(agentsRoot, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue
      const { meta, content } = await readMarkdown(join(agentsRoot, entry.name))
      const { description, mode, permissions } = meta
      agents.push({ id: basename(entry.name, '.md'), description, mode, permissions,
        system: content.replaceAll('{{skills}}', () => skillsRoot) })
    }
    await ctx.agent.transform(editor => {
      for (const { id, permissions, ...fields } of agents) {
        if (editor.get(id)) continue
        editor.update(id, draft => {
          Object.assign(draft, fields)
          if (permissions) {
            const defaults = draft.permissions.filter(rule =>
              rule.effect === 'deny' || permissions.some(permission =>
                permission.effect === 'allow' && permission.action === rule.action))
            draft.permissions = [...permissions, ...defaults]
          }
        })
      }
    })
  },
})
