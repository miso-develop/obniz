
var PeripheralIO = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.value = 0;
  this.observers = [];
};

PeripheralIO.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

PeripheralIO.prototype.output = function(value) {
  var obj = {};
  obj["io"+this.id] = value;
  this.value = value;
  this.Obniz.send(obj);
};

PeripheralIO.prototype.drive = function(drive) {

  if (typeof drive !== "string") {
    throw new Error("please specify drive methods in string")
    return;
  }
  let output_type = ""
  switch(drive) {
    case "5v":
      output_type = "push-pull5v";
      break;
    case "3v":
      output_type = "push-pull3v";
      break;
    case "open-drain":
      output_type = "open-drain";
      break;
    default:
      throw new Error("unknown drive method")
      break;
  }

  var obj = {};
  obj["io"+this.id] = {
    output_type: output_type
  };
  this.Obniz.send(obj);
};

PeripheralIO.prototype.pull = function(updown) {

  if (typeof updown !== "string" && updown !== null) {
    throw new Error("please specify pull methods in string")
    return;
  }
  let pull_type = ""
  switch(updown) {
    case "5v":
      pull_type = "pull-up5v";
      break;
    case "3v":
      pull_type = "pull-up3v";
      break;
    case "down":
      pull_type = "pull-down";
      break;
    case null:
      pull_type = "float";
      break;
    default:
      throw new Error("unknown pull_type method")
      break;
  }

  var obj = {};
  obj["io"+this.id] = {
    pull_type: pull_type
  };
  this.Obniz.send(obj);
};

PeripheralIO.prototype.input = function(callback) {
  this.onchange = callback;
  var obj = {};
  obj["io"+this.id] = {
    direction: "input",
    stream: true
  };
  this.Obniz.send(obj);
  return this.value;
};

PeripheralIO.prototype.inputWait = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["io"+self.id] = {
      direction: "input",
      stream: false
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralIO.prototype.notified = function(obj) {
  this.value = obj;
  var callback = this.observers.shift();
  if (callback) {
    callback(obj);
  }
  if (typeof(this.onchange) === "function") {
    this.onchange(obj);
  }
};