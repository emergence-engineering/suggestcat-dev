# suggestcat-dev :pencil2:

## pnpm workspace

### :warning: WARNING:exclamation::skull: 
:warning: :stop_sign:  **DO NOT USE `npm`** - we are using `pnpm` from now on, even in the submodules, even if you clone just the submodule!!!! :exclamation:

- in case you use `npm` please make sure not to commit package-lock.json
- in case you have something IDE specific file/folder which should be `gitignored`, please include it in `.gitignore`:exclamation:

### dev environment
- modules inside `/packages` are git submodules, meaning they are all separate git projects, will be refered to as `workspace(s)`
- if you make changes in any of the workspaces, changes should be commited and pushed inside that specific folder
- changes outside of the `/packages` should be commited from the root folder to this github repo
- inside `/app` folder there is a create-react-app project, which is part of this project - not a git submodule

### prerequisites :clipboard:
Before running the project for the first time, ensure that you have completed the following steps:
```sh
npm install -g pnpm # just for the first time, install `pnpm`
```
```sh
pnpm -r exec rm -rf node_modules # just for the first time, remove all `node_modules`
```
```sh
corepack enable
```
If you installed Node.js using Homebrew, you'll need to install corepack separately:
```sh
brew install corepack
```
you may need to set github access tokens for submodules:\
`remote: Permission to emergence-engineering/<git-repo>.git denied to optimistiks.`
```sh
git remote remove origin
# replace <access-token> with your access token
# replace <git-repo> with a git submodule name
git remote add origin https://<access-token>@github.com/emergence-engineering/<git-repo>.git
```

### start project :rocket:
```sh
pnpm install # installs packages in all workspaces
```
```sh
pnpm run dev-all # runs all workspaces inside `/packages` using `concurrently`
```
```sh
pnpm --filter editor run start # in another terminal starts the CRA project inside `/apps/editor`
```

### tips & tricks :wrench: 
- Prune `node_modules` installations for all packages:\
`pnpm -r exec rm -rf node_modules`
- run a package.json script in a specific workspace\
`pnpm --filter <project name> <cmd>`
- run a package.json script in all workspaces\
`pnpm -r run <cmd>`

**For more information about `pnpm` read the [workspaces docs](https://pnpm.io/workspaces)** :books:

### publishing submodules to npm registry :package:
generate a new changeset
```sh
# in the root of the repository
pnpm changeset # select workspaces that need a new version
```
 following will bump the versions of the packages previously specified with pnpm changeset (and any dependents of those) and update the changelog files.
```sh
pnpm changeset version # in the root of the repository
```
```sh
pnpm install # in the root of the repository
```
```sh
pnpm publish # in the workspace root you want to publish from
```
add git tags
```sh
git tag v0.1.5 --annotate -m "message" # change v0.1.5 with the current version
git push --tags # push tags to github
```

**[for full documentation read pnpm changeset docs :books:](https://pnpm.io/using-changesets)**\
