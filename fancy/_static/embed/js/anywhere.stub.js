(function(w,d,ae,ael,rs,ga,sa,ac,pn,r){
	var s=d.getElementById('fancy-anywhere'),strg,type,pos;

	// this script may be loaded more than once.
	// using this global object, cache created HTML elements and reuse them.
	if(!(strg=w.__fancy_anywhere__)) strg=w.__fancy_anywhere__={};

	// set fatal parameters with default values if they aren't set.
	type = w.fancy_anywhere_type||'layer';
	pos = w.fancy_anywhere_pos||'RB';

	var src=s[ga]('src'),hst=/^(?:https?:)?\/\/([^\/]+)/i.exec(src)[1],prtc=location.protocol,args={},srv=prtc+'//'+hst;
	src.replace(/^.+?\?/, '').replace(/(\w+)=([^&]+)/g,function($0,$1,$2){args[$1]=$2});

	// call ready() when the document is ready.
	var added=false;
	(function(){
		if(d[r]==='interactive'||d[r]==='complete')return ready();
		if(d[ael]&&!added)return(added=true)&&d[ael]('DOMContentLoaded',ready,false);
		setTimeout(arguments.callee,50);
	})();

	// cache image resources
	(new Image).src = srv+'/embed/images/post_button.png';
	(new Image).src = srv+'/embed/images/anywhere.png';

	function ready(){
		if(!strg.onmessage&&w.postMessage&&type=='layer')on(w,'message',strg.onmessage=onMessage);
		// set default styles based on alignment type of FA button.
		var alignHor='left:auto;right:12px;'; // default : Right
		if(pos.indexOf("L")>=0){
			alignHor='left:12px;right:auto;';
		}else if(pos.indexOf("C")>=0){
			alignHor='left:50%;right:auto;margin-left:-83px;';
		}

		var alignVer='top:auto;bottom:29px;'; // default : Bottom
		if(pos.indexOf("T")>=0){
			alignVer='top:29px;bottom:auto;';
		}else if (pos.indexOf("M")>=0){
			alignVer='top:50%;bottom:auto;margin-top:-19px;';
		}

		// find valid item images and add a fancy anywhere button to each if it is buyable.
		function process(){
			var i=0,c,a,m,im,id,kw,ids=[],re=/\bfancy-id-(\d+)\b/,dv=d.createElement('div'),sp,sc,cb='__fancy_anywhere_'+Math.ceil(Math.random()*999),sty,btn,match;

			// default styles
			sty='display:none;position:absolute;background:transparent;margin:0;width:auto;height:auto;'+alignHor+alignVer+'border:0;max-width:none;min-width:none;';
			if(args.buttonImg)btn='<img src="'+decodeURIComponent(args.buttonImg)+'" style="'+sty+'" alt="Buy with Fancy" />';

			// for legacy
			while(im=d.images[i++]){
				if((match=re.exec(im.className))&&(a=im[pn])&&a.nodeName=='A'){
					a.className='fancy-anywhere-image';
					a[sa]('data-fancy-id',match[1]);
				}
			}

			i=0;
			while(a=d.links[i++]){
				c=a.firstElementChild;id=a[ga]('data-fancy-id')||'';kw=a[ga]('data-fancy-keywords')||'';
				if((!id&&!kw)||!/\bfancy-anywhere-(image|text)\b/.test(a.className)||a[ga]('data-fancy-done'))continue;
				if(c&&c.nodeName=='IMG'){
					if(/\/mark\/anywhere\/rb\//.test(c.src))c.src=c.src.replace(/mark\/anywhere\/rb\/(.+?\/){3}/,'');
					if(!args.buttonImg)btn='<iframe src="'+srv+'/embed/button?id='+id+'&keywords='+kw+'&loc='+prtc+'//'+location.host+(args.ref?'&ref='+args.ref:'')+(args.new?'&new=true':'')+'&type='+type+'" frameborder="0" allowtransparency="true" '+(window.Tumblr?'class="tumblr-embed"':'')+' style="'+sty+'width:169px;height:38px"></iframe>';
					dv.innerHTML='<span class="fancy-image-container" style="position:relative;display:inline-block;width:auto;height:auto;max-width:100%;padding:0;margin:0;top:0;left:0;right:auto;bottom:auto;">'+btn+'</span>';
					c.parentElement.insertBefore(sp=dv.firstElementChild,c);
					sp.insertBefore(c,a.__fancy_button=sp.firstElementChild);
				}
				if(!(m=strg.linkMap))strg.linkMap=m={};
				if(id)ids.push(id)&&m[id]?m[id].push(a):m[id]=[a];
				if(kw){
					on(a,'click',a.__fancy_click=clickHandler(null,kw));
					try{a.__fancy_button.style.display='block'}catch(e){};
				}
				a[sa]('data-fancy-done',true);
			}

			// check buyable items via JSONP
			if(ids.length){
				sc=d.createElement('script');
				sc[sa]('async','true');
				sc[sa]('src',srv+'/check-sales.jsonp?id='+ids.join(',')+'&callback='+cb+(args.new?'&new':'')+'&_='+(new Date).getTime());
				d.getElementsByTagName('head')[0][ac](sc);
			}

			// JSONP callback
			w[cb]=function(rsp){
				each(rsp.valid||[],function(i,id){
					each(strg.linkMap[id]||[],function(i,a){
						on(a,'click',a.__fancy_click=clickHandler(id));
						try{a.__fancy_button.style.display='block'}catch(e){};
					});
				});
			};
		};
		process();

		// some tumblr themes use ajax pagination.
		// the ajax prefilter ensure fancy anywhere to recognize new ajax-loaded items.
		if(w.jQuery && jQuery.ajaxPrefilter){
			jQuery.ajaxPrefilter(function(options, orgOptions, jqXHR){
				if(/\/page\/\d|[\?&]paged?=\d/.test(options.url)) {
					jqXHR.done(process);
				}
			});
		}

		// remove previous event handler
		if(!strg.process)on(w,'scroll',strg.process=process);
	}
	function on(o,t,f){try{o&&o[ael]?o[ael](t,f,false):[ae]('on'+t,f)}catch(e){}}
	function off(o,t,f){try{o&&o.removeEventListener?o.removeEventListener(t,f):o.detachEvent('on'+t,f)}catch(e){}}
	function each(o,f){if(!o)return;for(var x in o)if(o.hasOwnProperty&&o.hasOwnProperty(x))f(x,o[x])}
	function clickHandler(id,keyword){var p='preventDefault',s='stopPropagation',l='https://'+hst+'/embed/';if(id){l+='buy/'+id}else{l+='keyword/'+keyword};return function(e){e=e||w.e;if(e[p])e[p]();if(e[s])e[s]();e.returnValue=false;e.cancelBubble=true;onMessage({data:'open\t'+l+(args.ref?'?ref='+args.ref:'')+(args.new?'&new':''),origin:'http://fancy.com'});return false}}
	function closest(o,t){t=t.toLowerCase();do{if(o&&o.nodeName&&o.nodeName.toLowerCase()===t)return o}while(o=o.parentNode);return null}
	function onMessage(e){if(!e||!e.data||!e.origin||!/^https?:\/\/(\w+\.)?(fancy\.com|thin\.gd)/.test(e.origin))return;
		var WIDTH = Math.min((500),dw=d.documentElement.clientWidth-10), HEIGHT = (w.screen.height > 900)?750:620, dw;
		var bg,dv=d.createElement('div'),msg=e.data.split('\t'),body=d.getElementsByTagName('body')[0],ww,wh,t,de=d.documentElement;
		
		if (screen.height < 620) {
			HEIGHT = screen.height-40;
		}
		if (screen.width < 500) {
			WIDTH = screen.width-40;
		}

		function close(){
			strg.ifr.src='about:blank';strg.ifr.style.display='none';strg.bg.style.display='none'
			body.style.overflow='';
		}
		switch(msg[0]){
			case 'open':
				if(!(bg=strg.bg)){
					dv.innerHTML='<div id="anywhere_back"><link rel="stylesheet" media="all" type="text/css" href="'+srv+'/embed/css/anywhere_widget.css"><a href="#" id="anywhere_close_btn">close</a></div>';
					body[ac](strg.bg=bg=dv.firstElementChild);
					d.getElementById('anywhere_close_btn').onclick=function(e){e=e||w.e;e.preventDefault();close()}
				}

				bg.style.display='block';
				wh=bg.offsetHeight;
				ww=bg.offsetWidth;
				if(ww&&ww>0&&WIDTH>ww){HEIGHT=ww/WIDTH*HEIGHT;WIDTH=ww}
				t=Math.max(Math.ceil((wh-HEIGHT)/2),20)+Math.max(body.scrollTop,de.scrollTop);
				if(!(ifr=strg.ifr)){
					if (w.innerHeight < HEIGHT) {
						dv.innerHTML='<iframe src="about:blank" frameborder="0" style="position:absolute;border:0;left:50%;top:'+t+'px;width:'+WIDTH+'px;height:'+HEIGHT+'px;margin:0 0 0 -'+Math.floor(WIDTH/2+1)+'px;z-index:1000;border-radius:5px;box-shadow:inset 0 0 0 1px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.6);"></iframe>';
					}else{
						dv.innerHTML='<iframe src="about:blank" frameborder="0" style="position:fixed;border:0;left:50%;top:50%;width:'+WIDTH+'px;height:'+HEIGHT+'px;margin:-'+Math.floor(HEIGHT/2+1)+'px 0 0 -'+Math.floor(WIDTH/2+1)+'px;z-index:1000;border-radius:5px;box-shadow:inset 0 0 0 1px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.6);"></iframe>';
					}
					body[ac](strg.ifr=ifr=dv.firstElementChild);
				}
				if (w.innerHeight > HEIGHT) {
				body.style.overflow='hidden';
				}
				//ifr.style.top=t+'px';
				ifr.style.display='block';
				ifr.src=msg[1]+(msg[1].indexOf('?')>0?'&':'?')+'loc='+prtc+'//'+location.host+(args.customLogo?'&customLogo='+args.customLogo:'');
				if (w.innerHeight < HEIGHT) {
					d.getElementById('anywhere_close_btn').style.position = 'absolute';
					d.getElementById('anywhere_close_btn').style.top = t+'px';
				}else{
					d.getElementById('anywhere_close_btn').style.position = 'fixed';
					d.getElementById('anywhere_close_btn').style.top = '50%';
					d.getElementById('anywhere_close_btn').style.marginTop = -Math.floor(HEIGHT/2+1)+'px';
				}
				d.getElementById('anywhere_close_btn').style.marginLeft = Math.floor(WIDTH/2+1)-45+'px';
				break;
			case 'close':close();break;
			case 'send_anywhere_ga_client_id':
				if(args.ga!=='true'||typeof(ga)==='undefined'||!/^https?:\/\/(m\.)?fancy\.com$/.test(e.origin))return;
				ga(function(tracker){var data={tid:tracker.get('trackingId'),cid:tracker.get('clientId')};e.source.postMessage(JSON.stringify(data,origin))});
				break;
		}
	}
})(window,document,'attachEvent','addEventListener','readyState','getAttribute','setAttribute','appendChild','parentNode','readyState');
