function Scheduler() {
  this.queueCount = 0;
  this.holdCount = 0;
  this.blocks = new Array(NUMBER_OF_IDS);
  this.list = null;
  this.currentTcb = null;
  this.currentId = null;
}

Scheduler.prototype.schedule = function () {
  this.currentTcb = this.list;
  while (this.currentTcb != null) {
    if (this.currentTcb.isHeldOrSuspended()) {
      this.currentTcb = this.currentTcb.link;
    } else {
      this.currentId = this.currentTcb.id;
      this.currentTcb = this.currentTcb.run();
    }
  }
};

Scheduler.prototype.addDeviceTask = function (id, priority, queue) {
  this.addTask(id, priority, queue, new DeviceTask(this))
};

Scheduler.prototype.addTask = function (id, priority, queue, task) {
  this.currentTcb = new TaskControlBlock(this.list, id, priority, queue, task);
  this.list = this.currentTcb;
  this.blocks[id] = this.currentTcb;
};

Scheduler.prototype.suspendCurrent = function () {
  this.currentTcb.markAsSuspended();
  return this.currentTcb;
};

Scheduler.prototype.holdCurrent = function () {
  this.holdCount++;
  this.currentTcb.markAsHeld();
  return this.currentTcb.link;
};

Scheduler.prototype.queue = function (packet) {
  var t = this.blocks[packet.id];
  if (t == null) return t;
  this.queueCount++;
  packet.link = null;
  packet.id = this.currentId;
  return t.checkPriorityAdd(this.currentTcb, packet);
};

function DeviceTask(scheduler) {
  this.scheduler = scheduler;
  this.v1 = null;
}

DeviceTask.prototype.run = function (packet) {
  if (packet == null) {
    if (this.v1 == null) return this.scheduler.suspendCurrent();
    var v = this.v1;
    this.v1 = null;
    return this.scheduler.queue(v);
  } else {
    this.v1 = packet;
    return this.scheduler.holdCurrent();
  }
};

DeviceTask.prototype.toString = function () {
  return "DeviceTask";
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

TaskControlBlock.prototype.isHeldOrSuspended = function () {
  return (this.state & STATE_HELD) != 0 || (this.state == STATE_SUSPENDED);
};
TaskControlBlock.prototype.run = function () {
  var packet;
  if (this.state == STATE_SUSPENDED_RUNNABLE) {
    packet = this.queue;
    this.queue = packet.link;
    if (this.queue == null) {
      this.state = STATE_RUNNING;
    } else {
      this.state = STATE_RUNNABLE;
    }
  } else {
    packet = null;
  }
  return this.task.run(packet);
};

TaskControlBlock.prototype.markAsSuspended = function () {
  this.state = this.state | STATE_SUSPENDED;
};

TaskControlBlock.prototype.markAsRunnable = function () {
  this.state = this.state | STATE_RUNNABLE;
};

TaskControlBlock.prototype.markAsHeld = function () {
  this.state = this.state | STATE_HELD;
};

TaskControlBlock.prototype.checkPriorityAdd = function (task, packet) {
  if (this.queue == null) {
    this.queue = packet;
    this.markAsRunnable();
    if (this.priority > task.priority) return this;
  } else {
    this.queue = packet.addTo(this.queue);
  }
  return task;
};

var STATE_RUNNING = 0;
var STATE_RUNNABLE = 1;
var STATE_SUSPENDED = 2;
var STATE_HELD = 4;
var STATE_SUSPENDED_RUNNABLE = STATE_SUSPENDED | STATE_RUNNABLE;
var STATE_NOT_HELD = ~STATE_HELD;

var COUNT = 1;

var ID_DEVICE_A   = 0;
var NUMBER_OF_IDS = 1;

var KIND_DEVICE   = 0;
var KIND_WORK = 1;

var DATA_SIZE = 1;

var scheduler = new Scheduler();
scheduler.addDeviceTask(ID_DEVICE_A, 4000, null);
scheduler.schedule();