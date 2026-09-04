cd eif-fe

git ls-files 'scripts/*.sh' 'scripts/**/*.sh' |
while read -r f; do
  git update-index --chmod=+x "$f"
done

git status
git diff --summary

#

git commit -m "fix(ci): mark shell scripts executable"
git push

#

npm ci

npx prettier --write "src/**/*.{ts,tsx,js,jsx,css}" "scripts/**/*.{mjs,js}" "*.{json,mjs,ts}"

npx prettier --check "src/**/*.{ts,tsx,js,jsx,css}" "scripts/**/*.{mjs,js}" "*.{json,mjs,ts}"

#

git status
git add .
git commit -m "style: format frontend with prettier"
git push