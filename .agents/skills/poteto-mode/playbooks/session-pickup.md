### Session pickup

**You own the resume point. Read the prior trail, don't redo it.**

1. Locate the prior session using the adapter's [session history instructions](../references/opencode.md#session-history). Verify the workspace even for a supplied session ID. Read the metadata and last messages first, then page back for the decisions. For a long session, give a subagent the verified ID and exact scope and ask for a timeline per **principle-guard-the-context-window**. Pick its reasoning level per the Subagents section. If the history is unavailable, disclose the gap and use the visible handoff, decision trail, or pushed branch as evidence.
2. Reconstruct operational state. The branch and worktree, what already landed (`git log`, `git diff` against the base), the open todos, the decisions made. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done vs pending. Compare what shipped against what was planned, name the resume point, do not re-run the prior repro or redo completed work. A "let me verify from scratch" pass means you're treating the trail as untrustworthy when it's authoritative.
4. Route the remaining work to the matching playbook and pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. The pickup playbook ends here. The routed playbook owns the rest.
5. Verify the inherited claims against the original goal on the real artifact (the **principle-prove-it-works** skill). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited vs redid (ideally nothing redone), the resume point, and the outcome.
