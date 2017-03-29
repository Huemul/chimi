#0

```js
let i = 0
new Promise((res, rej) => {
  const t = setInterval(() => { 
    i++
    console.log("tick: " + i)
    if (i === 5 ) {
      clearInterval(t)
      res('azync') 
    }
  }, 10)
})
```

#1

```js
// ---------- o ----------
var add = (a, b) => a + b

// ---------- o ----------
var square = (a) => a * a

[1, 2, 3, 4].map(square) //=> [1, 4, 9, 16]

// ---------- o ----------
var adder = (a) => (b) => add(a, b)

var add5 = adder(5)
add5(1) //=> 6
```

#2

```js
_()
```

#3

```js
foo()
```

#4
```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(r => r.json())
```
