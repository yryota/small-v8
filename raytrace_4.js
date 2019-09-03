var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
};

/* Fake a Flog.* namespace */
if(typeof(Flog) == 'undefined') var Flog = {};
if(typeof(Flog.RayTracer) == 'undefined') Flog.RayTracer = {};

Flog.RayTracer.Camera = Class.create();

Flog.RayTracer.Camera.prototype = {
    position: null,
    lookAt: null,
    equator: null,
    up: null,
    screen: null,

    initialize : function(pos, lookAt, up) {
        this.position = pos;
        this.lookAt = lookAt;
        this.up = up;
        this.equator = lookAt.normalize().cross(this.up);
        this.screen = Flog.RayTracer.Vector.prototype.add(this.position, this.lookAt);
    },

    getRay: function(vx, vy){
        var pos = Flog.RayTracer.Vector.prototype.subtract(
            this.screen,
            Flog.RayTracer.Vector.prototype.subtract(
                Flog.RayTracer.Vector.prototype.multiplyScalar(this.equator, vx),
                Flog.RayTracer.Vector.prototype.multiplyScalar(this.up, vy)
            )
        );
        pos.y = pos.y * -1;
        var dir = Flog.RayTracer.Vector.prototype.subtract(
            pos,
            this.position
        );

        var ray = new Flog.RayTracer.Ray(pos, dir.normalize());

        return ray;
    },

}

Flog.RayTracer.Vector = Class.create();

Flog.RayTracer.Vector.prototype = {
    x : 0.0,
    y : 0.0,
    z : 0.0,

    initialize : function(x, y, z) {
        this.x = (x ? x : 0);
        this.y = (y ? y : 0);
        this.z = (z ? z : 0);
    },

    normalize : function() {
        var m = this.magnitude();
        return new Flog.RayTracer.Vector(this.x / m, this.y / m, this.z / m);
    },

    magnitude : function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    },

    cross : function(w) {
        return new Flog.RayTracer.Vector(
                                            -this.z * w.y + this.y * w.z,
                                           this.z * w.x - this.x * w.z,
                                          -this.y * w.x + this.x * w.y);
    },

    add : function(v, w) {
        return new Flog.RayTracer.Vector(w.x + v.x, w.y + v.y, w.z + v.z);
    },

    subtract : function(v, w) {
        if(!w || !v) throw 'Vectors must be defined [' + v + ',' + w + ']';
        return new Flog.RayTracer.Vector(v.x - w.x, v.y - w.y, v.z - w.z);
    },

    multiplyScalar : function(v, w) {
        return new Flog.RayTracer.Vector(v.x * w, v.y * w, v.z * w);
    },

}

Flog.RayTracer.Ray = Class.create();

Flog.RayTracer.Ray.prototype = {
    position : null,
    direction : null,
    initialize : function(pos, dir) {
        this.position = pos;
        this.direction = dir;
    },

}

camera = new Flog.RayTracer.Camera(
                new Flog.RayTracer.Vector(0, 0, -15),
                new Flog.RayTracer.Vector(-0.2, 0, 5),
                new Flog.RayTracer.Vector(0, 1, 0)
                );
camera.getRay(1,1);
