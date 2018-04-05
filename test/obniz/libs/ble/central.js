var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("ble", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this, done);
  });


  it("scan", function () {
    this.obniz.ble.startScan({duration: 10});

    expect(this.obniz).send({ble: {scan: {duration: 10}}});
    expect(this.obniz).to.be.finished;
  });
  it("scan default", function () {
    this.obniz.ble.startScan();

    expect(this.obniz).send({ble: {scan: {duration: 30}}});
    expect(this.obniz).to.be.finished;
  });
  it("scan stop", function () {
    this.obniz.ble.startScan();

    expect(this.obniz).send({ble: {scan: {duration: 30}}});
    this.obniz.ble.stopScan();
    expect(this.obniz).send({ble: {scan: null}});
    expect(this.obniz).to.be.finished;
  });

  it("on scan", function () {
    var stub = sinon.stub();

    this.obniz.ble.onscan = stub;
    this.obniz.ble.startScan();

    expect(this.obniz).send({ble: {scan: {duration: 30}}});


    var results = {"ble":
          {"scan_result":
                {"event_type": "inquiry_result",
                    "address": "e5f678800700",
                    "device_type": "dumo",
                    "address_type": "public",
                    "ble_event_type": "connectable_advertisemnt",
                    "rssi": -82,
                    "adv_data": [2, 1, 26, 26, 255, 76, 0, 2, 21, 201, 97, 172, 167, 148, 166, 64, 120, 177, 255, 150, 44, 178, 85, 204, 219, 61, 131, 104, 10, 200],
                    "flag": 26,
                    "scan_resp": [22, 9, 83, 83, 83, 83, 83, 83, 83, 101, 114, 118, 105, 99, 101, 55, 56, 58, 70, 54, 58, 69, 53]}
          }
    };

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    var peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === "object").to.be.true;


    expect(peripheral.adv_data).to.be.deep.equal([2, 1, 26, 26, 255, 76, 0, 2, 21, 201, 97, 172, 167, 148, 166, 64, 120, 177, 255, 150, 44, 178, 85, 204, 219, 61, 131, 104, 10, 200]);
    expect(peripheral.scan_resp).to.be.deep.equal([22, 9, 83, 83, 83, 83, 83, 83, 83, 101, 114, 118, 105, 99, 101, 55, 56, 58, 70, 54, 58, 69, 53]);
    expect(peripheral.localName()).to.be.equal("SSSSSSService78:F6:E5");
    expect(peripheral.iBeacon()).to.be.deep.equal({major: 15747, minor: 26634, power: 200, rssi: -82, uuid: "c961aca7-94a6-4078-b1ff-962cb255ccdb"});

    expect(this.obniz).to.be.finished;
  });

  it("on scan2", function () {
    var stub = sinon.stub();

    this.obniz.ble.onscan = stub;
    this.obniz.ble.startScan();

    expect(this.obniz).send({ble: {scan: {duration: 30}}});


    var results = {"ble":
          {"scan_result":
                {"event_type": "inquiry_result",
                    "address": "e5f678800700",
                    "device_type": "dumo",
                    "address_type": "public",
                    "ble_event_type": "connectable_advertisemnt",
                    "rssi": -82,
                    "adv_data": [2, 1, 26],
                    "flag": 26,
                    "scan_resp": []}
          }
    };

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    var peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === "object").to.be.true;


    expect(peripheral.adv_data).to.be.deep.equal([2, 1, 26]);
    expect(peripheral.localName()).to.be.null;
    expect(peripheral.iBeacon()).to.be.null;

    expect(this.obniz).to.be.finished;
  });


  it("connect", function () {
    var stub = sinon.stub();

    this.obniz.ble.onscan = stub;
    this.obniz.ble.startScan();

    expect(this.obniz).send({ble: {scan: {duration: 30}}});


    var results = {"ble":
          {"scan_result":
                {"event_type": "inquiry_result",
                    "address": "e5f678800700",
                    "device_type": "dumo",
                    "address_type": "public",
                    "ble_event_type": "connectable_advertisemnt",
                    "rssi": -82,
                    "adv_data": [2, 1, 26],
                    "flag": 26,
                    "scan_resp": []}
          }
    };

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    var peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === "object").to.be.true;

    var connectStub = sinon.stub();
    peripheral.onconnect = connectStub;
    peripheral.connect();

    expect(this.obniz).send({ble: {connect: {address: "e5f678800700"}}});

    sinon.assert.callCount(connectStub, 0);

    testUtil.receiveJson(this.obniz, {
      ble: {
        status_update: {
            address: "e5f678800700",
            status: "connected"
          }
      }
    });

    sinon.assert.callCount(connectStub, 1);

    expect(this.obniz).to.be.finished;
  });



  it("disconnect", function () {
    var stub = sinon.stub();

    this.obniz.ble.onscan = stub;
    this.obniz.ble.startScan();

    expect(this.obniz).send({ble: {scan: {duration: 30}}});


    var results = {"ble":
          {"scan_result":
                {"event_type": "inquiry_result",
                    "address": "e5f678800700",
                    "device_type": "dumo",
                    "address_type": "public",
                    "ble_event_type": "connectable_advertisemnt",
                    "rssi": -82,
                    "adv_data": [2, 1, 26],
                    "flag": 26,
                    "scan_resp": []}
          }
    };

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    var peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === "object").to.be.true;

    var connectStub = sinon.stub();
    var disconnectStub = sinon.stub();
    peripheral.onconnect = connectStub;
    peripheral.ondisconnect = disconnectStub;
    peripheral.connect();

    expect(this.obniz).send({ble: {connect: {address: "e5f678800700"}}});

    sinon.assert.callCount(connectStub, 0);

    testUtil.receiveJson(this.obniz, {
      ble: {
        status_update: {
            address: "e5f678800700",
            status: "disconnected"
          }
      }
    });

    sinon.assert.callCount(connectStub, 0);
    sinon.assert.callCount(disconnectStub, 1);

    expect(this.obniz).to.be.finished;
  });





});
