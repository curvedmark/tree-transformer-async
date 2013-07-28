var assert = require('assert');
var TransformerAsync = require('../TransformerAsync');

describe('TransformerAsync', function () {
	describe('transform a single node', function () {
		it('should return action\'s returning value', function (done) {
			var node = { type: 'number', value: 1 };
			new TransformerAsync({
				number: function (transformer, number, cb) {
					setTimeout(function () {
						cb(null, 1)
					}, 0);
				}
			}).visit(node, function (err, result) {
				if (err) return done(err);
				assert.equal(result, 1);
				done();
			});
		});

		it('should return null', function (done) {
			var node = { type: 'number', value: 1 };
			new TransformerAsync({
				number: function (transformer, number, cb) {
					setTimeout(function () {
						cb(null, null)
					}, 0);
				}
			}).visit(node, function (err, result) {
				if (err) return done(err);
				assert.strictEqual(result, null);
				done();
			});
		});

		it('should ignore undefined', function (done) {
			var node = { type: 'number', value: 1 };
			new TransformerAsync({
				node: function (transformer, node, cb) {
					setTimeout(function () {
						cb();
					}, 0);
				}
			}).visit(node, function (err, result) {
				if (err) return done(err);
				assert.equal(result, node);
				done();
			});
		});
	});

	describe('transform an array of nodes', function () {
		it('should replace node', function (done) {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			new TransformerAsync({
				node: function (transformer, node, cb) {
					setTimeout(function () {
						cb(null, node.value);
					}, 0);
				}
			}).visit(nodes, function (err, result) {
				if (err) return done(err);
				assert.deepEqual(result, [1, 'abc']);
				done();
			});

		});

		it('should flatten result array', function (done) {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'number', value: 3 }
			];
			new TransformerAsync({
				number: function (transformer, number, cb) {
					setTimeout(function () {
						cb(null, [number.value, number.value + 1]);
					}, 0);
				}
			}).visit(nodes, function (err, result) {
				if (err) return done(err);
				assert.deepEqual(result, [1, 2, 3, 4]);
				done();
			});
		});

		it('should remove node for returned null', function (done) {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			new TransformerAsync({
				number: function (transformer, number, cb) {
					setTimeout(function () {
						cb(null, null);
					}, 0);
				}
			}).visit(nodes, function (err, result) {
				if (err) return done(err);
				assert.deepEqual(result, [{ type: 'string', value: 'abc' }]);
				done();
			});
		});

		it('should ignore node for returned undefined', function (done) {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			new TransformerAsync({
				number: function (transformer, number, cb) {
					setTimeout(function () {
						cb();
					}, 0);
				}
			}).visit(nodes, function (err, result) {
				if (err) return done(err);
				assert.deepEqual(result, [
					{ type: 'number', value: 1 },
					{ type: 'string', value: 'abc' }
				]);
				done();
			});
		});

		it('should ignore node for having no matching action', function (done) {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			new TransformerAsync({}).visit(nodes, function (err, result) {
				if (err) return done(err);
				assert.equal(result, nodes);
				done();
			});
		});

		it('should stop at the first error', function (done) {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			new TransformerAsync({
				number: function (transformer, number, cb) {
					setTimeout(function () {
						cb(new Error('error'));
					}, 0);
				},
				string: function (transformer, string, cb) {
					setTimeout(function () {
						cb(null, string.value);
					}, 0);
				}
			}).visit(nodes, function (err) {
				assert.ok(err instanceof Error);
				assert.deepEqual(nodes, [
					{ type: 'number', value: 1 },
					{ type: 'string', value: 'abc' }
				]);
				done();
			});
		});
	});
});