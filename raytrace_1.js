var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
};

if(typeof(Flog) == 'undefined') var Flog = {};
if(typeof(Flog.RayTracer) == 'undefined') Flog.RayTracer = {};

Flog.RayTracer.Color = Class.create();

Flog.RayTracer.Color.prototype = {
    red : 0.0,
    green : 0.0,
    blue : 0.0,

    initialize : function(r, g, b) {
        if(!r) r = 0.0;
        if(!g) g = 0.0;
        if(!b) b = 0.0;

        this.red = r;
        this.green = g;
        this.blue = b;
    },

    add : function(c1, c2){
        var result = new Flog.RayTracer.Color(0,0,0);

        result.red = c1.red + c2.red;
        result.green = c1.green + c2.green;
        result.blue = c1.blue + c2.blue;

        return result;
    },

}

black = new Flog.RayTracer.Color(1,1,1);
white = new Flog.RayTracer.Color(0,0,0);
console.log(Flog.RayTracer.Color.prototype.add(black, white));
