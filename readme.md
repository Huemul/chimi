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

```js
new Promise((res, rej) => {
  setTimeout(() => { rej('azync') }, 500)
})
```

