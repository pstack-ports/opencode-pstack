# Porting pstack to OpenCode

## Source baseline

The port tracks Lauren Tan's [pstack 0.15.46](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack) at commit `7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9`. From the [team kit at the same revision](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/cursor-team-kit/skills), import only Eric Zakariasson's `deslop`, `control-cli`, and `control-ui`. Keep the [license](LICENSE), assets, and executable bits with the source.

## What belongs where

- [index.js](index.js) registers the skills and subagents with OpenCode through `@opencode/plugin`. Keep project overrides and disabled agents intact.
- Each [skill](.agents/skills/) lives in its own directory with a `SKILL.md` entry point. Keep playbooks, scripts, and tests beside the skill that owns them. Resolve links and scripts from the installed bundle, even when working in a different repository.
- [agents/](agents/) holds the `poteto-agent` and `comment-sicko` role definitions. Preserve their permissions; the reviewer cannot edit files or run shell commands.
- The [OpenCode adapter](.agents/skills/poteto-mode/references/opencode.md) defines skill invocation, tool names, model inheritance, session history, and scheduling. Update it when an OpenCode capability changes.

## Updating the port

1. Diff the new source revision against the pin above. Inventory added, moved, and removed skills before copying files. Keep the source host's manifests, Benny automation pack, and bot UI skill out of the bundle and user guide.
2. Import changes to portable workflows, assets, and scripts. Check new instructions for editor-specific commands, directories, and services. Use OpenCode subagents with isolated worktrees for parallel edits. Only promise unattended execution when OpenCode confirms a schedule.
3. Preserve workspace boundaries. Verify both location and subpath before reading session messages; the list endpoint can include root sessions in subpath results. Keep the [worktree audit](.agents/skills/poteto-mode/scripts/worktree-audit.sh) on NUL-delimited Git records so paths containing spaces survive. Its optional transcript input must come from an explicitly scoped `PSTACK_TRANSCRIPTS_DIR`.
4. Update the revision above and the version in [package.json](package.json). Review its `files` list whenever a bundled directory or document moves.

## Verify a sync

From the repository root, with OpenCode 2.4.1 or later on `PATH`:

```sh
npm install --no-package-lock
node test/opencode.mjs
npm pack --dry-run
git diff --check
```

The integration test loads the plugin in temporary projects, checks skill and agent registration, and verifies agent overrides and reviewer permissions. Inspect the package listing for omitted skills, scripts, and documentation before publishing.
