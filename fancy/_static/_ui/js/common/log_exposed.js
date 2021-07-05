
LogExposed = {
	platform : window.log_platform||"web",
	from : "",
	_sent : {},
	data : {},
	isSending: false,
    errorCount: 0,
	addLog : function(ids, from){
		if(!from) from = this.from;
		if(!from) return;
		if(!this._sent[from]) this._sent[from] = [];
		if(!this.data[from]) this.data[from] = [];
		if(!(ids instanceof Array)) ids = [ids];
		for(var i=0; i<ids.length; i++){
			if(this._sent[from].indexOf(ids[i])==-1
					&& this.data[from].indexOf(ids[i])==-1){
				this.data[from].push(ids[i]);
			}
		}
	}, 
	clear: function(){
		for( k in this.data){
			this._sent[k] = this._sent[k].concat( this.data[k] );
		}
		this.data = {};
	},
	send: function(){
		var self = this;
		if(this.isSending) return;
		var data = [];
		for( k in this.data){
			if(this.data[k].length)
				data.push({from:k, id: this.data[k]});
		}
		if(!data.length) return;
		this.isSending = true;
		
		var params = {
			platform : this.platform,
			data : data
		}
		$.ajax({
			type : 'post',
			url  : '/rest-api/v1/log/exposed',
			contentType: "application/json; charset=utf-8",
        	dataType   : "json",
			data : JSON.stringify(params),
			success: function(){
				self.clear();
			},
            error: function() {
                self.errorCount += 1;
                if(self.errorCount>=3) {
                    self.errorCount = 0;
                    self.clear();
                }
            },
			complete: function(){
				self.isSending = false;
			}
		});
	},
	autolog: function(){
		var self = this;
		if(typeof $ == 'undefined') return;
		var $el = $("[data-expose-id]");
		if( $.fn.isInViewport ){
			$el = $el.filter(":in-viewport");
		}
		$el.each(function(){
			var id = $(this).attr('data-expose-id'), from = $(this).attr('data-expose-from');
			$(this).removeAttr('data-expose-id').removeAttr('data-expose-from');
			self.addLog([id], from);
		})
		self.send();
	},
	start: function(interval){
		var self = this;
		setInterval(function(){
			self.autolog();
		}, interval||3000);
	}
}

LogExposed.start();
