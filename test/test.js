var assert = require('assert');
var TransformerAsync = require('../TransformerAsync');
require("mocha-as-promised")();

describe("TransformerAsync", function () {
	describe("transform a single node", function () {
		it("should return action's returning value", function () {
			var node = { type: 'number', value: 1 };
			return new TransformerAsync({
				number: function (number) {
					return 1;
				}
			}).visit(node).then(function (result) {
				assert.equal(result, 1);
			});
		});

		it("should return null", function () {
			var node = { type: 'number', value: 1 };
			return new TransformerAsync({
				number: function (number) {
					return null;
				}
			}).visit(node).then(function (result) {
				assert.strictEqual(result, null);
			});
		});

		it("should ignore undefined", function () {
			var node = { type: 'number', value: 1 };
			return new TransformerAsync({
				node: function (node) {}
			}).visit(node).then(function (result) {
				assert.equal(result, node);
			});
		});
	});

	describe("transform an array of nodes", function () {
		it("should replace node", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			return new TransformerAsync({
				node: function (node) {
					return node.value;
				}
			}).visit(nodes).then(function (result) {
				assert.deepEqual(result, [1, 'abc']);
			});
		});

		it("should flatten result array", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'number', value: 3 }
			];
			return new TransformerAsync({
				number: function (number) {
					return [number.value, number.value + 1];
				}
			}).visit(nodes).then(function (result) {
				assert.deepEqual(result, [1, 2, 3, 4]);
			});
		});

		it("should remove node for returned null", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			return new TransformerAsync({
				number: function (number) {
					return null;
				}
			}).visit(nodes).then(function (result) {
				assert.deepEqual(result, [{ type: 'string', value: 'abc' }]);
			});
		});

		it("should ignore node for returned undefined", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];
			return new TransformerAsync({
				number: function (number) {}
			}).visit(nodes).then(function (result) {
				assert.deepEqual(result, [
					{ type: 'number', value: 1 },
					{ type: 'string', value: 'abc' }
				]);
			});
		});
	});
});