function Scheduler() {
  this.queueCount = 0;
  this.holdCount = 0;
  this.blocks = new Array(NUMBER_OF_IDS);
  this.list = null;
  this.currentTcb = null;
  this.currentId = null;
}

function IdleTask(scheduler, v1, count) {
  this.scheduler = scheduler;
  this.v1 = v1;
  this.count = count;
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

function HandlerTask(scheduler) {
  this.scheduler = scheduler;
  this.v1 = null;
  this.v2 = null;
}

Scheduler.prototype.addIdleTask = function (id, priority, queue, count) {
  this.addRunningTask(id, priority, queue, new IdleTask(this, 1, count));
};

Scheduler.prototype.addWorkerTask = function (id, priority, queue) {
  this.addTask(id, priority, queue, new WorkerTask(this, ID_HANDLER_A, 0));
};

Scheduler.prototype.addHandlerTask = function (id, priority, queue) {
  this.addTask(id, priority, queue, new HandlerTask(this));
};

Scheduler.prototype.addDeviceTask = function (id, priority, queue) {
  this.addTask(id, priority, queue, new DeviceTask(this))
};

Scheduler.prototype.addRunningTask = function (id, priority, queue, task) {
  this.addTask(id, priority, queue, task);
  this.currentTcb.setRunning();
};

Scheduler.prototype.addTask = function (id, priority, queue, task) {
  this.currentTcb = new TaskControlBlock(this.list, id, priority, queue, task);
  this.list = this.currentTcb;
  this.blocks[id] = this.currentTcb;
};

function Packet(link, id, kind) {
  this.link = link;
  this.id = id;
  this.kind = kind;
  this.a1 = 0;
  this.a2 = new Array(DATA_SIZE);
}

Packet.prototype.addTo = function (queue) {
  this.link = null;
  if (queue == null) return this;
  var peek, next = queue;
  while ((peek = next.link) != null)
    next = peek;
  next.link = this;
  return queue;
};

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

TaskControlBlock.prototype.setRunning = function () {
  this.state = STATE_RUNNING;
};

var STATE_RUNNING = 0;
var STATE_RUNNABLE = 1;
var STATE_SUSPENDED = 2;
var STATE_HELD = 4;
var STATE_SUSPENDED_RUNNABLE = STATE_SUSPENDED | STATE_RUNNABLE;
var STATE_NOT_HELD = ~STATE_HELD;

var COUNT = 1000;

var ID_IDLE       = 0;
var ID_WORKER     = 1;
var ID_HANDLER_A  = 2;
var ID_DEVICE_A   = 4;
var NUMBER_OF_IDS = 6;

var KIND_DEVICE   = 0;
var KIND_WORK     = 1;

var DATA_SIZE = 1;

var scheduler = new Scheduler();
scheduler.addIdleTask(ID_IDLE, 0, null, COUNT);

var queue = new Packet(null, ID_WORKER, KIND_WORK);
scheduler.addWorkerTask(ID_WORKER, 1000, queue);

queue = new Packet(null, ID_DEVICE_A, KIND_DEVICE);
scheduler.addHandlerTask(ID_HANDLER_A, 2000, queue);

scheduler.addDeviceTask(ID_DEVICE_A, 4000, null);