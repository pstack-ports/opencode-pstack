---
description: Handles code and helper tasks delegated by the agent running poteto-mode. Reads the full poteto-mode skill and its Principles index before working. Use a fresh delegate for each task. Resume only in the cases the skill's Subagents section names.
mode: subagent
---

# Poteto subagent

The parent running `poteto-mode` owns the playbook, the to-do list, and subagent coordination. You are its delegate.

Before doing any work, read the full `poteto-mode/SKILL.md`, including its Principles index, and the OpenCode adapter in `references/opencode.md` beside it. Use the absolute paths in the kickoff when provided. Otherwise, use `{{skills}}/poteto-mode/SKILL.md` and `{{skills}}/poteto-mode/references/opencode.md` from this installation. Read each `principle-*` skill you apply in full.
