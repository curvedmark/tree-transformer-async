var VisitorAsync = require('tree-visitor-async');
var Transformer = require('tree-transformer');

module.exports = TransformerAsync;

function TransformerAsync(actions) {
	VisitorAsync.apply(this, arguments);
}
TransformerAsync.prototype = Object.create(VisitorAsync.prototype);

TransformerAsync.prototype._visitNodes = function (nodes) {
	var self = this;
	return visitNodesFrom(0);

	function visitNodesFrom(i) {
		if (i >= nodes.length) return self._visitNode().then(function () { return nodes });
		return self._visitNode(nodes[i]).then(function (ret) {
			i = Transformer.replaceNode(ret, i, nodes);
			return visitNodesFrom(i);
		});
	}
};

TransformerAsync.prototype._visitNode = function (node) {
	return VisitorAsync.prototype._visitNode.call(this, node).then(function (ret) {
		return ret === undefined ? node : ret;
	});
};