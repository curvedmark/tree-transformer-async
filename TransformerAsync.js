var VisitorAsync = require('tree-visitor-async');
var Transformer = require('tree-transformer');

module.exports = TransformerAsync;

function TransformerAsync(actions) {
	VisitorAsync.apply(this, arguments);
}
TransformerAsync.prototype = Object.create(VisitorAsync.prototype);

TransformerAsync.prototype._visitNodes = function (nodes, done) {
	var self = this;
	visitNodesFrom(0);

	function visitNodesFrom(i) {
		if (i >= nodes.length) return done(null, nodes);
		self._visitNode(nodes[i], function (err, ret) {
			if (err) return done(err);
			i = Transformer.replaceNode(ret, i, nodes);
			visitNodesFrom(i);
		});
	}
};

TransformerAsync.prototype._visitNode = function (node, done) {
	VisitorAsync.prototype._visitNode.call(this, node, function (err, ret) {
		if (err) return done(err);
		done(null, ret === undefined ? node : ret);
	});
};