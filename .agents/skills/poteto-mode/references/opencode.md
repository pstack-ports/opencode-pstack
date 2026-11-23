# Running pstack in OpenCode

Apply these mappings whenever a bundled workflow uses upstream host terminology. OpenCode permissions and the user's request take precedence.

- `/name` in a playbook means the `name` skill: users mention `@name`; agents load it by exact ID with `skill`. Create project skills under `.agents/skills/` and personal skills under `~/.agents/skills/`. Resolve bundled files relative to the installed skill's real directory. An upstream `pstack/skills/` path means this checkout's `.agents/skills/`, not a path in the user's project.
- `Task` means the available subagent tool. Use a registered agent and include the requested role brief from `agents/` at the checkout root. Pass absolute paths, including this adapter, and use the returned session ID for follow-ups. Use isolated worktrees for parallel edits. Do not assume cloud workers or a persistent Project dashboard exist.
- Use the native file, shell and question tools for `Read`, `Shell` and `AskQuestion`. Use the repository's forge integration for PRs. Report unavailable tools and independent checks explicitly.
- Read `.agents/pstack-models.md` in the target project, falling back to `~/.agents/pstack-models.md`. Without an explicit model choice, omit the override and inherit the session model. Preserve panel size; do not guess provider IDs or reasoning variants from upstream examples.
- For transcript instructions use OpenCode session history scoped to the target workspace, never Cursor transcript paths. If history is unavailable, use the visible conversation and disclose that limit. `worktree-audit.sh` accepts an optional workspace-scoped `PSTACK_TRANSCRIPTS_DIR`.
- Cursor UI gestures, cloud routines, webhook endpoints and marketplace commands are upstream examples. Do not use those services. Use an explicitly configured integration when available; otherwise report the missing prerequisite. Do not claim an unattended run is scheduled without a confirmed runner.
