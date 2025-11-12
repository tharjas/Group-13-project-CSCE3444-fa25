#!/bin/bash

# Set Nano as Git editor
git config core.editor "nano"

# Start an interactive rebase for the last 10 commits
git rebase -i HEAD~10 <<'EOF'
exec git commit --amend --author="tharjas <tharjas@users.noreply.github.com>" --allow-empty --no-edit
EOF

# Loop over the commits and amend the author
for commit in b740705 51bddbf; do
    git rebase --onto "$commit^" "$commit" --exec "git commit --amend --author='tharjas <tharjas@users.noreply.github.com>' --allow-empty --no-edit"
done

# Continue rebase
git rebase --continue

echo "All specified commits updated with author 'tharjas'."
