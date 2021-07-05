(function(global,doc,loc,ga) {

if(location.search.indexOf("new_fancy_bookmarklet")>-1){
	_my_script=document.createElement('SCRIPT');
	_my_script.type='text/javascript';
	_my_script.id = 'thefancy_tagger_bookmarklet_helper_js';
	
	if(location.search.indexOf("bigbird")>-1){
		_my_script.src=location.protocol+'//bigbird.fancy.com/bookmarklet/fancy_tagger2.js?x='+(Math.random());
	}else if(location.search.indexOf("pistos")>-1){
		_my_script.src=location.protocol+'//pistos.fancy.com/bookmarklet/fancy_tagger2.js?x='+(Math.random());		
	}else{
		_my_script.src=location.protocol+'//fancy.com/bookmarklet/fancy_tagger2.js?x='+(Math.random());
	}

	document.getElementsByTagName('head')[0].appendChild(_my_script);
	return;
}
// beep. bookmarklet is disallowed on Fancy.
if(/^(www\.)?fancy\.com$/.test(loc.hostname)) return alert("Fancy bookmarklet now installed.\nYou can now add things to your Fancy catalog from other sites around the web. Go give it a try!");
if(!doc.querySelectorAll||![].reduce) return alert('Fancy bookmarklet do not support older browsers.');

var host = 'fancy.com', prefix = 'fancy-bookmarklet-tagger-',
    iframe  = {obj:null, id:prefix+'iframe', win: null, url:loc.protocol+'//'+host+'/bookmarklet/bookmarklet.html?v=0027'},
	marker  = {obj:null, id:prefix+'marker'}, // image marker
    style   = {url:loc.protocol+'//'+host+'/_ui/bookmarklet/tagger/css/bookmarklet.css?v=0007', id:prefix+'css'},
	factory = doc.createElement('div'),
	body    = doc.body,
	latest  = {img:null, images:[]},
	imgMap  = {};

function scrap() {
	imgMap = {};
	return [].concat.apply([],doc.querySelectorAll('img,[style*="background-image"]')).reduce(function(result,el,idx){
		var src;
		if(enoughSize(el)) src = getImagePath(el);
		if(src) (src in imgMap) ? src = null : imgMap[src] = result.length;
		return src ? result.concat([{src:src,title:el[ga]('title')||el[ga]('alt')||doc.title}]) : result;
	}, []);
}
function urlify(path) {
	if(path.indexOf('//') === 0) return loc.protocol + path;
	if(path.indexOf('/') === 0) return urlify('//' + loc.host + path);
	if(path.indexOf('./') === 0) return urlify(loc.pathname + path);
	return path;
}

function enoughSize(el) {
	return el.offsetWidth > 150 && el.offsetHeight > 150;
}

function getImagePath(el) {
	var regexBg=/url\s*\("?(.+?)"?\)/, regexSrcset=/(.+?)\s+(\d+)[xw],?/g, match, biggest;
	if (match = regexBg.exec(el.style.backgroundImage)) return urlify(match[1]);
	if (el.src) return urlify(el.src);

	while (match = regexSrcset.exec(el.srcset)) {
		if (!biggest || +biggest[2] < +match[2]) biggest = match;
	}

	if (biggest) return urlify(biggest[1]);
}

extend(iframe, {
	show : function(){
		var idx = 0;
		latest.images = scrap();

		if (latest.img) idx = +imgMap[getImagePath(latest.img)] || 0;

		data = imageData(idx);

		this.obj.style.display = 'block';
		send(data);
	},
	hide : function(){
		this.obj.style.display = 'none';
		this.obj.setAttribute('src', 'about:blank');
	}
});

extend(marker, {
	show : function(){
		if(this.obj) this.obj.style.display = 'block';
	},
	hide : function(){
		if(this.obj) this.obj.style.display = 'none';
	}
});

var handlers = {
	doc : {
		keyup : function(event){
			if(event.keyCode != 27) return; // exit if pressed key isn't ESC

			iframe.hide();
		},
		mouseover : function(event){
			var el = event.target, pos;

			if((!el.src && !el.srcset && !el.style.backgroundImage) || el.id === marker.id || !enoughSize(el)) return;

			latest.img = el;

			pos = offset(el);
			css(marker.obj, {top:pos.top+'px', left:pos.left+'px', width:el.offsetWidth+'px', height:el.offsetHeight+'px'});
			marker.show();
		}
	},
	marker : {
		click : function(event){
			event.preventDefault();
			event.stopPropagation();

			iframe.show();
			marker.hide();
		},
		mouseout : function(event){
			var el = event.target;
			if(el === marker.obj) marker.hide();
		}
	}
};

on(window, 'message', function(event){
	if(!/fancy\.com/.test(event.origin)) return;
	var args = unparam(event.data);
	switch(args.cmd){
		case 'close':
			iframe.hide();
			tagger.cleanListeners();
			break;
		case 'resize':
			iframe.obj.style.height = args.h+'px';
			break;
		case 'index':
			args.idx = parseInt(args.idx);
 			data = imageData(args.idx);
			send(data);
			break;
	}
});

(function(){
	if(document.readyState !== 'complete') return setTimeout(arguments.callee, 100);

	// always create new iframe
	iframe.obj = elem(iframe.id);
	if(!iframe.obj) {
		factory.innerHTML = '<iframe id="'+iframe.id+'" allowtransparency="true" style="display:none;position:fixed;top:10px;right:10px;border:1px solid #4c515c;z-index:100001;margin:0;background:#eff1f7;width:279px;height:372px"></iframe>';
		iframe.obj = factory.lastChild;
		body.insertBefore(iframe.obj, body.firstChild);
		iframe.win = iframe.obj.contentWindow || iframe.obj;
	}
	iframe.show();

	// create a marker if it doesn't exist
	marker.obj = elem(marker.id);
	if(!marker.obj){
		factory.innerHTML = '<div id="'+marker.id+'" style="visibility:hidden;position:absolute;border:10px solid #8f0;z-index:100000;background:transparent url(http://s3.amazonaws.com/thefancy/_ui/images/f-plus.png) no-repeat 5px 5px"></div>';
		marker.obj = factory.lastChild;
		body.insertBefore(marker.obj, body.firstChild);

		css(marker.obj, {top:0, left:0});
		if(offset(marker.obj).top == 0) {
			css(marker.obj, {marginTop:'-10px',marginLeft:'-10px'});
		}
		css(marker.obj, {display:'none', visibility:'visible'});
	}

	each(handlers.doc, function(type,handler){ on(doc, type, handler) });
	each(handlers.marker, function(type,handler){ on(marker.obj, type, handler) });
})();

var tagger = {
	cleanListeners : function(){
		each(handlers.doc, function(type,handler){ off(doc, type, handler) });
		each(handlers.marker, function(type,handler){ off(marker.obj, type, handler) });
	}
};
if(!global.thefancy_bookmarklet) global.thefancy_bookmarklet = {};
global.thefancy_bookmarklet.tagger = tagger;

// add event listsener to the specific element
function on(el,type,handler){el.addEventListener(type,handler)};
// remove an event listener
function off(el,type,handler){el.removeEventListener(type,handler)};
// get element by id
function elem(id){ return doc.getElementById(id) };
// set css
function css(el,prop){ for(var p in prop)if(prop.hasOwnProperty(p))try{el.style[p.replace(/-([a-z])/g,function(m0,m1){return m1.toUpperCase()})]=prop[p];}catch(e){} };
// get offset
function offset(el){ var t=0,l=0; while(el && el.offsetParent){ t+=el.offsetTop;l+=el.offsetLeft;el=el.offsetParent }; return {top:t,left:l} };
// each
function each(obj,fn){ for(var x in obj){if(obj.hasOwnProperty(x))fn.call(obj[x],x,obj[x],obj)} };
// extend object like jquery's extend() function
function extend(){ var a=arguments,i=1,c=a.length,o=a[0],x;for(;i<c;i++){if(typeof(a[i])!='object')continue;for(x in a[i])if(a[i].hasOwnProperty(x))o[x]=a[i][x]};return o };
// unparam
function unparam(s){ var a={},i,c;s=s.split('&');for(i=0,c=s.length;i<c;i++)if(/^([^=]+?)(=(.*))?$/.test(s[i]))a[RegExp.$1]=decodeURIComponent(RegExp.$3||'');return a };
// send message to iframe window
function send(data){iframe.obj.setAttribute('src', iframe.url+'#tagger:'+data);try{iframe.obj.contentWindow.postMessage(data,loc.protocol+'//'+host)}catch(e){}};
// image data
function imageData(i){
	var imgs = latest.images;
	data = [
		'total='+imgs.length,
		'idx='+i,
		'loc='+encodeURIComponent(loc.protocol+'//'+loc.host+loc.pathname+loc.search)
	];
	if(imgs[i]){
		data.push('src='+encodeURIComponent(imgs[i].src));
		data.push('title='+encodeURIComponent(imgs[i].title));
	}
	return data.join('&');
}

})(window,document,location,'getAttribute');
