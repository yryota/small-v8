// Code from Oliver Hunt (http://nerget.com/fluidSim/pressure.js) starts here.
function FluidField(canvas) {

    function Field(dens, u, v) {
        // Just exposing the fields here rather than using accessors is a measurable win during display (maybe 5%)
        // but makes the code ugly.
        this.setDensity = function(x, y, d) {
             dens[(x + 1) + (y + 1) * rowSize] = d;
        }
        this.setVelocity = function(x, y, xv, yv) {
             u[(x + 1) + (y + 1) * rowSize] = xv;
             v[(x + 1) + (y + 1) * rowSize] = yv;
        }
    }

    this.setDisplayFunction = function(func) {
        displayFunc = func;
    }

    this.update = function () {
        displayFunc(new Field(dens, u, v));
    }

    var iterations = 1;
    var visc = 0.5;
    var dt = 0.1;
    var dens;
    var u;
    var v;
    var width;
    var height;
    var rowSize;
    var size;
    var displayFunc;
    function reset()
    {
        rowSize = width;
        size = (width)*(height);
        dens = new Array(size);
        u = new Array(size);
        v = new Array(size);
        for (var i = 0; i < size; i++)
            dens[i] = u[i] = v[i] = 0;
    }
    this.reset = reset;
    this.setResolution = function (hRes, wRes)
    {
        var res = wRes * hRes;
        if (res > 0 && res < 1000000 && (wRes != width || hRes != height)) {
            width = wRes;
            height = hRes;
            reset();
            return true;
        }
        return false;
    }
    this.setResolution(1, 1);
}

solver = new FluidField(null);
solver.setDisplayFunction(function(){});
solver.reset();
solver.update();
