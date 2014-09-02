# dom-batch-wrapper [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)
Create a function for use with fastdom (or any other dom batch wrapper), you define `read`/`write` functions which get called in sequence. If you configure a DOM batching library that'll get used instead.


## Example
Say for instance you have a method that finds the DOM element width and doubles it

    function doubleSize(el) {
      var w = el.offsetWidth;
      el.style.width = (w*2)+"px";
    }

If we ran this in a loop obviously it'd cause layout thrashing (which fastdom helps prevent). This library just helps you define a method in its `read`/`write` parts. So the above would become

    var dbw = require("dom-batch-wrapper");
    var doubleSize = dbw({
      read: function(el) {
        return el.offsetWidth;
      },
      write: function(w, el) {
        el.style.width = (w*2)+"px";
      }
    });

Where the return value of `read` is passed into `write` as the first arg. However at the moment it still won't take advantage of batching. To do this simply

    var fastdom = require("fastdom");
    dbw.configure(fastdom);

It is intended that any module that uses this library includes it as a `peerDependency` in the modules `package.json`. This way no modules across your project will try to do anything clever with DOM batching (which can cause unexpected side effects) unless you enable it.


## License
MIT
