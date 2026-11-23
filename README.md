# pstack for OpenCode

OpenCode port of Lauren Tan's [pstack 0.15.46](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack). Following the [Codex port](https://github.com/pstack-ports/codex-pstack), this checkout includes the `deslop`, `control-cli`, and `control-ui` companion skills from the same upstream revision.

## Use it

Open this checkout in OpenCode. It discovers the skills directly from `.agents/skills/`. Mention `@setup-pstack` to choose model preferences, or start a task with `@poteto-mode`. Use `@poteto-help` for the workflow guide.

To use the skills from another project, keep this checkout in place and add its absolute skill directory to that project's `opencode.json` (or your global OpenCode config):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": ["/absolute/path/to/opencode-pstack/.agents/skills"]
}
```

The [skill collection](.agents/skills/) and [guide](docs/guide/README.md) preserve upstream workflow terminology. Read `/name` examples as `@name`. The [OpenCode adapter](.agents/skills/poteto-mode/references/opencode.md) maps tool names, delegation, and model defaults. Cursor plugin registration and the Cursor-only Benny automation pack are omitted.
