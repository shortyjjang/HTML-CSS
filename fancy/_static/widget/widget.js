;(function(){
	var d=document,l=location,prtc=l.protocol,loc=prtc+'//'+l.host,dv=d.createElement('div');
    var ref='';

	function parse(str){
		var args={},tokens=str.split(/&/g);
		for(var i=0;i<tokens.length;i++){
			if(/^([^=]+)(?:=(.*))?$/.test(tokens[i])) args[RegExp.$1] = decodeURIComponent(RegExp.$2);
		}
		return args;
	};

	(function(){
		var i=0,ifr,script,src,search,args,scripts=d.getElementsByTagName('script'),len,width,height,match,regex=/^(?:https?:)?\/\/([^\/]*(fancy\.com|thin\.gd))\/widget\//i;
		while(script=scripts[i++]){
			if(script.parentNode.tagName == 'HEAD') continue;
			if(script.getAttribute('title') == 'Fancy') continue;
			src = script.getAttribute('src');
			if(!(match=regex.exec(src||''))) continue;
			host = match[1];
			script.setAttribute('title', 'Fancy');
			search = src.substr(src.indexOf('?')+1);
			args = parse(search);
			len = (args.size === 'c' && +args.len) || ({s:80,m:145,l:230})[args.size||'m']||145;
			width = len*args.cols + (args.cols-1)*3 + 44;
			height = len*args.rows + (args.rows-1)*3 + 11;
            if (args['ref']) ref = args['ref'];

			if('topbar' in args) height += 44;

			do {
				args.id = 'fancy-widget-'+Math.floor(Math.random()*1000);
			} while(d.getElementById(args.id));

 			dv.innerHTML = '<iframe id="'+args.id+'" src="//'+host+'/widget/frame?'+search+'&id='+args.id+'&loc='+loc+'" frameborder="0" width="'+width+'" height="'+height+'" allowtrasparency="true" style="'+(('topbar' in args)?'border-radius:2px;box-shadow:0 0 0 1px #efefef;':'')+'"></iframe>';
			ifr = dv.firstChild;
			ifr.onload = function(){ if(typeof window.fancyWidgetLoaded == 'function') fancyWidgetLoaded(this) };
 			script.parentNode.insertBefore(dv.firstChild,script);
			if(typeof window.fancyWidgetReady == 'function') fancyWidgetReady(ifr);
		};
	})();

	function addEvent(o,t,f){
		o&&o.attachEvent?o.attachEvent('on'+t,f):o.addEventListener(t,f,false);
	};

	var bg=null,body,ifr,wh,t,WIDTH=440,HEIGHT=(window.screen.height>900)?750:620;
	function onMessage(event){if(!event||!event.data||!event.origin||!/^https?:\/\/(\w+\.)?(fancy\.com|thin\.gd)/.test(event.origin))return;
		var msg = event.data.split('\t');
		if(!body) body = d.getElementsByTagName('body')[0];

		function close(){
			ifr.src = 'about:blank';
			ifr.style.display = 'none';
			bg.style.display = 'none';
		};

		switch(msg[0]){
			case 'open-widget':
				if(!bg) bg = d.getElementById('fancy-widget-anywhere-bg');
				if(!bg) {
					dv.innerHTML = '<div id="fancy-widget-anywhere-bg" style="position:fixed;top:0;left:0;width:100%;height:100%;opacity:.7;filter:alpha(opacity=70);background:#000;z-index:999;display:none"></div>';
					bg = dv.firstChild;
					bg.onclick = function(event){
						var e = event||window.event;
						if((e.target||e.srcElement)==bg) close();
					};
					body.appendChild(bg);
				}

				wh = d.documentElement.clientHeight;
				ww = d.documentElement.clientWidth - 2;
				if(ww && ww > 0  && WIDTH > ww) {
					HEIGHT = ww/WIDTH * HEIGHT;
					WIDTH  = ww;
				}

				t  = Math.max(Math.ceil((wh-HEIGHT)/2), 20) + Math.max(d.body.scrollTop, d.documentElement.scrollTop);

				if(!ifr) ifr = d.getElementById('fancy-widget-anywhere-ifr');
				if(!ifr) {
					dv.innerHTML = '<iframe id="fancy-widget-anywhere-ifr" src="about:blank" width="'+WIDTH+'" height="'+HEIGHT+'" frameborder="0" style="position:absolute;border:0;left:50%;top:'+t+'px;width:'+WIDTH+'px;height:'+HEIGHT+'px;margin:0 0 0 -'+Math.floor(WIDTH/2)+'px;z-index:1000;border-radius:1px;border:1px solid #000;box-shadow: 0 0 0 3px rgba(0,0,0,0.16);"></iframe>';
					ifr = dv.firstChild;
					body.appendChild(ifr);
				}
				bg.style.display = 'block';
				ifr.style.top = t+'px';
				ifr.style.display = 'block';
				ifr.src = msg[1]+(msg[1].indexOf('?')>0?'&':'?')+'loc='+loc+(ref != ''?'&ref='+ref : '');
				break;
			case 'close':
			case 'close-widget':
				close();
				break;
			case 'resize-widget':
				arg = msg[1].split(/,/g);
				var wdg = d.getElementById(arg[0]);
				if(wdg){
 					wdg.setAttribute('width',arg[1]);
 					wdg.setAttribute('height',arg[2]);
				}
				break;
		};
	};

	if(!window.fancyWidgetListenMessage) {
		addEvent(window, 'message', onMessage);
		window.fancyWidgetListenMessage = true;
	}
})();
