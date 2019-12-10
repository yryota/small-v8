this;
global;
require('../_splay.js');
SplayTree = function SplayTree(){};
SplayTree.prototype = st.prototype;
SplayTree.Node = st.Node;

/**
 * Pointer to the root node of the tree.
 *
 * @type {SplayTree.Node}
 * @private
 */
SplayTree.prototype.root_ = null;

/**
 * @return {Array<*>} An array containing all the keys of tree's nodes.
 */
SplayTree.prototype.exportKeys = function() {
  var result = [];
  if (!this.isEmpty()) {
    this.root_.traverse_(function(node) { result.push(node.key); });
  }
  return result;
};

/**
 * @type {SplayTree.Node}
 */
SplayTree.Node.prototype.left = null;


/**
 * @type {SplayTree.Node}
 */
SplayTree.Node.prototype.right = null;

/**
 * Performs an ordered traversal of the subtree starting at
 * this SplayTree.Node.
 *
 * @param {function(SplayTree.Node)} f Visitor function.
 * @private
 */
SplayTree.Node.prototype.traverse_ = function(f) {
  var current = this;
  while (current) {
    var left = current.left;
    if (left) left.traverse_(f);
    f(current);
    current = current.right;
  }
};

splayTree = new SplayTree();
splayTree.insert(1,'one');
splayTree.insert(3,'three');
splayTree.exportKeys();
