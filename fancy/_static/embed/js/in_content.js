(function(w,d,ae,ael,r,ga,sa,ac){
	var s=d.getElementById('fancy-anywhere-context'),strg,a=arguments,src,hst,loc,prtc,args={},srv,selector,frequency,max,hover;
	if(!s)return setTiemout(function(){a.callee.apply(w,a)},10);
	if(!(w.XMLHttpRequest&&w.JSON&&d.querySelectorAll&&d.createTreeWalker))return log('Your browser dose not support Fancy Anywhere-in-Content.');
	if(!(strg=w.__fancy_anywhere__))strg=w.__fancy_anywhere__={};
	// call ready() when the document is ready.
	var added=false;
	(function(){
		if(d[r]==='interactive'||d[r]==='complete')return ready();
		if(d[ael]&&!added)return(added=true)&&d[ael]('DOMContentLoaded',ready,false);
		setTimeout(arguments.callee,50);
	})();

	function ready() {
		var selector=s[ga]('data-selector');
		if (!selector) return log('Please set data-selector attribute for #fancy-anywhere-context.');

		src=s[ga]('src');hst=/^(?:https?:)?\/\/([^\/]+)/i.exec(src)[1];loc=w.location;prtc='https:';srv=prtc+'//'+hst;frequency=s[ga]('data-frequency');max=s[ga]('data-max');hover=(s[ga]('data-hover')==='true');

		var contextNodes=[],texts=[];
		contextNodes = [].concat.apply([], d.querySelectorAll(selector));
		contextNodes.forEach(function(node){
			texts.push(node.innerText||node.textContent);
		});

		w[ael]('message',onMessage,false);

		var xhr = new XMLHttpRequest(),data=[];
		xhr.open('POST', prtc+'//fancy.com/embed/contextual-keywords.json');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if(xhr.status!=200)return;
			var res=JSON.parse(xhr.responseText);
			if (res.success) replaceWords(contextNodes, res.keywords, res.aliases||{});
			loadScript(srv+'/anywhere.js');
		};
		data.push('text='+encodeURIComponent(texts.join('')));
		if(max)data.push('size='+max);
		xhr.send(data.join('&'));
	}

	function replaceWords(contextNodes,keywords,aliases){
		var regex = new RegExp('\\b('+keywords.join('|')+')\\b','gi'),fragment,result,linkedKeyword={};
		contextNodes.forEach(function(node){
			var walker=d.createTreeWalker(node,NodeFilter.SHOW_TEXT,null,false),textNode,text,link,keyword;
			while(textNode=walker.nextNode()) {
				if(isChildOf('A',textNode,node)) continue;
				fragment=d.createDocumentFragment();
				textNode.nodeValue.split(regex).forEach(function(txt,idx){
					if (!txt.length) return;
					if (idx % 2) {
						var keyword = aliases[txt]||txt;
						if(frequency==='once' && linkedKeyword[keyword]){
							fragment[ac](d.createTextNode(txt));
						}else{
							var link = d.createElement('A');
							link[sa]('href', 'https://fancy.com/search?q='+encodeURIComponent(keyword));
							link[ac](d.createTextNode(txt));
							link[sa]('data-fancy-keywords', keyword);
							link.className = 'fancy-anywhere-text';
							fragment[ac](link);

							if(hover){
								link.onmouseover = mouseover;
								link.onmouseout = mouseout;
							}

							linkedKeyword[keyword] = true;
						}
					} else {
						fragment[ac](d.createTextNode(txt));
					}
				});
				textNode.parentNode.insertBefore(fragment, textNode);
				textNode.nodeValue = '';
			}
		});

		function isChildOf(tag,node,context){
			tag = tag.toUpperCase();
			while(node=node.parentNode&&node!==context){
				if(node.nodeName === tag)return true;
			}
			return false;
		}
	}

	function mouseover(e){
		var card,src,de='documentElement',cw='clientWidth',ch='clientHeight',view={w:Math.max(d.body[cw],d[de][cw]),h:Math.max(d.body[ch],d[de][ch])};
		e = normalizeEvent(e||w.event);
		if(!(card=strg.hoverCard)){
			strg.hoverCard = card = d.createElement('div');
			with(card.style){position='absolute';display='none'}
			card.style.zIndex='101';
			card.innerHTML = '<iframe src="about:blank" frameborder="0" scrolling="no" allowtransparency="true" style="width:184px;height:223px"></iframe>';
			card.onmouseout=function(e){e=normalizeEvent(e||w.event);var t=e.relatedTarget;if(t&&t.parentNode!==card&&t.className!=='fancy-anywhere-text')card.style.display='none'};
			d.querySelector('body')[ac](card);
		}
		src=prtc+'//'+hst+'/embed/keyword/'+encodeURIComponent(e.target[ga]('data-fancy-keywords'))+'?preview';
		strg.currentHoverTarget=e.target;
		if(card.firstChild.src===src){
			show();
		} else {
			card.firstChild.src = src;
			card.firstChild.onload = show;
		}

		function show(){
			var target=strg.currentHoverTarget,pos=offset(target),t;
			card.style.display='block';
			card.style.top = ((t=pos.top-card.offsetHeight)>9?t+1:pos.top+target.offsetHeight-1)+'px';
			card.style.left = ((pos.left+card.offsetWidth)>view.w?pos.left+target.offsetWidth-card.offsetWidth:pos.left) + 'px';
		}
	}

	function mouseout(e){
		e = normalizeEvent(e||w.event);
		var t=e.relatedTarget;
		if(t&&(t===strg.hoverCard||t===strg.hoverCard.firstChild))return;
		strg.currentHoverTarget=null;
		strg.hoverCard.firstChild.onload=null;
		strg.hoverCard.style.display='none';
	}

	function normalizeEvent(e){
		var evt={target:e.srcElement||e.target,relatedTarget:e.relatedTarget,data:e.data,originalEvent:e};
		return evt;
	}

	function offset(el){
		var pos = {left:0,top:0};
		while(el){
			pos.top += el.offsetTop;
			pos.left += el.offsetLeft;
			el = el.offsetParent;
		}
		return pos;
	}

	function loadScript(url){
		var s = d.createElement('script');
		s[sa]('async','async');
		s[sa]('src', url);
		s[sa]('id', 'fancy-anywhere');
		d.getElementsByTagName('head')[0][ac](s);
	}

	function log() {
		if(w&&w.console)console.log.apply(console,arguments);
	}

	function onMessage(e){e=e||w.event;if(!e||!e.data)return;
		if(e.data=='fancy-anywhere.clickLink'){
			var clickEvt=new MouseEvent('click',{bubbles:true,cancelable:true,view:w});
			if(strg.currentHoverTarget)strg.currentHoverTarget.dispatchEvent(clickEvt);
		}
	}
})(window,document,'attachEvent','addEventListener','readyState','getAttribute','setAttribute','appendChild');
