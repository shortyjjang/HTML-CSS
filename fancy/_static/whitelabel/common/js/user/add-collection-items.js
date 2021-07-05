$(function(){
	// add thing layer
	var AddCollectionItem = {
		$el : $(".popup.add_collection_item"),
		template : $(".popup.add_collection_item script").remove().html(),
		searchTimer: null,
		loadAjax:null,
		isLoading:false,
		init : function(){
			var self = this;
			this.$el.find(".btn-add").attr('disabled','disabled').click(function(){self.save()});
			this.$el.find(".search input:text").keyup(function(){
			  var q = $(this).val();
			  self.search(q);
			});
			this.$el.find("ul").delegate('a','click',function(e){
				e.preventDefault();
				$(this).closest("li").toggleClass("selected");
				
				if(!self.$el.find("li.selected").length){
					self.$el.find(".btn-add").attr('disabled','disabled');
				}else{
					self.$el.find(".btn-add").removeAttr('disabled');
				}
			});
			this.$el.find("ul").scroll(function(e){
				var $list = self.$el.find("ul");
				var scrollTop = $list.scrollTop();
				var scrollHeight = $list[0].scrollHeight;
				if(scrollTop > scrollHeight - $list.height() - 100 ){
					self.load();
				}
			});
		},    
		open : function(username, collection_id){
			this.username = username;
			this.collection_id = collection_id;
			this.$el.find(".search input:text").val('');
			this.loadRecentFancyd();
			$.dialog('add_collection_item').open();
		},
		loadRecentFancyd: function(){
			this.$el.find("ul > li:not(.selected)").remove();
			this.$el.find("ul").addClass("loading");
			this.url = "/"+this.username+"/fancyd.json"
			this.load();
		},
		search: function(q){
			var self = this;
			if(this.searchTimer) clearTimeout(this.searchTimer);
			this.searchTimer = setTimeout(function(){
				if(!q){
					self.loadRecentFancyd();
					return;
				}
				self.$el.find("ul > li:not(.selected)").remove();
				self.url = "/search.json?q="+q;
				if(self.loadAjax) self.loadAjax.abort();
				self.isLoading = false;
				self.$el.find("ul").addClass("loading");
				self.load();
			},300);     
		},
		load: function(){
			var self = this;

			if(!this.url){
				self.$el.find("ul").removeClass("loading");
				self.isLoading = false;
				return;
			}
			if(this.isLoading) return;
			if(this.loadAjax) this.loadAjax.abort();
			this.isLoading = true;

			if( !this.$el.find("ul").hasClass("loading")){
				$("<li class='loading'></li>").appendTo(this.$el.find("ul"));
			}
			this.loadAjax = $.get(this.url, function(res){
				var isFirstFancyd = (self.url == "/"+self.username+"/fancyd.json");
				if(res.sale_items) res.items = res.sale_items;
				if(res.items && res.items.length){
					$(res.items).each(function(){
						self.addItem(this);
					})
					if(res.next_cursor){
						self.url = "/"+self.username+"/fancyd.json?cursor="+res.next_cursor;
					}else if(res.next_page){
						if(self.url.indexOf("&pg=") > -1){
							self.url = self.url.replace(/&pg=.*/,"&pg="+res.next_page);
						}else{
							self.url = self.url+"&pg="+res.next_page;
						}
					}else{
						self.url = null;
					}
				}else{
					if( !self.$el.find("ul li").not("loading").length ){
						var q = self.$el.find(".search input:text").val();
						if(q){
							$("<li class='empty'><p>No results found for <b>"+q+"</b>.</p></li>").appendTo(self.$el.find("ul"));
						}else if(!isFirstFancyd){
							$("<li class='empty'><p>No results found any items.</p></li>").appendTo(self.$el.find("ul"));
						}
					}
				}

				if(isFirstFancyd && ( !res.items || res.items.length < 8) ){
					self.url = "/recommended.json";
					self.isLoading = false;
					self.load();
				}

			}).always(function(){
				self.$el.find("ul").removeClass("loading");
				self.$el.find("ul li.loading").remove();
				self.isLoading = false;
			})
		},
		addItem: function(obj){
			var $item = $(this.template);
			$item.attr("id", obj.sale_id+"")
				.find("img").css('background-image', 'url('+(obj.sale_item_images[0].thumb_image_url_310)+')').attr('alt', obj.title).attr('title', obj.title).end();
			$item.appendTo(this.$el.find("ul"));
		},
		close:function(){
			this.username = null;
			this.collection_id = null;
			$.dialog('add_collection_item').close();
		},
		save:function(){
			var that = this;
			var saleIds = Array.prototype.slice.call($("ul li.selected").map(function(){ return $(this).attr('id')}));

			console.log(saleIds);
			$.post(
				"/collection/items/"+that.collection_id+"/add",
				{ 'sale_item_ids': saleIds.join(',') },
				function(json){
					document.location.reload();
				}, "json");
			
		}
	}
	AddCollectionItem.init();

	$(document)
		.on('click', '.add-collection-item', function(e){
			e.preventDefault();
			var username = $(this).data('username');
			var collection_id = $(this).data('collection-id');
			AddCollectionItem.open(username, collection_id);
		});	
})

