# snipper :gun:

> Run JavaScript snippets from your markdown files.

# (╯°□°)--︻デ═一 - - -

## TODO

### V1
- [ ] CLI
  - [ ] Configuration (`.snipper.js(on)?|.snipperrc`).
  - [ ] Missing flags (?).
  - [ ] `--help`.
  - [x] Log failures. 
- [ ] [Snippet metadata](#snippet-metadata). Using MD snippets flags (?)

### Future

- [ ] CLI
  - [ ] Improve current interface. _Jest like interface when running/watching_.
  - [ ] Watch mode.
  - [ ] Run multiple files.
- [ ] Transpile with Babel. _Check for project Babel config_. (?)
- [ ] Lint with Eslint. _If project has Eslint configured_.(?)
- [ ] Environment. _Use [`jsdom`](https://github.com/tmpvar/jsdom)_?

## Docs


### Snippet metadata

There are a couple of directives available to configure how snippets are run
indivitually.

**NOTE**: directives must go in the same line as the snippet opening tag (` ```js `) preceded by a hash `#`.

- **skip**: use this directive if you want to skip the snippet from being run. It does not make sense to add any other directives alogside this one.
```
```js # (skip)
```
- **fail**: use this directive when the snippet is expected to fail.
```
```js # (fail)
```
- **no-globals**: use this directive to skip global dependencies injection to the current snippet.
```
```js # (no-globals)
```
- **deps**: use this directive to list dependencies to be injected only to this snippet.
  - `(name:path)`: Specify name and path.
  - `(name)`: Shorthand when the name is the same as the path
```
```js # (deps (trae) (pkg:./package.json))
```
- **env** & **template**: specify the environment to run the snippet on. For `jsdom` you can also specify a template, wheater it is a file or just markup. The template directive is omitted when running in `node` environment.
```
```js # (env:jsdom) (template:'<div id="app"></div>') 
```js # (env:jsdom) (template:./assets/snippet.html)
```js # (env:node)
```
