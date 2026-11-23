# pstack for OpenCode

OpenCode port of Lauren Tan's [pstack 0.15.46](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack). Following the [Codex port](https://github.com/pstack-ports/codex-pstack), this checkout includes the `deslop`, `control-cli`, and `control-ui` companion skills from the same upstream revision.

See [UPSTREAM.md](./UPSTREAM.md) for the source pin, port scope, and notes for future syncs.

## Install

Install globally with OpenCode 2.4.1 or later:

```sh
opencode plugin add github:pstack-ports/opencode-pstack
```

The plugin registers the bundled `.agents/skills/` directory's skills in each project. Check the installation with `opencode plugin list`.

## Use it

Open your target project in OpenCode and type `@poteto-help`. Select the skill and ask which workflow fits your task to confirm the installation. Use `@setup-pstack` to choose model preferences or `@poteto-mode` to start work. Inside the pstack checkout itself, OpenCode discovers `.agents/skills/` without any configuration.

The [skill collection](.agents/skills/) and [guide](docs/guide/README.md) preserve upstream workflow terminology. Read `/name` examples as `@name`. The [OpenCode adapter](.agents/skills/poteto-mode/references/opencode.md) maps tool names, delegation, and model defaults. Cursor plugin registration and the Cursor-only Benny automation pack are omitted.
