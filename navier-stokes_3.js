this;
global;
var framesTillAddingPoints = 0;
var framesBetweenAddingPoints = 5;

// Code from Oliver Hunt (http://nerget.com/fluidSim/pressure.js) starts here.
function FluidField(canvas) {

    function addFields(x, s, dt)
    {
        for (var i=0; i<size ; i++ ) x[i] += dt*s[i];
    }

    function dens_step(x, x0, u, v, dt)
    {
        addFields(x, x0, dt);
    }

    this.update = function () {
        dens_step(dens, dens_prev, u, v, dt);
    }

    var iterations = 1;
    var visc = 0.5;
    var dt = 0.1;
    var dens;
    var dens_prev;
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
        dens_prev = new Array(size);
        u = new Array(size);
        v = new Array(size);
        for (var i = 0; i < size; i++)
            dens_prev[i] = dens[i] = u[i] = v[i] = 0;
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
solver.reset();
solver.update();
