var Transformer = require('tree-transformer');
var Promise = require('promise-now');
var _visitNode = Transformer.prototype._visitNode;

module.exports = TransformerAsync;

function TransformerAsync() {}

TransformerAsync.prototype = new Transformer();

TransformerAsync.prototype._visitNodes = function (nodes) {
	var self = this;
	return visitNodesFrom(0);

	function visitNodesFrom(i) {
		var promise = new Promise().fulfill(undefined, self);
		if (i >= nodes.length) return promise.then(function () { return nodes });
		return promise.then(function () {
			return _visitNode.call(this, nodes[i]);
		}).then(function (ret) {
			i = Transformer.replaceNode(ret, i, nodes);
			return visitNodesFrom(i);
		});
	}
};

TransformerAsync.prototype._visitNode = function (node) {
	var promise = new Promise().fulfill(undefined, this);
	return promise.then(function () {
		return _visitNode.call(this, node);
	});
};