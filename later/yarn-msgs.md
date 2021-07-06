---
title: Upgrading Node.js dependencies after a yarn audit
categories:
- JavaScript
- Node.js
- Tooling
---

## The long way down

```
4566 vulnerabilities found - Packages audited: 990
Severity: 1 Low | 89 Moderate | 4476 High
✨  Done in 4.66s.
```

```bash
$ yarn upgrade-interactive
```

```
23 vulnerabilities found - Packages audited: 1126
Severity: 1 Low | 10 Moderate | 12 High
✨  Done in 1.42s.
```



```
20 vulnerabilities found - Packages audited: 1122
Severity: 1 Low | 7 Moderate | 12 High
✨  Done in 1.50s.
```

```json
"resolutions": {
  "**/glob-parent": "^5.1.2"
}
```


## Shortcut


```bash
$ npm i --package-lock-only
```

```
found 3 vulnerabilities (1 low, 2 moderate)
  run `npm audit fix` to fix them, or `npm audit` for details
```

```bash
$ npm audit
```

```
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

```bash
$ npm audit fix
```

```bash
$ npm audit fix --force
```

```bash
$ rm yarn.lock
$ yarn import
```

```bash
$ rm package-lock.json 
$ yarn audit
```

```
yarn audit v1.22.10
0 vulnerabilities found - Packages audited: 945
✨  Done in 1.20s.
```
