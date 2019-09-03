Object.prototype.inheritsFrom = function (shuper) {
  function Inheriter() { }
  Inheriter.prototype = shuper.prototype;
  this.prototype = new Inheriter();
  this.superConstructor = shuper;
}

function OrderedCollection() {
  this.elms = new Array();
}

OrderedCollection.prototype.add = function (elm) {
  this.elms.push(elm);
}

OrderedCollection.prototype.remove = function (elm) {
  var index = 0, skipped = 0;
  for (var i = 0; i < this.elms.length; i++) {
    var value = this.elms[i];
    if (value != elm) {
      this.elms[index] = value;
      index++;
    } else {
      skipped++;
    }
  }
  for (var i = 0; i < skipped; i++)
    this.elms.pop();
}

function Strength(strengthValue, name) {
  this.strengthValue = strengthValue;
  this.name = name;
}

Strength.stronger = function (s1, s2) {
  return s1.strengthValue < s2.strengthValue;
}

// Strength constants.
Strength.REQUIRED         = new Strength(0, "required");
Strength.WEAKEST          = new Strength(6, "weakest");

/* --- *
 * C o n s t r a i n t
 * --- */

/**
 * An abstract class representing a system-maintainable relationship
 * (or "constraint") between a set of variables. A constraint supplies
 * a strength instance variable; concrete subclasses provide a means
 * of storing the constrained variables and other information required
 * to represent a constraint.
 */
function Constraint(strength) {
  this.strength = strength;
}

/**
 * Activate this constraint and attempt to satisfy it.
 */
Constraint.prototype.addConstraint = function () {
  this.addToGraph();
}

/**
 * Attempt to find a way to enforce this constraint. If successful,
 * record the solution, perhaps modifying the current dataflow
 * graph. Answer the constraint that this constraint overrides, if
 * there is one, or nil, if there isn't.
 * Assume: I am not already satisfied.
 */
Constraint.prototype.satisfy = function (mark) {
  this.chooseMethod(mark);
  if (!this.isSatisfied()) {
    if (this.strength == Strength.REQUIRED)
      alert("Could not satisfy a required constraint!");
    return null;
  }
  this.markInputs(mark);
  var out = this.output();
  var overridden = out.determinedBy;
  if (overridden != null) overridden.markUnsatisfied();
  out.determinedBy = this;
  out.mark = mark;
  return overridden;
}

Constraint.prototype.destroyConstraint = function () {
  if (this.isSatisfied()) planner.incrementalRemove(this);
  else this.removeFromGraph();
}

/**
 * Normal constraints are not input constraints.  An input constraint
 * is one that depends on external state, such as the mouse, the
 * keybord, a clock, or some arbitraty piece of imperative code.
 */
Constraint.prototype.isInput = function () {
  return false;
}

/* --- *
 * U n a r y   C o n s t r a i n t
 * --- */

/**
 * Abstract superclass for constraints having a single possible output
 * variable.
 */
function UnaryConstraint(v, strength) {
  UnaryConstraint.superConstructor.call(this, strength);
  this.myOutput = v;
  this.satisfied = false;
  this.addConstraint();
}

UnaryConstraint.inheritsFrom(Constraint);

/**
 * Adds this constraint to the constraint graph
 */
UnaryConstraint.prototype.addToGraph = function () {
  this.myOutput.addConstraint(this);
  this.satisfied = false;
}

/**
 * Decides if this constraint can be satisfied and records that
 * decision.
 */
UnaryConstraint.prototype.chooseMethod = function (mark) {
  this.satisfied = (this.myOutput.mark != mark)
    && Strength.stronger(this.strength, this.myOutput.walkStrength);
}

/**
 * Returns true if this constraint is satisfied in the current solution.
 */
UnaryConstraint.prototype.isSatisfied = function () {
  return this.satisfied;
}

UnaryConstraint.prototype.markInputs = function (mark) {
  // has no inputs
}

/**
 * Returns the current output variable.
 */
UnaryConstraint.prototype.output = function () {
  return this.myOutput;
}

/**
 * Records that this constraint is unsatisfied
 */
UnaryConstraint.prototype.markUnsatisfied = function () {
  this.satisfied = false;
}

UnaryConstraint.prototype.removeFromGraph = function () {
  if (this.myOutput != null) this.myOutput.removeConstraint(this);
  this.satisfied = false;
}

function Variable(name, initialValue) {
  this.value = initialValue || 0;
  this.constraints = new OrderedCollection();
  this.determinedBy = null;
  this.mark = 0;
  this.walkStrength = Strength.WEAKEST;
  this.stay = true;
  this.name = name;
}

/**
 * Add the given constraint to the set of all constraints that refer
 * this variable.
 */
Variable.prototype.addConstraint = function (c) {
  this.constraints.add(c);
}

/**
 * Removes all traces of c from this variable.
 */
Variable.prototype.removeConstraint = function (c) {
  this.constraints.remove(c);
  if (this.determinedBy == c) this.determinedBy = null;
}

var v1 = new Variable('v1',1);
var uc = new UnaryConstraint(v1,Strength.REQUIRED);
uc.satisfy(uc.mark);