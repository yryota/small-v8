this;
global;
function FluidField(canvas) {

    this.setDisplayFunction = function(func) {
        displayFunc = func;
    }

    this.setIterations = function(iters) {
        if (iters > 0 && iters <= 100)
           iterations = iters;
    }
    this.setUICallback = function(callback) {
        uiCallback = callback;
    }
    var iterations = 1;
    var visc = 0.5;
    var dt = 0.1;
    var dens;
    var dens_prev;
    var u;
    var u_prev;
    var v;
    var v_prev;
    var width;
    var height;
    var rowSize;
    var size;
    var displayFunc;
    this.setResolution = function (hRes, wRes)
    {
        var res = wRes * hRes;
        if (res > 0 && res < 1000000 && (wRes != width || hRes != height)) {
            width = wRes;
            height = hRes;
            return true;
        }
        return false;
    }
    this.setResolution(1, 1);
}

solver = new FluidField(null);
solver.setDisplayFunction(function(){});
solver.setUICallback();
