# Tree Transformer Async

Transform nodes in the tree asynchronously and sequentially.

Asynchronous version of [Tree Transformer](https://github.com/curvedmark/tree-transformer). Like [Tree Visitor Async](https://github.com/curvedmark/tree-visitor-async).

## Example

```javascript
var fs = require('fs');
var Q = require('q');
var TransformerAsync = require('tree-transformer-async');

var nodes = [
	{ type: 'import', value: 'path/to/file1' },
	{ type: 'import', value: 'path/to/file2' },
];
var transformerAsync = new TransformerAsync({
	import: function (visitor, importNode, done) {
		var deferred = Q.defer();
		fs.readFile(importNode.value, 'utf8', function (err, content) {
			if (err) return deferred.reject(err);
			deferred.resolve(content);
		});
		return deferred.promise;
	}
});
transformerAsync.visit(nodes).then(function (result) {
	console.log(result); // [content of file1, content of file2]
});
```