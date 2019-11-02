require('../_splay.js');

SplayTree = function SplayTree(){};
SplayTree.prototype = st.prototype;
/**
 * Pointer to the root node of the tree.
 *
 * @type {SplayTree.Node}
 * @private
 */
SplayTree.prototype.root_ = null;


/**
 * Returns the node having the specified key or null if the tree doesn't contain
 * a node with the specified key.
 *
 * @param {number} key Key to find in the tree.
 * @return {SplayTree.Node} Node having the specified key.
 */
SplayTree.prototype.find = function(key) {
  if (this.isEmpty()) {
    return null;
  }
  this.splay_(key);
  return this.root_.key == key ? this.root_ : null;
};

/**
 * Constructs a Splay tree node.
 *
 * @param {number} key Key.
 * @param {*} value Value.
 */
SplayTree.Node = function(key, value) {
  this.key = key;
  this.value = value;
};


/**
 * @type {SplayTree.Node}
 */
SplayTree.Node.prototype.left = null;


/**
 * @type {SplayTree.Node}
 */
SplayTree.Node.prototype.right = null;

splayTree = new SplayTree();
splayTree.insert(1,'one');
splayTree.insert(2,'two');
splayTree.find(1);
