# pstack for OpenCode

OpenCode port of Lauren Tan's [pstack 0.15.46](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack). Following the [Codex port](https://github.com/pstack-ports/codex-pstack), this checkout includes the `deslop`, `control-cli`, and `control-ui` companion skills from the same upstream revision.

See [UPSTREAM.md](./UPSTREAM.md) for the source pin, port scope, and notes for future syncs.

## Install

pstack installs as an OpenCode skill collection. Clone this repository into a permanent location. Replace `REPO_URL` with this repository's clone URL:

```sh
git clone REPO_URL "$HOME/opencode-pstack"
```

For **all projects**, add the `skills` entry below to `~/.config/opencode/opencode.json`. For **one project**, use `opencode.json` in that project's root instead. If the file already has a `skills` array, append the path to it.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": ["~/opencode-pstack/.agents/skills"]
}
```

## Use it

Open your target project in OpenCode and type `@poteto-help`. Select the skill and ask which workflow fits your task to confirm the installation. Use `@setup-pstack` to choose model preferences or `@poteto-mode` to start work. Inside the pstack checkout itself, OpenCode discovers `.agents/skills/` without any configuration.

The [skill collection](.agents/skills/) and [guide](docs/guide/README.md) preserve upstream workflow terminology. Read `/name` examples as `@name`. The [OpenCode adapter](.agents/skills/poteto-mode/references/opencode.md) maps tool names, delegation, and model defaults. Cursor plugin registration and the Cursor-only Benny automation pack are omitted.
