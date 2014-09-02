var batchFn;

var domBatchWraper = function(opts) {

  var fn = function() {
    var data, args = Array.prototype.slice.call(arguments);

    function read() {
      data = fn.read.apply(this, args);
    }

    function write() {
      args.unshift(data);        
      fn.write.apply(this, args);
    }

    if(batchFn) {
      batchFn.read(read);
      batchFn.write(write);
    } else {
      read();
      write();
    }
  } 
    
  if(opts && opts.read)  fn.read  = opts.read;
  if(opts && opts.write) fn.write = opts.write;
    
  return fn;
}

domBatchWraper.configure = function(_batchFn) {
  batchFn = _batchFn;
};

module.exports = domBatchWraper;
