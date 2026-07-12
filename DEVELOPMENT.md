# Shared development and deployment

GitHub is the single source of truth. Codex, Claude Code, local editors, and other machines use independent credentials but exchange work through branches and commits.

## One-time setup on any machine

```bash
gh auth login
git clone https://github.com/eduoneq/eduoneq-landing.git eduoneq.com
cd eduoneq.com
./scripts/validate.sh
python3 -m http.server 8000
```

Claude Code and Codex can both be launched from this directory. Their subscriptions, sessions, and tokens remain separate; no API key needs to be copied between them.

## Start and hand off work

```bash
git status --short --branch
git pull --ff-only
git switch -c claude/example-change  # use codex/ or dev/ as appropriate
```

Before handing work to another tool or machine:

```bash
./scripts/validate.sh
git add <only-the-files-for-this-change>
git commit -m "Describe the completed change"
git push -u origin HEAD
```

The next tool continues with:

```bash
git fetch origin
git switch <branch-name>
git pull --ff-only
```

Do not use uncommitted files as a handoff mechanism. A commit may be a work-in-progress commit on a feature branch; keep `main` deployable.

## Concurrent local agents

Use one worktree per agent so edits and branch state cannot collide:

```bash
git fetch origin
git worktree add ../eduoneq-codex -b codex/example origin/main
git worktree add ../eduoneq-claude -b claude/example origin/main
```

Each agent runs in its own directory. Integrate through GitHub commits or a deliberate local merge, not by editing the same files simultaneously.

## Deployment model

- Feature branch push: Vercel can create a preview deployment.
- Merge/push to `main`: Vercel creates the production deployment.
- Production domain: `https://eduoneq.com` (including `www`).
- GitHub Pages and GitHub Actions are not the hosting path.
- Runtime secrets are configured in Vercel, never committed to GitHub.

Verify a release with:

```bash
gh api repos/eduoneq/eduoneq-landing/deployments --jq '.[0] | {id,sha,environment,created_at}'
curl -fsSI https://eduoneq.com
```

If Vercel is disconnected, reconnect the `eduoneq/eduoneq-landing` repository in the Vercel project and set the production branch to `main`.

## Recovery rules

- If one AI tool runs out of quota, commit and push its branch, then continue from that branch with another tool.
- If the current tree has unrelated changes, do not discard them; create a new worktree from `origin/main`.
- Never force-push `main` or store Vercel/GitHub/API tokens in repository files.
