# Upstream sources

The source snapshot in `2693dd5` imports two directories from `cursor/plugins` at `7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9`:

- [pstack/](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack): pstack `0.15.46` by Lauren Tan, including the original [MIT license](./LICENSE) and assets.
- [cursor-team-kit/skills/](https://github.com/cursor/plugins/tree/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/cursor-team-kit/skills): the `deslop`, `control-cli`, and `control-ui` companion skills by Eric Zakariasson.

The OpenCode changes are in the next commit, `096fa44`. Skills live only in `.agents/skills/` and use one [OpenCode adapter](./.agents/skills/poteto-mode/references/opencode.md). The model setup workflow and worktree audit were adapted from [codex-pstack at `db7f20d`](https://github.com/pstack-ports/codex-pstack/tree/db7f20d5010529ece9e1af5d79d41ab9af569528).

## Future upstream syncs

- Skip the Cursor plugin manifests and `pstack/automations/benny/`. The Benny pack depends on Cursor Automations.
- Preserve the [worktree audit](./.agents/skills/poteto-mode/scripts/worktree-audit.sh) fix for paths containing spaces. It reads NUL-delimited records from `git worktree list --porcelain -z`. Drop that patch once upstream handles those paths correctly. Keep transcript lookup scoped to `PSTACK_TRANSCRIPTS_DIR` for OpenCode.
