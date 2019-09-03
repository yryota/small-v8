function Scheduler() {
  this.blocks = new Array(NUMBER_OF_IDS);
  this.list = null;
  this.currentTcb = null;
  this.currentId = null;
}

function DeviceTask(scheduler) {
  this.scheduler = scheduler;
  this.v1 = null;
}

function WorkerTask(scheduler, v1, v2) {
  this.scheduler = scheduler;
  this.v1 = v1;
  this.v2 = v2;
}

Scheduler.prototype.addWorkerTask = function (id, priority, queue) {
  this.addTask(id, priority, queue, new WorkerTask(this, ID_HANDLER_A, 0));
};

Scheduler.prototype.addDeviceTask = function (id, priority, queue) {
  this.addTask(id, priority, queue, new DeviceTask(this))
};

Scheduler.prototype.addTask = function (id, priority, queue, task) {
  this.currentTcb = new TaskControlBlock(this.list, id, priority, queue, task);
  this.list = this.currentTcb;
  this.blocks[id] = this.currentTcb;
};

function Packet(link, id) {
  this.link = link;
  this.id = id;
  this.a1 = 0;
  this.a2 = new Array(DATA_SIZE);
}

function TaskControlBlock(link, id, priority, queue, task) {
  this.link = link;
  this.id = id;
  this.priority = priority;
  this.queue = queue;
  this.task = task;
  if (queue == null) {
    this.state = STATE_SUSPENDED;
  } else {
    this.state = STATE_SUSPENDED_RUNNABLE;
  }
}

var STATE_RUNNING = 0;
var STATE_RUNNABLE = 1;
var STATE_SUSPENDED = 2;
var STATE_HELD = 4;
var STATE_SUSPENDED_RUNNABLE = STATE_SUSPENDED | STATE_RUNNABLE;
var STATE_NOT_HELD = ~STATE_HELD;

var COUNT = 1;

var ID_IDLE       = 0;
var ID_WORKER     = 1;
var ID_HANDLER_A  = 2;
var ID_DEVICE_A   = 4;
var NUMBER_OF_IDS = 6;

var KIND_DEVICE   = 0;

var DATA_SIZE = 1;

var scheduler = new Scheduler();

var queue = new Packet(null, ID_WORKER);
scheduler.addWorkerTask(ID_WORKER, 1000, queue);
scheduler.addDeviceTask(ID_DEVICE_A, 4000, null);
