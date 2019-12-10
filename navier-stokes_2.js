this;
global;
var framesTillAddingPoints = 0;
var framesBetweenAddingPoints = 5;

function addPoints(field) {
    var n = 1;
    for (var i = 1; i <= n; i++) {
        field.setDensity(i, i, 5);
    }
}

function prepareFrame(field)
{
    if (framesTillAddingPoints == 0) {
        addPoints(field);
        framesTillAddingPoints = framesBetweenAddingPoints;
        framesBetweenAddingPoints++;
    } else {
        framesTillAddingPoints--;
    }
}

// Code from Oliver Hunt (http://nerget.com/fluidSim/pressure.js) starts here.
function FluidField(canvas) {

    function queryUI(d)
    {
        for (var i = 0; i < size; i++)
            d[i] = 0.0;
        uiCallback(new Field(d));
    }

    function Field(dens) {
	this.setDensity = function(x, y, d) {
             dens[(x + 1) + (y + 1) * rowSize] = d;
        }
    }

    this.update = function () {
        queryUI(dens_prev);
    }

    this.setUICallback = function(callback) {
        uiCallback = callback;
    }
    var iterations = 1;
    var visc = 0.5;
    var dt = 0.1;
    var dens_prev;
    var width;
    var height;
    var rowSize;
    var size;
    function reset()
    {
        rowSize = width;
        size = (width)*(height);
        dens_prev = new Array(size);
        for (var i = 0; i < size; i++)
            dens_prev[i] = 0;
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
solver.setUICallback(prepareFrame);
solver.update();
