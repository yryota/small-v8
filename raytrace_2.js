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

    limit: function(){
        this.red = (this.red > 0.0) ? ( (this.red > 1.0) ? 1.0 : this.red ) : 0.0;
        this.green = (this.green > 0.0) ? ( (this.green > 1.0) ? 1.0 : this.green ) : 0.0;
        this.blue = (this.blue > 0.0) ? ( (this.blue > 1.0) ? 1.0 : this.blue ) : 0.0;
    },

}

c = new Flog.RayTracer.Color(0.8, 2.0, 0.8);
c.limit();
console.log(c);
