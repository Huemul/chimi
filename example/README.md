# chimi example

this is an example project using `chimi` to test Markdown snippets

## snippets

```javascript
console.log(1)
```


```js
const foo = {
  bar: 'bar'
}

console.log(foo)
```

Using a local dependency (from `math.js`)
```js
add(1, 2)
```

Using a third party dependency (from `npm`)
```javascript
trae.baseUrl('http://swapi.co/api/')

trae.after(r => r.data)

trae.get('people/1')
  .then(data => console.log(data))
```

