var framesTillAddingPoints = 0;
var framesBetweenAddingPoints = 5;

function addPoints(field) {
    var n = 1;
    for (var i = 1; i <= n; i++) {
        field.setVelocity(i, i, n, n);
        field.setDensity(i, i, 5);
        field.setVelocity(i, n - i, -n, -n);
        field.setDensity(i, n - i, 20);
        field.setVelocity(128 - i, n + i, -n, -n);
        field.setDensity(128 - i, n + i, 30);
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

    function addFields(x, s, dt)
    {
        for (var i=0; i<size ; i++ ) x[i] += dt*s[i];
    }

    function set_bnd(b, x)
    {
        if (b===1) {
            for (var i = 1; i <= width; i++) {
                x[i] =  x[i + rowSize];
                x[i + (height+1) *rowSize] = x[i + height * rowSize];
            }

            for (var j = 1; i <= height; i++) {
                x[j * rowSize] = -x[1 + j * rowSize];
                x[(width + 1) + j * rowSize] = -x[width + j * rowSize];
            }
        } else if (b === 2) {
            for (var i = 1; i <= width; i++) {
                x[i] = -x[i + rowSize];
                x[i + (height + 1) * rowSize] = -x[i + height * rowSize];
            }

            for (var j = 1; j <= height; j++) {
                x[j * rowSize] =  x[1 + j * rowSize];
                x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
            }
        } else {
            for (var i = 1; i <= width; i++) {
                x[i] =  x[i + rowSize];
                x[i + (height + 1) * rowSize] = x[i + height * rowSize];
            }

            for (var j = 1; j <= height; j++) {
                x[j * rowSize] =  x[1 + j * rowSize];
                x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
            }
        }
        var maxEdge = (height + 1) * rowSize;
        x[0]                 = 0.5 * (x[1] + x[rowSize]);
        x[maxEdge]           = 0.5 * (x[1 + maxEdge] + x[height * rowSize]);
        x[(width+1)]         = 0.5 * (x[width] + x[(width + 1) + rowSize]);
        x[(width+1)+maxEdge] = 0.5 * (x[width + maxEdge] + x[(width + 1) + height * rowSize]);
    }

    function lin_solve(b, x, x0, a, c)
    {
        if (a === 0 && c === 1) {
            for (var j=1 ; j<=height; j++) {
                var currentRow = j * rowSize;
                ++currentRow;
                for (var i = 0; i < width; i++) {
                    x[currentRow] = x0[currentRow];
                    ++currentRow;
                }
            }
            set_bnd(b, x);
        } else {
            var invC = 1 / c;
            for (var k=0 ; k<iterations; k++) {
                for (var j=1 ; j<=height; j++) {
                    var lastRow = (j - 1) * rowSize;
                    var currentRow = j * rowSize;
                    var nextRow = (j + 1) * rowSize;
                    var lastX = x[currentRow];
                    ++currentRow;
                    for (var i=1; i<=width; i++)
                        lastX = x[currentRow] = (x0[currentRow] + a*(lastX+x[++currentRow]+x[++lastRow]+x[++nextRow])) * invC;
                }
                set_bnd(b, x);
            }
        }
    }

    function advect(b, d, d0, u, v, dt)
    {
        var Wdt0 = dt * width;
        var Hdt0 = dt * height;
        var Wp5 = width + 0.5;
        var Hp5 = height + 0.5;
        for (var j = 1; j<= height; j++) {
            var pos = j * rowSize;
            for (var i = 1; i <= width; i++) {
                var x = i - Wdt0 * u[++pos];
                var y = j - Hdt0 * v[pos];
                if (x < 0.5)
                    x = 0.5;
                else if (x > Wp5)
                    x = Wp5;
                var i0 = x | 0;
                var i1 = i0 + 1;
                if (y < 0.5)
                    y = 0.5;
                else if (y > Hp5)
                    y = Hp5;
                var j0 = y | 0;
                var j1 = j0 + 1;
                var s1 = x - i0;
                var s0 = 1 - s1;
                var t1 = y - j0;
                var t0 = 1 - t1;
                var row1 = j0 * rowSize;
                var row2 = j1 * rowSize;
                d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
            }
        }
        set_bnd(b, d);
    }

    function dens_step(x, x0, u, v, dt)
    {
        addFields(x, x0, dt);
        advect(0, x, x0, u, v, dt );
    }

    function Field(dens, u, v) {
        // Just exposing the fields here rather than using accessors is a measurable win during display (maybe 5%)
        // but makes the code ugly.
        this.setDensity = function(x, y, d) {
             dens[(x + 1) + (y + 1) * rowSize] = d;
        }
        this.getDensity = function(x, y) {
             return dens[(x + 1) + (y + 1) * rowSize];
        }
        this.setVelocity = function(x, y, xv, yv) {
             u[(x + 1) + (y + 1) * rowSize] = xv;
             v[(x + 1) + (y + 1) * rowSize] = yv;
        }
        this.getXVelocity = function(x, y) {
             return u[(x + 1) + (y + 1) * rowSize];
        }
        this.getYVelocity = function(x, y) {
             return v[(x + 1) + (y + 1) * rowSize];
        }
        this.width = function() { return width; }
        this.height = function() { return height; }
    }

    this.setDisplayFunction = function(func) {
        displayFunc = func;
    }

    this.update = function () {
        dens_step(dens, dens_prev, u, v, dt);
    }

    this.iterations = function() { return iterations; }
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
    function reset()
    {
        rowSize = width;
        size = (width)*(height);
        dens = new Array(size);
        dens_prev = new Array(size);
        u = new Array(size);
        u_prev = new Array(size);
        v = new Array(size);
        v_prev = new Array(size);
        for (var i = 0; i < size; i++)
            dens_prev[i] = u_prev[i] = v_prev[i] = dens[i] = u[i] = v[i] = 0;
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
solver.setResolution(1, 1);
solver.setUICallback(prepareFrame);
solver.reset();
solver.update();
