function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const isolated = require('require-from-string');
const fs = require('fs');
const pkg = require('./package.json');

const file = 'readme.md';

const rg = /```(js|javascript)[\s\S]+?```/g;

const removeMdCodeWrap = s => s.replace(/```/g, '').replace(/^(js|javascript)/, '');

const dependency = (dep, path) => typeof path === 'string' ? `let ${dep} = require('${path}')` : `require('${path.path}')`;

const dependencies = deps => Object.keys(deps).reduce((acc, key) => `
    ${acc}
    ${dependency(key, deps[key])}
    `, '');

const doEval = (() => {
  var _ref = _asyncToGenerator(function* (code, id) {
    const snippet = isolated(`
    ${dependencies(pkg.sarasa.dependencies)}

    function snippet() {
      console.log('----- Snippet #' + ${id} + '-----')
      return new Promise((res, rej) => {
        try {
          const result = eval(${code})
          res(result)
          console.log('SNIPPET SUCCESS !!!')
          console.log(result)
        } catch(e) {
          rej(e)
          console.log('SNIPPET ERROR !!!')
          console.log(e)
        }
        console.log()
      })
    }
    module.exports = snippet 
  `);
    return yield snippet();
  });

  return function doEval(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const countCases = (acc, cur) => ({
  success: cur.ok ? acc.success + 1 : acc.success,
  reject: cur.ok ? acc.reject : acc.reject + 1
});

const runSnippet = (() => {
  var _ref2 = _asyncToGenerator(function* (s, id) {
    try {
      const result = yield doEval.call(global, s, id);
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: e };
    }
  });

  return function runSnippet(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

fs.readFile(file, 'UTF-8', (err, data) => {
  if (err) {
    throw err;
  }

  const matches = data.match(rg) || [];

  const snippets = matches.map(removeMdCodeWrap);

  const runnedSnippets = snippets.map(runSnippet);

  Promise.all(runnedSnippets).then(c => {
    const results = c.reduce(countCases, { success: 0, reject: 0 });

    if (snippets.length) {
      console.log(`\nRun ${snippets.length} snippets.`);
      console.log(`  Succeded: ${results.success}`);
      console.log(`  Rejected: ${results.reject}`);
    } else {
      console.log(`\nNo JS snippets found ${file}.  ¯\\_(ツ)_/¯`);
    }
  });
});
