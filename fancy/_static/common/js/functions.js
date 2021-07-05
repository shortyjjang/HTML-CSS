if(typeof String.prototype.trim == 'undefined'){
  String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g,''); };
}

String.prototype.startsWith = function(str){
  return (this.indexOf(str) === 0);
};

String.prototype.isInt = function() {
  return (parseFloat(this) == parseInt(this, 10)) && !isNaN(this);
};

String.prototype.isNumber = function() {
  return !isNaN(this);
};

Number.prototype.toCurrency = function(n) {
  if (parseFloat(this) == parseInt(this, 10)) {
    return this.toString();
  }
  return this.toFixed(n);
};
