(function () {

if(/^(www\.)?fancy\.com$/.test(location.hostname)) return alert("Fancy bookmarklet now installed.\nYou can now add things to your Fancy catalog from other sites around the web. Go give it a try!");

var host = 'fancy.com', prefix = 'fancy_';

// get hostnmae from script
(function(){
	var script = elem('thefancy_tagger_bookmarklet_helper_js'), match;
	if(script) match = /^(https?:)?\/\/([^\/]+)/g.exec(script.getAttribute('src')||'');
	if(match) host = match[2];
})();

if(location.search.indexOf("bigbird")>-1) host = 'bigbird.fancy.com';
if(location.search.indexOf("pistos")>-1) host = 'pistos.fancy.com';

var wrapper  = {obj:null, id:prefix+'wrapper'},
	iframeWrapper  = {obj:null, id:prefix+'iframe_wrapper'},
    iframe   = {obj:null, id:prefix+'iframe', win: null, url:location.protocol+'//'+host+'/bookmarklet/dialog?new'},
	imageBox = {obj:null, id:prefix+'picker_image', title:null, img:null, ul:null},
    style    = {obj:null, url:'//'+host+'/bookmarklet/css/bookmarklet.new.css?v=0009', id:prefix+'css'},
	D = document, loc = location.protocol+'//'+location.host,
	factory  = D.createElement('div'),
	head     = D.getElementsByTagName('head')[0],
	body     = D.body,
	images   = D.iamges,
	latest   = {img:null, images:[]};

(function(){
	if(D.readyState !== 'complete') return setTimeout(arguments.callee, 10);

	// add a stylesheet
	style.obj = elem(style.id);
	if(!style.obj) {
		style.obj = D.createElement('link');
		attr(style.obj,{id : style.id, rel : 'stylesheet', href : style.url});
		head.appendChild(style.obj);
	}

	// add a wrapper
	wrapper.obj = elem(wrapper.id);
	if(!wrapper.obj) {
		wrapper.obj = create('<div id="'+wrapper.id+'"></div>');
		css(wrapper.obj, {position:'absolute',display:'none', top:0, left:0, width:'100%', opacity:0, zIndex:9999999, webkitTransition:'opacity .3s', mozTransiiton:'opacity .3s', msTransition:'opacity .3s'});
	}
	body.appendChild(wrapper.obj);
	body.style.overflow = 'hidden';
	wrapper.obj.className = '';
	wrapper.obj.style.height = Math.max(D.documentElement.scrollHeight,body.scrollHeight,D.body.offsetHeight)+'px';
	if(wrapper.obj.style.display != 'block'){
		css(wrapper.obj, {opacity:0, display:'block'});
		setTimeout(function(){ wrapper.obj.style.opacity = 1; }, 10);
	}

	// always create new iframe
	iframe.obj = elem(iframe.id);
	if(!iframe.obj) {
		iframe.obj = create('<iframe id="'+iframe.id+'" src="'+iframe.url+'" allowtransparency="true" scrolling="no" frameborder="0" style="display:block; margin: 161.5px auto 0px; height: 453px; width: 500px;"></iframe>');
		if(!iframeWrapper.obj){
			iframeWrapper.obj = create('<div id="'+iframeWrapper.id+'" style="position: fixed; top: 0px; left: 0px; width: 100%; opacity: 1; z-index: 9999999; height: 100%; background: rgba(48, 51, 57, 0.6); display: none;"></div>');
			wrapper.obj.appendChild(iframeWrapper.obj);
			on(iframeWrapper.obj, 'click', function(e,target,url){
				e = e || window.event;
				target = e.target || e.srcElement;

				if(target === iframeWrapper.obj){
					css(iframeWrapper.obj, {display:'none'});
					css(iframe.obj, {display:'none'});
					css(imageBox.obj, {display:'block'});
				}
			});
		}
		iframeWrapper.obj.appendChild(iframe.obj);
		on(iframe.obj, 'load', function(e){
			if(iframe.obj.src!=iframe.url){
				css(iframeWrapper.obj, {display:'block'});
				css(iframe.obj, {display:'block'});
				css(imageBox.obj, {display:'none'});
			}else{
				css(iframeWrapper.obj, {display:'none'});
				css(iframe.obj, {display:'none'});
				css(imageBox.obj, {display:'block'});
			}
		})
	}
	
	// create a images element if it doesn't exist
	imageBox.obj = elem(imageBox.id);
	if(!imageBox.obj){
		imageBox.obj = create('<div id="'+imageBox.id+'"></div>');
		on(imageBox.obj, 'click', function(e,target,url){
			e = e || window.event;
			target = e.target || e.srcElement;

			if(target.nodeName == 'SPAN'){
				target = target.parentNode;
				url = iframe.url+'#data:img='+encodeURIComponent(target.imageSrc)+'&title='+encodeURIComponent(target.title||D.title)+'&loc='+encodeURIComponent(loc)+'&path='+location.pathname+'&search='+encodeURIComponent(location.search);
				iframe.obj.setAttribute('src', url);
				css(iframeWrapper.obj, {display:'block'});
				css(iframe.obj, {marginTop: (window.innerHeight- parseInt(iframe.obj.style.height))/2+'px'});
				css(iframe.obj, {display:'block'});
				imageBox.img = target;

				e.cancelBubble = true;
				if(e.preventDefault) e.preventDefault();
				if(e.stopPropagation) e.stopPropagation();
			}else if(target === imageBox.obj){
				close();
			}
		});
		wrapper.obj.appendChild(imageBox.obj);
	}
	imageBox.obj.innerHTML = '<h2 class="title">Select an item to add to Fancy</h2><div class="fancy-content"><ul id="fancy-image-list"></ul></div><a href="#" class="close">Close</a>';
	imageBox.obj.lastChild.onclick = function(e){ e.preventDefault(); close(); return false; };
	imageBox.title = imageBox.obj.firstChild;
	imageBox.ul = elem("fancy-image-list");
	css(imageBox.obj, {display:'block'});

	// get images
	function add(im){
		var pos=offset(im), clone=im.cloneNode(), w=im.offsetWidth, h=im.offsetHeight, i=0, a, op=im, wrap=create('<li><a href="#"><span class="figure"></span><span class="title"></span><small class="size"></small></a></li>');
		// remove all attributes except for src, alt and title
		while(a=im.attributes[i++]){if(!/^(?:src|alt|title)$/i.test(a.nodeName))clone.removeAttribute(a.nodeName)};
		clone.fancyCloned = true;
		var title = (clone.getAttribute('title') && clone.getAttribute('title').trim()) || (clone.getAttribute('alt') && clone.getAttribute('alt').trim()) || (document.title && document.title.trim()) || 'Untitled';
		wrap.firstChild.title = title;
		wrap.getElementsByTagName('A')[0].href = clone.src;
		wrap.getElementsByTagName('A')[0].imageSrc = clone.src;
		wrap.getElementsByClassName("title")[0].innerHTML = title;
		wrap.getElementsByClassName("size")[0].innerHTML = (clone.width||w) + "x" + (clone.height||h);
		css( wrap.getElementsByClassName("figure")[0], {backgroundImage: 'url("'+ clone.src+'")'});
		imageBox.ul.appendChild(wrap);
	}
	var i = 0, valid = 0, img;
	while(img=D.images[i++]){
		if(img.fancyCloned) continue; 
		if(img.src && !img.src.startsWith("data:image") && img.width > 150 && img.height > 150){
			valid++;
			add(img);
		}
	}
	if( !valid ){
		imageBox.title.innerHTML = '';
		imageBox.ul.innerHTML = '<li class="empty"><strong>Ouch!</strong><br>We couldn\'t find any good images on this page.</li>';
	}
})();

if(!window.thefancy_bookmarklet) window.thefancy_bookmarklet = {tagger:{}};
window.thefancy_bookmarklet.tagger.clean_listeners = function(){
	off(window, 'message', onMessage);
	off(document, 'keydown', onKeydown);
};

on(document, 'keydown', onKeydown);
if('postMessage' in window) on(window, 'message', onMessage);

function onKeydown(event){
	event = event || window.event;
	var key = event.which || event.keyCode;

	if (key == 27 && wrapper.obj && wrapper.obj.style.display == 'block') {
		close();
		off(document, 'keydown', onKeydown);
	}
};

function onMessage(event){
	event = event || window.event;
	processData(unparam(event.data));
};

function processData(args){
	switch(args.cmd){
		case 'reset':
			css(iframeWrapper.obj, {display:'none'});
			css(iframe.obj, {display:'none'});
			css(imageBox.obj, {display:'block'});
			break;
		case 'close': close(); break;
		case 'resize':
			if(args.height>0){
				iframe.obj.style.height = args.height+'px';
				css(iframe.obj, {marginTop: (window.innerHeight-args.height)/2+'px'});
				css(imageBox.obj, {display:'none'});
			}
			break;
	}
};

function close(){
	css(wrapper.obj, {display:'none'});
	css(iframeWrapper.obj, {display:'none'});
	css(iframe.obj, {display:'none'});
	css(imageBox.obj, {display:'none'});
	css(body, {overflow:''});
	iframe.obj.setAttribute('src', iframe.url);
};

function create(str){if(str.substr(0,1)=='<'){factory.innerHTML=str;return factory.firstChild}else{return document.createElement(str)}};
// add event listsener to the specific element
function on(el,type,handler){ el.attachEvent?el.attachEvent('on'+type,handler):el.addEventListener(type,handler,false) };
// remove an event listener
function off(el,type,handler){ el.detachEvent?el.detachEvent('on'+type,handler):el.removeEventListener(type,handler) };
// get element by id
function elem(id){return document.getElementById(id)};
// set css
function css(el,prop){if(typeof prop=='string')try{if(window.getComputedStyle)return window.getComputedStyle(el).getPropertyValue(prop);if(prop=='float')prop='styleFloat';prop=prop.replace(/-([a-z])/g,function($0,$1){return $1.toUpperCase()});return el.currentStyle[prop]||null}catch(e){return null};for(var p in prop)if(prop.hasOwnProperty(p))try{el.style[p.replace(/-([a-z])/g,function(m0,m1){return m1.toUpperCase()})]=prop[p];}catch(e){}};
// set attributes
function attr(el,attrs){ for(var a in attrs)if(attrs.hasOwnProperty(a))el.setAttribute(a,attrs[a]); };
// get offset
function offset(el){ var t=0,l=0; while(el && el.offsetParent){ t+=el.offsetTop;l+=el.offsetLeft;el=el.offsetParent }; return {top:t,left:l} };
// extend object like jquery's extend() function
function extend(){ var a=arguments,i=1,c=a.length,o=a[0],x;for(;i<c;i++){if(typeof(a[i])!='object')continue;for(x in a[i])if(a[i].hasOwnProperty(x))o[x]=a[i][x]};return o };
// unparam
function unparam(s){ var a={},i,c,r;s=s.split('&');for(i=0,c=s.length;i<c;i++)if(r=/^([^=]+?)(=(.*))?$/.exec(s[i]))a[r[1]]=decodeURIComponent(r[3]||'');return a };
// send message to iframe window
function send(data){ iframe.obj.setAttribute('src', iframe.url+'#data:'+data);try{iframe.win.postMessage(data,'http://'+host)}catch(e){} };

})();
