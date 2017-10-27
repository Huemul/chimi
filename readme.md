# chimi

> Validate JavaScript code from your README.

## How it works

`chimi` parses Markdown files and runs the JavaScript snippets to check if everything is alright.

## Installation

```bash
$ yarn add chimi --dev
$ npm i chimi --save-dev

# global works too

$ yarn global add chimi
$ npm i -g chimi
```

# Usage

```
  Run JavaScript snippets from your markdown files

  Usage
  $ chimi -f <file>

  Options
    --file,    -f      File or glob matching multiple files (default: "README.md")
    --help,    -h      Show help
    --silent           Prevent snippets from printing messages through the console
    --version, -v, -V  Show version

  Examples
    $ chimi -f README.md

    $ chimi -f doc/*.md
```

## Configuration

To let `chimi` find the snippets you have to indicate the snippet language using either `js` or `javascript` like so:

```
```js
```

```
```javascript
```

You can configure `chimi` using a configuration file, it might be a JSON or JavaScript file and also an object as the `chimi` property in the `package.json`:

```
{
  "dependencies": [
    "trae",
    { "module": "lodash", "name": "_" },
    { "module": "./config", "name": "config" },
    { "module": "es6-promise" }
  ],
  "globals": {
    "answer": 42,
    "add": "(a, b) => a + b",
    "message": "'hello world'",
    "fruits": "['orange', 'apple']",
    "config": "{ port: 8080 }",
  },
  "file": "readme.md",
  "timeout": 5000
}
```
**NOTE**: _the `.chimirc` file has to be a valid JSON_.

**NOTE**: _if it is a JavaScript file, an object has to be exported_.

### `dependencies`: `Array<string|object>`

A list of dependencies to be `require`d on each snippet. 

Pass a string when the variable name and the module to be required are equal. To cover other cases you can pass an object with variable name as the `name` property, the module as the `module` property, if the name is missing the require will not have an assignment.

The depenencies in the example will generate these `require`s:
```js
const trae   = require('trae')
const _      = require('lodash')
const config = require('./config')

require('es6-promise')
```

These dependencies will be added to your snippet before running it so you don't have to do it on every snippet.

### `globals`: `object`

A list of variable declarations to add on each snippet. Each key represents the variable name and the value is, well, the value.

The globals in the example will generate these declarations:
```js
let answer  = 42
let add     = (a, b) => a + b
let message = 'hello world'
let fruits  = ['orange', 'apple']
let port    = { port: 8080 }
```

**NOTE**: _strings must be quoted_. E.g. consider the following example.

```
{
  "globals": {
    "wrong": "hello world"
    "right": "'hello world'"
  }
}
```

```js
let wrong = hello world
let right = 'hello world'
```

### `file`: `string`

Default: `README.md`.

The path to the file/s you want to parse. It can also be a [glob](https://github.com/isaacs/node-glob#glob-primer). Be sure to specify only `.md` files.

### `timeout`: `number`

Default: `5000`.

The time, in miliseconds, to wait for the snippet execution before considering it a failure.

### Snippet annotations

Markdown snippets can be annotated by adding extra stuff on the same line as the language. Don't worry this annotations do not show on the web.

Chimi supports the following annotations:

#### Skip

To skip a snippet:

```
```js (skip)
```

## TODO

### V1
- [ ] Tests
- [x] CLI
  - [x] Configuration (`.chimi.js(on)?|.chimirc`).
  - [x] `--help`.
  - [x] Log failures.
  - [ ] Debug option for printing the wrapped snippet.

### Future

- [ ] CLI
  - [ ] Improve current interface. _Jest like interface when running/watching_.
- [ ] Process code
  - [ ] Transpile with Babel. _Check for project Babel config_. (?)
  - [ ] Lint with Eslint. _If project has Eslint configured_.(?)
- [ ] Environment. _Use [`jsdom`](https://github.com/tmpvar/jsdom)_?
- [ ] Snippet metadata. _Using MD snippets flags_
- [ ] Provide a programmatic API.

