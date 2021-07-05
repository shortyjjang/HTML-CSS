try {
  window.addEventListener( 'load' , loadFancyWidget, false );
}
catch ( e ) {
  try {
    window.attachEvent( 'onload' , loadFancyWidget);
  }
  catch ( e ) {
  }
}
function loadFancyWidget() { 
  var widget = document.getElementById('fancy_widget');
  var attrs = {};
  var q="";
  var param_names = ['rows','cols','thumbsize','source','div_style','with_diagonal','show_link','ref'];
  for ( var length=param_names.length,i = 0 ; i < length ; i++)  { 
    try {
      q+= param_names[i]+'='+ widget.getAttribute(param_names[i]) +"&";
      attrs [ param_names[i] ] = widget.getAttribute(param_names[i]);
    }
    catch(e){
    }
  }
  var _iframe = document.createElement('iframe')
  _iframe.src= "http://www.thefancy.com/widget_fancy.html?"+q+(new Date()).getTime();;
  _iframe.style.border = '0px';
  _iframe.style.borderStyle = 'none';
  _iframe.style.margin = 0;
  _iframe.setAttribute('allowtransparency',true);
	_iframe.setAttribute('frameBorder',0);
	_iframe.setAttribute('scrolling',"no");
	
  var thumbsize= parseInt(attrs['thumbsize']);
  var margin = (thumbsize >90 ) ? 45 : 25;
  var _width = parseInt(attrs['cols']) * (thumbsize+margin)+10;
  var _height = parseInt(attrs['rows']) * (thumbsize+margin) + 70;
  
  _iframe.style.width = _width+"px";
  _iframe.style.height = _height+"px";
  widget.appendChild(_iframe);

}
