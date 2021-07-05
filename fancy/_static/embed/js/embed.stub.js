(function(w,d,sa,ga,cname){

var script=getCurrentScript(),html='<iframe src="//{host}/embed/v3/{id}?ref={ref}&type={type}&width={width}&loc={loc}" id="{name}" name="{name}" width="{width}" allowtransparency="true" frameborder="0" style="width:{width}px;height:1px;margin:0 auto;border:0"></iframe>',frame;
if (script) {
	var attrs = script.attributes,i=0,m,opts={width:450};
	while(attr=attrs[i++]){
		if(!(m=/^data-(.+)$/.exec(attr.nodeName)))continue;
		opts[m[1]]=attr.nodeValue;
	}
	opts.host = script.src.match(/^(?:https?:)?\/\/([^\/]+)/)[1];
	opts.type = opts.type || '';
	opts.name = 'fancy-embed-' + w.frames.length; 
	opts.width = Math.max(450,parseInt(opts.width,10));
	opts.loc = encodeURIComponent(location.protocol+'//'+location.hostname);
	if(/\bfa\b/.test(opts.type)){
		var fa = d.getElementById('fancy-anywhere');
		if(!fa) {
			with(fa=d.createElement('script')){id='fancy-anywhere';src='//fancy.com/anywhere.js'+(opts.ref?'?ref='+opts.ref:'');async=true};
			d.getElementsByTagName('head')[0].appendChild(fa);
		}
	}
	html = html.replace(/\{(\w+?)\}/g, function($0,$1){return opts[$1]||''});
	script.insertAdjacentHTML('afterend', html);
	frame = script.nextSibling;
}

function getCurrentScript(s){
	if(d.currentScript)return d.currentScript;
	if(d.querySelector){
		s = d.querySelector('script.'+cname+':not([data-init])');
	}else{
		var ss = d.getElementsByTagName('script'),i=0;
		while(s=ss[i++])if(s.className===cname&&!s[ga]('data-init'))break;
	}
	if(s)s[sa]('data-init',1);
	return s;
}
function log(m){
	if(w.console&&console.log)console.log(m);
}

function messageHandler(event){
	if(!event || !event.data) return;
	if(event.data.indexOf('{') !== 0) return;
	var data = JSON.parse(event.data);

	switch(data.type) {
		case 'resize':
			document.getElementById(data.wname).style.height = data.height+'px';
			break;
	}
}

if (w.addEventListener) {
	w.addEventListener('message', messageHandler, false);
} else if (w.attachEvent) {
	w.attachEvent('onmessage', function(e){ return messageHandler(e||window.event); });
}

})(window,document,'setAttribute','getAttribute','fancy-embed');
