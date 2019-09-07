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

Flog.RayTracer.Engine = Class.create();

Flog.RayTracer.Engine.prototype = {
    canvas: null, /* 2d context we can render to */

    initialize: function(options){
        this.options = Object.extend({
                canvasHeight: 1,
                canvasWidth: 1,
                pixelWidth: 1,
                pixelHeight: 1,
                renderDiffuse: false,
                renderShadows: false,
                renderHighlights: false,
                renderReflections: false,
                rayDepth: 1
            }, options || {});

        this.options.canvasHeight /= this.options.pixelHeight;
        this.options.canvasWidth /= this.options.pixelWidth;

        /* TODO: dynamically include other scripts */
    },

    getReflectionRay: function(P,N,V){
        var c1 = -N.dot(V);
        var R1 = Flog.RayTracer.Vector.prototype.add(
            Flog.RayTracer.Vector.prototype.multiplyScalar(N, 2*c1),
            V
        );
        return new Flog.RayTracer.Ray(P, R1);
    },
};

var imageWidth = 1; // $F('imageWidth');
var imageHeight = 1; // $F('imageHeight');
var pixelSize = "1,1".split(','); //  $F('pixelSize').split(',');
var renderDiffuse = true; // $F('renderDiffuse');
var renderShadows = true; // $F('renderShadows');
var renderHighlights = true; // $F('renderHighlights');
var renderReflections = true; // $F('renderReflections');
var rayDepth = 1;//$F('rayDepth');

var raytracer = new Flog.RayTracer.Engine(
        {
            canvasWidth: imageWidth,
            canvasHeight: imageHeight,
            pixelWidth: pixelSize[0],
            pixelHeight: pixelSize[1],
            "renderDiffuse": renderDiffuse,
            "renderHighlights": renderHighlights,
            "renderShadows": renderShadows,
            "renderReflections": renderReflections,
            "rayDepth": rayDepth
        }
);
