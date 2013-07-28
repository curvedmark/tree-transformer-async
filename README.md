# Tree Transformer Async

Transform nodes in the tree asynchronously and sequentially.

Asynchronous version of [Tree Transformer](https://github.com/curvedmark/tree-transformer). Like [Tree Visitor Async](https://github.com/curvedmark/tree-visitor-async).

## API

```javascript
var fs = require('fs');
var TransformerAsync = require('tree-transformer-async');

var nodes = [
  { type: 'import', value: 'path/to/file1' },
  { type: 'import', value: 'path/to/file2' },
];
var transformerAsync = new TransformerAsync({
  import: function (visitor, importNode, done) {
    fs.readFile(importNode.value, 'utf8', done);
  }
});
transformerAsync.visit(nodes, function (err, result) {
  if (err) throw err;
  console.log(result); // [content of file1, content of file2]
});
```