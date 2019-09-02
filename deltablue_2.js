function Strength(strengthValue, name) {
  this.strengthValue = strengthValue;
  this.name = name;
}

Strength.stronger = function (s1, s2) {
  return s1.strengthValue < s2.strengthValue;
}

Strength.weaker = function (s1, s2) {
  return s1.strengthValue > s2.strengthValue;
}

Strength.weakestOf = function (s1, s2) {
  return this.weaker(s1, s2) ? s1 : s2;
}

Strength.strongest = function (s1, s2) {
  return this.stronger(s1, s2) ? s1 : s2;
}

Strength.prototype.nextWeaker = function () {
  switch (this.strengthValue) {
    case 0: return Strength.STRONG_PREFERRED;
    case 1: return Strength.PREFERRED;
    case 2: return Strength.STRONG_DEFAULT;
    case 3: return Strength.NORMAL;
    case 4: return Strength.WEAK_DEFAULT;
    case 5: return Strength.WEAKEST;
  }
}

// Strength constants.
Strength.REQUIRED         = new Strength(0, "required");
Strength.STRONG_PREFERRED = new Strength(1, "strongPreferred");
Strength.PREFERRED        = new Strength(2, "preferred");
Strength.STRONG_DEFAULT   = new Strength(3, "strongDefault");
Strength.NORMAL           = new Strength(4, "normal");
Strength.WEAK_DEFAULT     = new Strength(5, "weakDefault");
Strength.WEAKEST          = new Strength(6, "weakest");

Strength.stronger(Strength.NORMAL,Strength.WEAK_DEFAULT);
Strength.weaker(Strength.NORMAL,Strength.WEAK_DEFAULT);
Strength.weakestOf(Strength.NORMAL,Strength.WEAK_DEFAULT);
Strength.strongest(Strength.NORMAL,Strength.WEAK_DEFAULT);
console.log(Strength.PREFERRED.nextWeaker());
