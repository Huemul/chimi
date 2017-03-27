const fs = require('fs')

const Task = require('data.task')

// read :: String -> Task([String, Error], String)
const read = filePath => new Task((reject, resolve) => {
 fs.readFile(filePath, 'utf8', (err, data) => {
   if (err) {
     reject([filePath, err])
   } else {
     resolve(data)
   }
 })
})

module.exports = { read }
