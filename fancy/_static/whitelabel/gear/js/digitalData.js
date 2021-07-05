(function(){

    try{
        var digitalData = sessionStorage.getItem('digitalData') && JSON.parse(sessionStorage.getItem('digitalData'));
        if(!window.digitalData) window.digitalData = digitalData;
        else{
            for(var k in digitalData){
                var val = digitalData[k];
                if(!window.digitalData[k]){
                    window.digitalData[k] = val;
                }else if(val instanceof Array){
                    for(var i=0; i<val.length; i++) window.digitalData[k].push( val[i] );
                }else if(val instanceof Object){
                    for(var kk in val) window.digitalData[kk] = val[kk];
                }
            }
        }
    }catch(e){}
    sessionStorage.removeItem('digitalData');

    window.saveDigitalData = function(data){
        sessionStorage.setItem('digitalData', JSON.stringify(data));
    }
})();