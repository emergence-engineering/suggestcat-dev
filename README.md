# suggestcat-dev :pencil2:

## pnpm workspace

### dev environment
- modules inside `/packages` are git submodules, meaning they are all separate git projects, will be refered to as `workspace(s)`
- if you make changes in any of the workspaces, changes should be commited and pushed inside that specific folder
- changes outside of the `/packages` should be commited from the root folder to this github package
- inside `/app` folder there is a create-react-app project, which is part of this project - not a git submodule

### start project
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

### :warning: WARNING:exclamation::skull: 
:warning: :stop_sign:  **DO NOT USE `npm`** - we are using `pnpm` from now on, even in the submodules, even if you clone just the submodule!!!! :exclamation:

- in case you use `npm` please make sure not to commit package-lock.json
- in case you have something IDE specific file/folder which should be `gitignored`, please include it in `.gitignore`:exclamation:

**For more information about `pnpm` read the [workspaces docs](https://pnpm.io/workspaces)** :books:
