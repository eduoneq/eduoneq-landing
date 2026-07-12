# EDU ONEQ repository instructions

This file is the shared operating contract for Codex, Claude Code, IDE agents, and humans.

## Source of truth and deployment

- GitHub repository: `https://github.com/eduoneq/eduoneq-landing`
- Production site: `https://eduoneq.com`
- `main` is the production branch. Vercel deploys it automatically.
- Never edit production files directly in Vercel. Make changes here, validate, commit, and push.
- Do not commit secrets. Local secrets belong in `.env.local`; production secrets belong in Vercel Environment Variables.

## Working safely

1. Before editing, run `git status --short --branch` and `git pull --ff-only` when the tree is clean.
2. Use a short-lived branch named `codex/<topic>`, `claude/<topic>`, or `dev/<topic>`.
3. If another agent is working at the same time, use a separate clone or Git worktree. Never let two agents edit the same working tree concurrently.
4. Preserve unrelated and untracked user files. Do not stage them accidentally.
5. Run `./scripts/validate.sh` before committing.
6. Push the branch and merge it into `main` only after review or a verified preview deployment.
7. After merge, verify both the Vercel deployment and `https://eduoneq.com`.

## Project facts

- This is a static HTML/CSS/JavaScript site with Vercel serverless functions in `api/`.
- There is no package install or build step.
- Local preview: `python3 -m http.server 8000`, then open `http://localhost:8000/`.
- The consultation API only works fully on Vercel because it needs server-side environment variables.
- Keep `.env.example` limited to placeholder values.

See `DEVELOPMENT.md` for setup, handoff, worktree, and deployment commands.
