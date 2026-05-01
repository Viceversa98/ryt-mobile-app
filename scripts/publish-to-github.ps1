# Creates a GitHub repo (if missing) and pushes the current branch.
# Prerequisite: run `gh auth login` once in this machine's terminal.

$ErrorActionPreference = "Stop"

$repoName =
  if ($args.Count -ge 1 -and $args[0]) { $args[0] }
  else { "ryt-mobile-app" }

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "GitHub CLI is not logged in. Run this first:"
  Write-Host "  gh auth login"
  exit 1
}

Push-Location (Split-Path $PSScriptRoot -Parent)

try {
  $hasOrigin = git remote get-url origin 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote 'origin' exists. Pushing..."
    git push -u origin $(git branch --show-current)
    exit 0
  }

  Write-Host "Creating GitHub repo '$repoName' and pushing..."
  gh repo create $repoName --public --source=. --remote=origin --push -y
}
finally {
  Pop-Location
}
