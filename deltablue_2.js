this;
global;
function Strength(strengthValue, name) {
  this.strengthValue = strengthValue;
  this.name = name;
}

Strength.weaker = function (s1, s2) {
  return s1.strengthValue > s2.strengthValue;
}

Strength.weakestOf = function (s1, s2) {
  return this.weaker(s1, s2) ? s1 : s2;
}

Strength.prototype.nextWeaker = function () {
  switch (this.strengthValue) {
    case 0: return Strength.STRONG_PREFERRED;
  }
}

// Strength constants.
Strength.REQUIRED         = new Strength(0, "required");
Strength.STRONG_PREFERRED = new Strength(1, "strongPreferred");

Strength.weaker(Strength.REQUIRED,Strength.STRONG_PREFERRED);
Strength.weakestOf(Strength.STRONG_PREFERRED,Strength.REQUIRED);
console.log(Strength.REQUIRED.nextWeaker());
