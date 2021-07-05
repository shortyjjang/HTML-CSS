(function () {
    function fancyit(){
        this.fancy_it_id = 'FancyButton';
        this.fancyItObj;
        this.nextUrl;
        this.countAnchor;
        this.countNum;
        this.collectCount = function (a){
            this.countNum.innerHTML =a.count;
            if (a.thing_url=='None'){    
                this.countAnchor.removeAttribute('href');
            }
            else{
                this.countAnchor.setAttribute('href', a.thing_url);    
            }
            if(a.showcount == 0){
                this.countAnchor.style.visibility="hidden"
            }
            
        }
        
        this.runthis = function () {
            
            this.fancyItObj = document.getElementById(fancyitbutton.fancy_it_id);
            this.nextUrl = this.fancyItObj.getAttribute("href");
           
            this.fancyItObj.setAttribute("href","#");
            
            if (document.addEventListener) {
                this.fancyItObj.addEventListener('click', this.fancy_it, false);
            } else if (document.attachEvent) {
                this.fancyItObj.attachEvent("onclick", this.fancy_it);
            }

            this.fancyItObj.style.display='block';
            this.fancyItObj.style.overflow='visible';
            this.fancyItObj.style.cssFloat='left';
            this.fancyItObj.style.styleFloat='left';
            this.fancyItObj.style.width='55px';
            this.fancyItObj.style.height='20px';
            this.fancyItObj.style.marginRight='1px';
            this.fancyItObj.style.font='11px Arial, sans-serif';
            this.fancyItObj.style.backgroundImage="url('https://s3.amazonaws.com/thefancy/_ui/images/fancy_it.png')";
            this.fancyItObj.style.backgroundRepeat="no-repeat";
            this.fancyItObj.style.color='#547baa';
            this.fancyItObj.style.textIndent="-9999em";
            
            this.fancyItObj.onmouseover = function() {
                var cls = this.getAttribute('class');
                if(cls != null && cls != undefined && cls != false && cls == 'fancyd')
                    this.style.backgroundPosition='0 -63px';
                else
                    this.style.backgroundPosition='0 -21px';
            }
            this.fancyItObj.onmouseout = function() {
                var cls = this.getAttribute('class');
                if(cls != null && cls != undefined && cls != false && cls == 'fancyd')
                    this.style.backgroundPosition='0 -42px';                    
                else
                    this.style.backgroundPosition='0 0';
            }
            
            this.addCountAnchor()
        };
            

        this.addCountAnchor = function ()
        {
            this.countAnchor = document.createElement('a');
            //this.countAnchor.style.visibility="hidden"
            
            this.countNum = document.createElement('strong');
            this.countNum.style.display='block';
            this.countNum.style.minWidth='20px';
            this.countNum.style.height='20px';
            this.countNum.style.paddingTop='0';
            this.countNum.style.paddingRight='2px';
            this.countNum.style.paddingBottom='0';
            this.countNum.style.paddingLeft='8px';
            this.countNum.style.textAlign='center';
            this.countNum.style.backgroundImage="url('https://s3.amazonaws.com/thefancy/_ui/images/fancy_it.png')";
            this.countNum.style.backgroundPosition='0 -84px';
            this.countNum.style.backgroundRepeat="no-repeat";
            this.countNum.style.cursor='pointer';
            this.countNum.style.lineHeight="1.7"
            this.countNum.innerHTML ='0';
            
            this.countNum.onmouseover = function() {
                this.style.backgroundPosition='0 -105px';
            }
            this.countNum.onmouseout = function() {
                this.style.backgroundPosition='0 -84px';
            }
            this.countAnchor.appendChild(this.countNum);
            
            this.countAnchor.style.display='block';
            this.countAnchor.style.textDecoration="none";
            this.countAnchor.style.overflow='visible';
            this.countAnchor.style.cssFloat='left';
            this.countAnchor.style.styleFloat='left';
            this.countAnchor.style.paddingRight='2px';
            this.countAnchor.style.font='12px/20px Arial, Helvetica, sans-serif';
            this.countAnchor.style.color='#4c515c';
            this.countAnchor.style.backgroundImage="url('https://s3.amazonaws.com/thefancy/_ui/images/fancy_it.png')";
            this.countAnchor.style.backgroundPosition='100% -126px';
            this.countAnchor.style.backgroundRepeat="no-repeat";
            this.countAnchor.setAttribute('href', '#');
            this.countAnchor.setAttribute('target', '_blank');
            
            //this.countAnchor.style.marginTop='-20px';
            //this.countAnchor.style.marginLeft='56px';
            
            this.countAnchor.onmouseover = function() {
                this.style.backgroundPosition='100% -147px';
            }
            this.countAnchor.onmouseout = function() {
                this.style.backgroundPosition='100% -126px';
            }
            
            this.fancyItObj.parentNode.insertBefore(this.countAnchor,document.getElementById('FancyButton').nextSibling);
        };
        
        this.fancy_it = function (e) {
            var t;
            if (e.target) t = e.target
            else
            t = e.srcElement
            if (t.id == fancyitbutton.fancyItObj.id) {
                //window.open(fancyitbutton.nextUrl, 'signin', 'width=470, height=450')
                
                var modal = window.open(fancyitbutton.nextUrl, 'signin', 'width=470, height=450');
                var wait  = function() {
                    setTimeout(function() {
                        if (modal == null) {
                            failure(); // When does this happen?
                            return;
                        }
                        if (modal.closed) {
                            var fancyit = document.getElementById('FancyButton');
                            fancyit.style.backgroundPosition='0 -42px';
                            fancyit.setAttribute('class', 'fancyd');
                            fancyit.setAttribute('className','fancyd');
                            fancyit.className='fancyd';
                        }
                        else {
                            wait();
                        }
                    }, 25);
                };
                wait();
                return false;
            }
            return false;
        };
        
    }
    
    fancyitbutton = new fancyit();
    fancyitbutton.runthis();
    
    if (!window.__FIB){
        window.__FIB = {};
        window.__FIB = fancyitbutton;
 
        var ___snode = document.createElement('SCRIPT'), ____hnode = document.getElementsByTagName("head")[0];
            ___snode.setAttribute("type", "text/javascript");
            ___snode.setAttribute("async", "true");
            ___snode.setAttribute("src", 'http://www.thefancy.com/fancyit/count?'+fancyitbutton.nextUrl.split('?')[1]);
        ____hnode.appendChild(___snode);
    }

}());