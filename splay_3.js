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
 * @return {SplayTree.Node} Node having the maximum key value.
 */
SplayTree.prototype.findMax = function(opt_startNode) {
  if (this.isEmpty()) {
    return null;
  }
  var current = opt_startNode || this.root_;
  while (current.right) {
    current = current.right;
  }
  return current;
};

/**
 * Constructs a Splay tree node.
 *
 * @param {number} key Key.
 * @param {*} value Value.
 */

SplayTree.prototype.insert = function(key, value) {
  if (this.isEmpty()) {
    this.root_ = new SplayTree.Node(key, value);
    return;
  }
  // Splay on the key to move the last node on the search path for
  // the key to the root of the tree.
  this.splay_(key);
  if (this.root_.key == key) {
    return;
  }
  var node = new SplayTree.Node(key, value);
  if (key > this.root_.key) {
    node.left = this.root_;
    node.right = this.root_.right;
    this.root_.right = null;
  } else {
    node.right = this.root_;
    node.left = this.root_.left;
    this.root_.left = null;
  }
  this.root_ = node;
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
//splayTree.insert(1,'one');
splayTree.insert(5,'five');
splayTree.insert(3,'three');
splayTree.findMax();
