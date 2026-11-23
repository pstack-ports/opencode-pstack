import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Plugin } from '@opencode/plugin'
import { parse } from 'yaml'

const root = fileURLToPath(new URL('./.agents/skills/', import.meta.url))

export default Plugin.define({
  id: 'opencode-pstack',
  async setup(ctx) {
    const skills = []
    for (const entry of await readdir(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const path = join(root, entry.name, 'SKILL.md')
      const source = await readFile(path, 'utf8')
      const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source)
      if (!match) throw new Error(`Missing skill frontmatter: ${path}`)
      const meta = parse(match[1])
      skills.push({ id: entry.name, name: meta.name, description: meta.description,
        autoinvoke: meta['disable-model-invocation'] !== true,
        path, content: source.slice(match[0].length).trim() })
    }
    await ctx.skill.transform(editor => {
      for (const skill of skills) if (!editor.get(skill.id)) editor.add(skill)
    })
  },
})
