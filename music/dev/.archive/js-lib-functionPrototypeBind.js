Function.prototype.bind||(Function.prototype.bind=function(b){if("function"!==typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var d=Array.prototype.slice.call(arguments,1),e=this,a=function(){},c=function(){return e.apply(this instanceof a&&b?this:b,d.concat(Array.prototype.slice.call(arguments)))};a.prototype=this.prototype;c.prototype=new a;return c});
