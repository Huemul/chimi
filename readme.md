# snipper :gun:

> Run JavaScript snippets from your markdown files.

# (╯°□°)--︻デ═一 - - -

## TODO

### V1
- [ ] CLI
  - [ ] Configuration (`.snipper.js(on)?`)
  - [ ] Run multiple files (best effort).
  - [ ] Log failures. 
  - [ ] Watch mode (best effort).
- [ ] Environment. _Use [`jsdom`](https://github.com/tmpvar/jsdom)_?

### Future

- [ ] CLI
  - [ ] Jest like interface when running/watching.
- [ ] Transpile with Babel. _Check for project Babel config_. (?)
- [ ] Lint with Eslint. _If project has Eslint configured_.(?)
- [ ] Snippet metadata. Using MD snippets flags (?)
  - List local dependencies: **\`\`\`js,(dependencies (_:lodash)(trae:trae))**
  - Skip snippets: **\`\`\`js,skip**
  - Expect to fail: **\`\`\`js,throws**
  - Groups: **\`\`\`js,(group (example:1)) \`\`\`js,(group (example:2))**
