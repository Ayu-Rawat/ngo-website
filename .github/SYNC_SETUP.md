# Auto-Sync CI/CD Pipeline Setup (Instant Sync)

This repository includes a GitHub Actions workflow that automatically syncs your fork with the upstream repository **instantly** when changes are made to the parent repository.

## How it works

The workflow (`sync-upstream.yml`) will:
- **Trigger instantly** when the parent repository receives new commits
- Run automatically every day at 2 AM UTC (as a fallback)
- Check if there are new commits in the upstream repository
- If changes are found, sync your fork with the upstream repository
- Can also be triggered manually from the GitHub Actions tab

## Setup Instructions

### Step 1: Set up the Parent Repository (change-i-network/Website)

1. **Create Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with these scopes:
     - `repo` (Full control of private repositories)
     - `workflow` (Update GitHub Action workflows)
   - Copy the token (you'll need it in step 3)

2. **Add the trigger workflow**:
   - Copy the file `PARENT_REPO_WORKFLOW.yml` from this repository
   - Place it in the parent repository at: `.github/workflows/trigger-fork-sync.yml`

3. **Add the token as a secret**:
   - In the parent repository, go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FORK_SYNC_TOKEN`
   - Value: Paste the personal access token from step 1

### Step 2: Set up this Fork Repository (Ayu-Rawat/ngo-website)

1. **Enable GitHub Actions** (if not already enabled):
   - Go to your repository on GitHub
   - Click on the "Actions" tab
   - If prompted, click "I understand my workflows, go ahead and enable them"

2. **Grant necessary permissions**:
   - Go to repository Settings → Actions → General
   - Under "Workflow permissions", ensure:
     - "Read and write permissions" is selected
     - "Allow GitHub Actions to create and approve pull requests" is checked

### Step 3: Test the Setup

1. **Test instant sync**:
   - Make a small change to the parent repository
   - Push the change to the main branch
   - Check the Actions tab in your fork - it should trigger automatically within seconds

2. **Test manual sync** (optional):
   - Go to the "Actions" tab in your fork repository
   - Click on "Sync Fork with Upstream" workflow
   - Click "Run workflow" button

## What happens during sync

1. **Instant trigger**: Parent repository pushes trigger this fork's sync workflow
2. **Safety check**: The workflow checks if sync is actually needed
3. **Fetch updates**: Downloads latest changes from upstream repository
4. **Sync main branch**: Updates your main branch to match upstream
5. **Force push**: Pushes the synced changes to your fork

## Trigger Types

### 🚀 Instant Sync (Primary)
- Triggered immediately when parent repository receives new commits
- Responds to both direct pushes and merged pull requests
- Typical delay: 5-15 seconds after parent repo update

### ⏰ Scheduled Sync (Fallback)
- Runs daily at 2 AM UTC as backup
- Ensures sync even if instant triggers fail

### 🔧 Manual Sync (On-demand)
- Can be triggered manually from GitHub Actions tab
- Useful for testing or one-off syncs

## Important Notes

⚠️ **Warning**: This workflow will force-push to your main branch, which means:
- Any commits you made directly to main that aren't in upstream will be lost
- Always create feature branches for your work
- Never commit directly to main branch

✅ **Best practices**:
- Create feature branches for your development work
- Use pull requests to merge changes
- Keep main branch clean and synced with upstream

## Security Considerations

- The personal access token has repo access - keep it secure
- Only trusted maintainers should have access to the parent repo's secrets
- Token can be regenerated if compromised

## Troubleshooting

### Sync not triggering instantly:
1. Check if the parent repo workflow is enabled
2. Verify the `FORK_SYNC_TOKEN` secret exists and is valid
3. Check the parent repo's Actions tab for failed runs

### Permission errors:
1. Ensure the personal access token has `repo` and `workflow` scopes
2. Check that Actions are enabled in both repositories
3. Verify workflow permissions are set to "Read and write"

### Manual testing:
- Use the workflow_dispatch trigger to test the sync manually
- Check the Actions tab logs for detailed error messages

## Customization

You can customize the sync schedule by modifying the cron expression in the workflow file:
```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

Common alternatives:
- `'0 2 * * 1'` - Weekly on Mondays at 2 AM UTC
- `'0 2 */3 * *'` - Every 3 days at 2 AM UTC
- `'0 */6 * * *'` - Every 6 hours

## Monitoring

You can monitor the sync status by:
1. Going to the "Actions" tab in your repository
2. Viewing the "Sync Fork with Upstream" workflow runs
3. Each run will show whether sync was needed and the result