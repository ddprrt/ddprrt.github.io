---
title: Upgrading Node.js dependencies after a yarn audit
categories:
- JavaScript
- Node.js
- Tooling
---

It's Tuesday! The day of your weekly *dependabot* alerts from GitHub! A nice reminder to check on your projects, and usually just a few clicks worth of work, the automatic update is wonderful.

If it doesn't, a quick `npm audit fix` might be able to do all updates without any issues. Oh wait, this project has a `yarn.lock` file! How should I deal with that? A `yarn audit fix` does not exist and won't happen! What should I do? Check the lockfile manually?

Come on, usually `yarn audit`s look like this:

```bash
4566 vulnerabilities found - Packages audited: 990
Severity: 1 Low | 89 Moderate | 4476 High
✨  Done in 4.66s.
```

🥲

Nah, there's a better way. Or even better ways. Please note that my experiences deal with Yarn versions 1, which are widely used until this day. I didn't take into account upcoming versions like *berry*.


## The maybe-its-good-enough

This is the easiest way. Step 1: Remove your lockfile and `node_modules`!

```bash
$ rm yarn.lock
$ rm -rf node_modules
```

Cool. Step 2. Create a new lockfile by installing everything again.

```bash
$ yarn install
```

Step 3. Check again!

```bash
$ yarn audit
```

Maybe that's all you needed. Just a fresh install of your existing dependencies, where all the peer dependencies got an update to the most recent versions. If that's not good enough, go the long way down.


## The long way down

The long way down includes upgrading your dependencies manually, either by `yarn upgrade` or the more elaborate `yarn upgrade-interactive`


```bash
$ yarn upgrade-interactive
```

The latter one gives you a nice view where you can select which packages you want to update. Also in which state they are: Need an update but are within SEMVER constraints, or do they potentially break everything along the way. SEMVER and Node.js are a double-edged sword. It's great as long people know the constraints and implications of SEMVER and stick to it. That might not be always the case, though.

But hey, let's upgrade everything along the way and see how it turns out.

```bash
23 vulnerabilities found - Packages audited: 1126
Severity: 1 Low | 10 Moderate | 12 High
✨  Done in 1.42s.
```

Nice, that's a lot less than earlier on... there are still a couple of dependencies that are vulnerable. The audit also tells us which versions are affected and which ones feature patches. 

This is actually the part that sometimes makes me a little sad. If you see a couple of version gates in your dependency that fix the problem, it sometimes tells us that developers spend the time to do backports of security fixes just to give folks who are within SEMVER constraints a chance to use the old version of their package.

Still, we're not able to upgrade.

But what we can do is to tell Yarn which version to use for which deep-nested dependency. E.g. if we want to upgrade all uses of `glob-parent`, let's add a `resolution` in our `package.json`


```json
"resolutions": {
  "**/glob-parent": "^5.1.2"
}
```

The pattern here tells us that we want to update all transitive dependencies to version *5.1.2*. If we want to update e.g. just the version of `glob-parent` for `chokidar` to a different version, we would use `chokidar/**/glob-parent` for that. See [selective dependency resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) for more detail.

Did it help? A little bit!


```bash
20 vulnerabilities found - Packages audited: 1122
Severity: 1 Low | 7 Moderate | 12 High
✨  Done in 1.50s.
```

Now let's continue with all the other dependencies as well and enjoy your Tuesday!

## Shortcut

The other solution is to take the shortcut and let NPM handle the audit and fix it. This is the thing I usually do.

First, I install just a `package-lock.json`

```bash
$ npm i --package-lock-only
```

No actual module installations, just an overview of what NPM thinks needs to be done. It boils down to a few dependencies. Those are the ones that are not resolved by a fresh install and need a fix. Instead of showing every dependency resolution, NPM shows the packages that are vulnerable.

```bash
found 3 vulnerabilities (1 low, 2 moderate)
  run `npm audit fix` to fix them, or `npm audit` for details
```

An `audit` gives us more information.


```bash
$ npm audit
                       === npm audit security report ===                        
                                                                                
# Run  npm install --save-dev concurrently@6.2.0  to resolve 1 vulnerability
SEMVER WARNING: Recommended action is a potentially breaking change
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ yargs-parser                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ concurrently [dev]                                           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ concurrently > yargs > yargs-parser                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1500                            │
└───────────────┴──────────────────────────────────────────────────────────────┘


# Run  npm install --save-dev nodemon@2.0.9  to resolve 1 vulnerability
SEMVER WARNING: Recommended action is a potentially breaking change
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Moderate      │ Regular expression denial of service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ glob-parent                                                  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ nodemon [dev]                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ nodemon > chokidar > glob-parent                             │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1751                            │
└───────────────┴──────────────────────────────────────────────────────────────┘


# Run  npm install --save-dev webpack@5.42.1  to resolve 1 vulnerability
SEMVER WARNING: Recommended action is a potentially breaking change
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Moderate      │ Regular expression denial of service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ glob-parent                                                  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ webpack [dev]                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ webpack > watchpack > watchpack-chokidar2 > chokidar >       │
│               │ glob-parent                                                  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1751                            │
└───────────────┴──────────────────────────────────────────────────────────────┘


found 3 vulnerabilities (1 low, 2 moderate) in 1092 scanned packages
  3 vulnerabilities require semver-major dependency updates.
```

NPM has the possibility to auto-fix:

```bash
$ npm audit fix
```

And if there are SEMVER warnings, let's <s>manually check each dependency</s> override all warnings and upgrade anyway.

```bash
$ npm audit fix --force
```

NPM updates everything accordingly. Time to create a new `yarn.lock` file. Remove the old one and call `yarn import`.

```bash
$ rm yarn.lock
$ yarn import
```

Yarn will create the lockfile based on your `package-lock.json`. No need for `package-lock.json` anymore, so let's get rid of it and do another audit.

```bash
$ rm package-lock.json 
$ yarn audit
yarn audit v1.22.10
0 vulnerabilities found - Packages audited: 945
✨  Done in 1.20s.
```

✨ indeed. Commit, push, and get rid of all your *dependabot* alerts.

## A cry for help

This is what I found out while maintaining some projects from the past that screamed red warnings at me because of outdated dependencies. To be fair, I never used Yarn extensively so I can't tell if I missed something peculiar. If I missed something, I'm more than happy to get in contact with you! Cheers!
