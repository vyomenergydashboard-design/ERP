# Rule: No Unsolicited Codebase Modifications

## Strict Principle
When not explicitly asked to make changes to the codebase, **DO NOT modify the codebase**.

## Specific Guidelines
1. **Testing & Queries:** When asked to test, check edge cases, query, explain, analyze, or verify behavior:
   - Use non-destructive database queries or external read-only checks.
   - If an edge-case test requires running assertions, use self-contained scratch test scripts that do not alter codebase source files.
   - Do NOT implement missing features, modify endpoints, add UI buttons, or alter components unless the user explicitly requests implementation or changes.
2. **Explicit Consent Required:**
   - Always ask for explicit user confirmation before modifying source files when the original ask was purely exploratory or testing-oriented.
