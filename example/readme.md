# chimi example

this is an example project using `chimi` to test Markdown snippets

## run example

`chimi` uses a config file, by default it will look for `.chimirc` but you can indicate other file.

```bash
$ npm test                       # uses .chimirc
$ npm test -- -c chimi.json      # uses chimi.json
$ npm test -- -c chimi.config.js # uses exported object from chimi.config.js
$ npm test -- -c package.json    # uses the property "chimi" from package.json
```

## snippets

```js
const foo = {
  bar: 'bar'
}

console.log(foo)
```

### With dependencies

The dependences are defined in `.chimirc` and chimi requires them when running the snippet.
You can require them yourself, but is a handy way to omit requiring a dependency in every snippet.

Using a local dependency (from `math.js`)
```js
add(1, 2)
```

Using a third party dependency (from `npm`)
```js
trae.baseUrl('http://swapi.co/api/')

trae.after(r => r.data)

trae.get('people/1')
  .then(data => console.log(data))
```

### Timeout

This snippet will not finish running. _The default timeout is 5s_.

```javascript
setTimeout(() => {
  console.log('I will never run')
}, 5.5 * 1000)
```

### Syntax errors

```javascript
const foo 'bar'

console.log(foo)
```
