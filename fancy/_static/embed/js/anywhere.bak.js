(function(){
	var d=document,s=d.getElementById('fancy-anywhere');

	if(!d) return setTimeout(arguments.callee, 10);
	if(!s || s.getAttribute('done')) return;

	s.setAttribute('done', true);
	
	var src=s.getAttribute('src'),hst=/^https?:\/\/([^\/]+)/i.exec(src)[1],prtc=location.protocol,args={},srv=prtc+'//'+hst;

	src.replace(/^.+?\?/, '').replace(/(\w+)=([^&]+)/g,function($0,$1,$2){args[$1]=$2});

	// cache image resources
	(new Image).src = srv+'/embed/images/icon.png';
	(new Image).src = srv+'/embed/images/logo.png';
	(new Image).src = srv+'/embed/images/logo-big.png';
	(new Image).src = srv+'/_ui/images/common/jquery.inputnumber-arrow.gif';

    var type = typeof(fancy_anywhere_type) != "undefined" ? fancy_anywhere_type : "layer";
    var pos = typeof(fancy_anywhere_pos) != "undefined" ? fancy_anywhere_pos : "RB";
	
    function ready(){
        var alignHor = 'left:auto;right:12px;'; // default : Right
        if (pos.indexOf("L") != -1) {
            alignHor = 'left:12px;right:auto;';
        } else if (pos.indexOf("C") != -1) {
            alignHor = 'left:50%;right:auto;margin-left:-83px;';
        }
        
        var alignVer = 'top:auto;bottom:29px;'; // default : Bottom
        if (pos.indexOf("T") != -1) {
            alignVer = 'top:29px;bottom:auto;';
        } else if (pos.indexOf("M") != -1) {
            alignVer = 'top:50%;bottom:auto;margin-top:-19px;';
        }
		
        var i,c,im,id,ids=[],mp={},ii=0,re=/(?:^|\b)fancy-id-(\d+)(?:\b|$)/,dv=d.createElement('div'),sp,bt,sc,cb='__fancy_anywhere_'+Math.ceil(Math.random()*999),w;

		for(i=0,c=d.images.length;i<c;i++){
			im=d.images[i];
			if(!re.test(im.className))continue;
			id=RegExp.$1;
			dv.innerHTML='<span class="fancy-image-container" style="position:relative;display:inline-block;max-width:100%;padding:0;margin:0;top:0;left:0;right:auto;bottom:auto"><iframe src="'+srv+'/embed/button?id='+id+'&loc='+prtc+'//'+location.host+(args.ref?'&ref='+args.ref:'')+'&type='+type+'" width="167" height="38" frameborder="0" allowtransparency="true" style="position:absolute;width:167px;height:38px;'+alignHor+alignVer+'border:0;display:none"></iframe></span>';
			im.parentNode.insertBefore(sp=dv.firstChild,im);
			sp.insertBefore(im,bt=sp.firstChild);
			mp[id]=bt;
			ids.push(id);
		}

		if(!ids.length) return;

		window[cb] = function(rsp){
			var v=rsp.valid;
			for(var i=0;i<v.length;i++){
				if(mp[v[i]])mp[v[i]].style.display='block';
			}
		};

		sc=d.createElement('script');
		sc.setAttribute('defer','defer');
		sc.setAttribute('async','true');
		sc.setAttribute('src', srv+'/check-sales.jsonp?id='+ids.join(',')+'&callback='+cb);
		d.getElementsByTagName('body')[0].appendChild(sc);
	};

	function addEvent(o,t,f){
		o&&o.attachEvent?o.attachEvent('on'+t,f):o.addEventListener(t,f,false);
	};

	function getCss(o,prop){
		var p1,p2;
		p1 = prop.replace(/([a-z])([A-Z])/g, function($0,$1,$2){ return $1+'-'+$2.toLowerCase() });
		p2 = prop.replace(/([a-z])\-([a-z])/g, function($0,$1,$2){ return $1+$2.toUpperCase() });
		try{ return o.currentStyle?o.currentStyle[p2]:document.defaultView.getComputedStyle(o).getPropertyCSSValue(p2).cssText; }catch(e){ };
	};


	if(d.addEventListener){
		d.addEventListener('DOMContentLoaded',ready,false);
	} else {
		(function(){ // DOMContentLoaded for IE
			if(d.readyState=='complete') return ready();
			setTimeout(arguments.callee,50);
		})();
	}

	if(window.postMessage && type == "layer"){
		var bg = null,dv=d.createElement('div'),body,ifr;

		addEvent(window, 'resize', function(event){
			if(!bg || !ifr) return;
		});

		addEvent(window, 'message', function(event){
			var msg = event.data.split('\t');
			if(!body) body = d.getElementsByTagName('body')[0];

			function close(){
				ifr.src = 'about:blank';
				ifr.style.display = 'none';
				bg.style.display = 'none';
			};

			switch(msg[0]){
				case 'open':
					if(!bg) {
						dv.innerHTML = '<link rel="stylesheet" media="all" type="text/css" href="'+srv+'/embed/css/anywhere_widget.css"><div id="anywhere_back"></div><a href="#" id="anywhere_close_btn">close</a>';
						bg = dv.lastChild;
						bg.onclick = function(event){
							var e = event||window.event;
							if((e.target||e.srcElement)==bg) close();
						};
						body.appendChild(bg);
					}
					if(!ifr) {
						dv.innerHTML = '<iframe src="about:blank" width="440" height="680" frameborder="0" style="position:fixed;border:0;left:50%;top:50%;width:440px;height:680px;margin:-350px 0 0 -220px;z-index:1000;border:5px solid #333;border-radius:6px;border-color:rgba(0,0,0,.5)"></iframe>';
						ifr = dv.firstChild;
						body.appendChild(ifr);
					}
					bg.style.display = 'block';
					ifr.style.display = 'block';
					ifr.src = msg[1]+(msg[1].indexOf('?')>0?'&':'?')+'loc='+prtc+'//'+location.host;
					break;
				case 'close':
					close();
					break;
			}
		});
	}
})();
