this;
global;
require('../_raytrace.js');

var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
};

Object.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
};

/* Fake a Flog.* namespace */
if(typeof(Flog.RayTracer.Material) == 'undefined') Flog.RayTracer.Material = {};

Flog.RayTracer.Material.BaseMaterial = Class.create();

Flog.RayTracer.Material.BaseMaterial.prototype = {

    gloss: 2.0,             // [0...infinity] 0 = matt
    transparency: 0.0,      // 0=opaque
    reflection: 0.0,        // [0...infinity] 0 = no reflection
    refraction: 0.50,
    hasTexture: false,

    initialize : function(){
    },

    wrapUp: function(t){
        t = t % 2.0;
        if(t < -1) t += 2.0;
        if(t >= 1) t -= 2.0;
        return t;
    },

}

Flog.RayTracer.Material.Chessboard = Class.create();

Flog.RayTracer.Material.Chessboard.prototype = Object.extend(
    new Flog.RayTracer.Material.BaseMaterial(), {
        colorEven: null,
        colorOdd: null,
        density: 0.5,

        initialize : function(colorEven, colorOdd, reflection, transparency, gloss, density) {
            this.colorEven = colorEven;
            this.colorOdd = colorOdd;
            this.reflection = reflection;
            this.transparency = transparency;
            this.gloss = gloss;
            this.density = density;
            this.hasTexture = true;
        },

        getColor: function(u, v){
            var t = this.wrapUp(u * this.density) * this.wrapUp(v * this.density);

            if(t < 0.0)
                return this.colorEven;
            else
                return this.colorOdd;
        },

    }
);

board = new Flog.RayTracer.Material.Chessboard(
             new Flog.RayTracer.Color(1,1,1),
             new Flog.RayTracer.Color(0,0,0),
             0.2,
             0.0,
             1.0,
             0.7
             )
board.getColor(1,2);
