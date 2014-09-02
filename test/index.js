var assert  = require("assert");
var raf     = require("raf");
var fastdom = require("fastdom");
var dbw     = require("../");

describe("dom-batch-wrapper", function() {

  beforeEach(function() {
    var callOrder = [];
    this.callOrder = callOrder;
    this.read = function() {
      callOrder.push("r");
    };

    this.write = function() {
      callOrder.push("w");
    };
  });

  it("should create a read/write method", function() {
    var fn = dbw({
      read:  this.read,
      write: this.write
    });
    assert(fn.read);
    assert(fn.write);
  });

  it("should call read passing results to write", function() {
    var data, called;
    var fn = dbw({
      read:  function() {
        called = true;
        return "testing";
      },
      write: function(_data) {
        data = _data;
      }
    });
    fn();
    assert.equal(called, true);
    assert.equal(data, "testing");
  });

  it("should not batch unless configured", function() {
    var fn = dbw({
      read:  this.read,
      write: this.write
    });
    fn();
    fn();
    assert.deepEqual(this.callOrder, ["r", "w", "r", "w"]);
  });

  it("should batch when configured", function() {
    var self = this;
    dbw.configure(fastdom);
    var fn = dbw({
      read:  this.read,
      write: this.write
    });
    fn();
    fn();

    raf(function() {
      raf(function() {
        assert.deepEqual(self.callOrder, ["r", "r", "w", "w"]);
      });
    });
  });
});

