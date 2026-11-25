---
name: setup-pstack
description: Configure the available OpenCode models and reasoning effort pstack uses per role. Use for @setup-pstack, configure pstack models, pstack budget, or changing model choices.
---

Before following this workflow, read the [OpenCode adapter](../poteto-mode/references/opencode.md) once per session.

# Setup pstack

Write `.agents/pstack-models.md` in the active project. Use `~/.agents/pstack-models.md` only when the user asks for personal settings. Project settings take precedence. Every pstack skill explicitly reads this configuration through the adapter; it is not an automatically applied OpenCode rule.

## 1. Detect available choices and load current state

Use the actual subagent tool schema or a model-list capability exposed by this OpenCode session. Validate reasoning levels separately from model IDs. Do not infer entitlement from public documentation or copy a model slug from upstream. If the host cannot enumerate overrides, offer `inherit-parent` and `auto`; ask for a validated model only when the user wants an override.

Read project configuration first, otherwise personal configuration. The default role-to-model mapping is the shape in section 3. If a configuration file already exists, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from those defaults. A line whose role is not in section 3, such as `hardest tasks`, `architect runners`, `reflect tooling`, or `why investigators`, is from a retired role. Drop it.

Validate existing overrides against the current OpenCode model list. Flag unavailable entries and ask for a replacement before rewriting the file.

With no file, every role inherits the parent model and reasoning. `arena runners` and `interrogate reviewers` are three seats on the parent model. `arena cross-judge pool` is two.

## 2. Choose the budget and models

Use the available user-input tool, or a concise text question when it is unavailable. Offer:

- `inherit-parent` — keep the session's model and reasoning
- `large` — xhigh reasoning when supported
- `medium` — high reasoning when supported
- `small` — medium reasoning when supported

A budget changes only explicit reasoning levels. `inherit-parent` and `auto` do not change. For an explicit entry, move its reasoning level on the ladder `xhigh` > `high` > `medium` > `low`: `large` keeps it, `medium` lowers it one step, and `small` lowers it two steps. No role runs above `xhigh`, and a target at the bottom of the ladder stays there. Choose a supported level at or below the target. If none is known, leave effort inherited and disclose it. Model IDs and reasoning are separate values; never construct an effort-suffixed model slug.

Show all roles and their values, plus any removed retired roles. Let the user accept or change specific roles. A scalar role takes `inherit-parent`, `auto`, `<validated-model>`, or `<validated-model> <validated-effort>`. Panel roles take comma-separated entries; every entry, including aliases, creates one seat. `arena cross-judge pool` is a pool, but Arena runs one judge. It tries only values from a vendor other than the parent's, in list order, so order it by preference. An `inherit-parent` or `auto` value never judges.

## 3. Validate and write

Every explicit model and reasoning level must be supported by the session. Never guess a replacement when a model is unavailable. Explain the issue and keep the previous configuration until the user chooses a valid value. No role runs above `xhigh`.

Write the complete file idempotently, preserving the chosen scope. No YAML frontmatter is needed. Default shape:

```text
# pstack model configuration. Missing roles inherit the parent.
# defaults: 3
# budget: inherit-parent
feature, refactoring: inherit-parent
bug-fix: inherit-parent
perf-issue: inherit-parent
hillclimb: inherit-parent
judgment and prose: inherit-parent
arena runners: inherit-parent, inherit-parent, inherit-parent
arena cross-judge pool: inherit-parent, inherit-parent
swarm workers: inherit-parent
interrogate reviewers: inherit-parent, inherit-parent, inherit-parent
```

Role labels can contain commas. Split a line at its first colon before parsing its scalar or panel value. Do not change OpenCode's global model configuration, managed settings, or `AGENTS.md`.

## 4. Confirm and offer verification

Report the written path and any supported-override limitations. The next pstack task reads the file; a restart is unnecessary.

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with @create-verification-skill." On yes, invoke `@create-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.

Check whether the project already has a formal verification skill (a project skill that runs a model checker, a proof, or another verifier against the code). If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with @create-formal-verification-skill." On yes, invoke `@create-formal-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.

New skills always go in `.agents/skills/`.
