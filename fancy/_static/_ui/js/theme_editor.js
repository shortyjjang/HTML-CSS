jQuery(function($){
	var $taCode = $('#custom_code'),
	    $fileTpl = $('#tree-file').remove().css('display','').removeAttr('id'),
	    $pathTpl = $('#tree-path').remove().css('display','').removeAttr('id'),
	    $save = $('.file-info .btn-save'),
	    $document = $(document),
	    $history  = $('#revision-history'),
	    urlPrefix = '/merchant/themes/admin/',
	    assets = {layout:{}, template:{}, asset:{}},
	    currentAsset = {},
	    documents = {},
	    nonameIdx = 1,
	    editor,
	    dragAsset;

	editor = CodeMirror.fromTextArea($taCode[0], {
		lineNumbers : true,
		autoCloseTags : true,
		autoCloseBrackets : true,
		styleActiveLine : true,
		matchBrackets: true,
		theme : 'neo'
	});
	editor.on('drop', function(doc, event){
		event.preventDefault();		
		if(dragAsset && dragAsset.attr('data-content')){
			doc.replaceSelection(dragAsset.attr('data-content'));
			dragAsset = null;
		}		
	});
	editor.setOption('extraKeys', {
		'Ctrl-S' : function(cm){ $('._editor .btn-save').click(); },
		'Cmd-S' : function(cm){ $('._editor .btn-save').click(); }
	});
	var $custom_domain_layer = $(".custom-domain-required");

	(function(){
		editor.on('swapDoc', function(ed, oldDoc){ lineCount = 0; onChangeLineCount(ed) });
		editor.on('change', onChangeLineCount);
		editor.on('cursorActivity', onChangeCursor);

		var lineCount = 0, $resizer = $('.theme .editor .resize'), $sizer = $('.CodeMirror-sizer');

		function onChangeLineCount(ed) {
			var currentLines = ed.doc.lineCount();
			if (currentLines != lineCount) {
				$resizer.css('width', $sizer.css('margin-left'));
				lineCount = currentLines;
			}
		}
		function onChangeCursor(ed) {
			var cursor = ed.getCursor();
			$(".location .position").text("Line "+(cursor.line+1)+", Column "+(cursor.ch+1));
		}
	})();

	$('.theme .editor .location .cok').click(function(){
		$(this).closest('.dropdown').toggleClass('opened');
		return false;
	});

	$('.theme .editor .configuration .btns .btn-add').hover(function(){$(this).find('em').css('margin-left',-($(this).find('em').width()/2)+3+'px');});

	$('.btn-domain').on('click', function(event){
		var url  = $(this).data('url');
		window.location.href = url;
	});

	$('.btn-preview').on('click', function(event){
		var url = $(this).data('url');
		if (themeID) {
			url = url.replace(/\/$/,'')+'/?theme_id='+themeID;
		}
		window.open(url);
	});

	$('.asset-list input[type="text"]').keyup(function(event){
		var val = $.trim(this.value);

		$folderTree.find('.empty').hide();

		if (val) {
			$folderTree
				.find('dt, li').hide().end()
				.find('em').contents().unwrap().end().end()
				.find('dd').show().end()
				.find('a.name_:contains('+val+'), a.add')
					.filter('a.name_')
						.each(function(){
							var $this = $(this), text = $this.attr('asset');
							text = text.replace(val, '<em class="keyword">'+val+'</em>');
							$this.html(text);
						})
					.end()
				.parent('li').show().closest('dl').find('>dt').show();

			if (!$folderTree.find('dt:visible').length) {
				$folderTree.find('.empty').show().find('b').html(val);
			}
		} else {
			$folderTree
				.find('dt, li').show().end()
				.find('em').contents().unwrap().end().end()
				.find('dd').css('display','').end()
				.trigger('paint-folder');
		}
	});

	function naturalCompare(a, b) {
		var ax = [], bx = [];

		a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
		b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

		while(ax.length && bx.length) {
			var an = ax.shift();
			var bn = bx.shift();
			var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
			if(nn) return nn;
		}

		return ax.length - bx.length;
	}

	var $folderTree = $('.folder-tree');
	$folderTree
		.on('paint-folder', function(){
			$folderTree.find('a.name_[asset]:contains(/)').each(function(){
				var $this = $(this), text = $this.attr('asset');
				text = text.replace(/^.*?\//, '<em class="folder">$&</em>');
				$this.html( text );
			});
		})
		.find('[id^="tree-type-"]')
			.on('sort', function(event){
				var $folder = $(this), $names = $folder.find('> li > a.name_, > li > em > a.name_'), names = [];

				$names.each(function(i,a){  names.push({asset:a.getAttribute('asset')||a.getAttribute('path'), type:(a.getAttribute('path')?'path':'file'), node: $(a).closest('li')[0]}) });
				
				
				names.sort(function(a, b){
					if( a.type === b.type){
						return naturalCompare(a.asset.toLowerCase(), b.asset.toLowerCase());
						//return a.asset.toLowerCase() > b.asset.toLowerCase() ? 1 : -1;	
					}
					if( a.type == 'path' ) return -1;
					if( b.type == 'path' ) return 1;
				});
				$.each(names, function(i, o){ 
					$folder.append(o.node) 
					if(o.type=='path') $(o.node).find("a.name_.path").trigger('sortpath');
				});
			})
		.end()
		.on('sortpath', 'a.name_.path', function(event){
				var $folder = $(this).closest('li').find("ul"), $names = $folder.find('> li > a.name_'), names = [];

				$names.each(function(i,a){  names.push({asset:a.getAttribute('asset'), type:'file', node: $(a).closest('li')[0]}) });
				
				names.sort(function(a, b){
					return naturalCompare(a.asset.toLowerCase(), b.asset.toLowerCase());
				});
				$.each(names, function(i, o){ $folder.append(o.node) });
			})
		.end()
		.on('click', 'dt > a', function(event){
			event.preventDefault();

			$(this).closest('dl').toggleClass('opened');
		})		
		.on('click', 'a.name_', function(event){
			var $this = $(this), filename = $this.attr('asset'), path = $this.attr('path'), $tab, $li, type;

			if (event) event.preventDefault();
			if (!/\.(html|css|js|json)$/.test(filename)) return;

			$('.open-files li a[asset="'+filename+'"]').each(function(){
				var $this = $(this);
				if ($this.attr('asset') == filename) {
					$tab = $this;
				}
			});

			if (!$tab || !$tab.length) {
				type = $this.closest('dl').attr('data-type');
				$li = $('<li><a href="#" class="files">'+filename+'</a><a href="#" class="remove"></a></li>');
				$tab = $li.find('a.files').attr('asset', filename).data('type', type);

				$fileTab.append($li);
			}

			setTimeout(function(){
				$tab.trigger('click');
			}, 1);
		})
		.on('dragstart', 'a.name_', function(event){
			var $this = $(this), filename = $this.attr('asset');
			if (!/\.(png|gif|jpg|js|css)$/.test(filename)){
				dragAsset = null;
				return;
			}
			dragAsset = $(this);
		})
		.on('mouseleave', 'li:not(.add_)', function(event){
			$(this).find('small').hide();
			$document.off('mousedown.cok');
		})
		.on('click', '.cok', function(event){
			event.preventDefault();

			var self = this, $small = $(this).next('small'), $tree, $li, pos;

			if ($small.is(':visible')) {
				$small.hide();
				$document.off('mousedown.cok');
			} else {
				$tree = $('.folder-tree');
				$li = $(this).closest('li');
				pos = $li.offset().top - $tree.offset().top;

				$small.css('display','block');

				if (pos + $li.height() + $small.height() + 50 > $tree.height()) {
					$small.parent('span').removeClass('top');
				} else {
					$small.parent('span').addClass('top');
				}

				$document.on('mousedown.cok', function(event){
					var $target = $(event.target);

					if ($target.closest(self).length || $target.closest($small).length) return;

					$small.hide();
					$document.off('mousedown.cok');
				});
			}

		})
		.on('click', 'a.rename_:not(.path)', function(event){
			event.preventDefault();
			var $li = $(this).closest('li'), path = $li.find('a.name_').attr('path'), filename = $li.find('a.name_').attr('asset'), type = $li.closest('dl').attr('data-type');
			renameAsset(type, filename, path);
		})
		.on('click', 'a.delete_:not(.path)', function(event){
			event.preventDefault();
			var $li = $(this).closest('li'), filename = $li.find('a.name_').attr('asset'), type = $li.closest('dl').attr('data-type');
			deleteAsset(type, filename);
		})
		.on('click', 'a.rename_.folder', function(event){
			event.preventDefault();
			var $li = $(this).closest('li'), path = $li.find('a.name_').attr('path'), type = $li.closest('dl').attr('data-type');
			renameFolder(type, path);
		})
		.on('click', 'a.delete_.folder', function(event){
			event.preventDefault();
			var $li = $(this).closest('li'), path = $li.find('a.name_').attr('path'), type = $li.closest('dl').attr('data-type');
			deleteFolder(type, path);
		})
		.on('click', 'a.insert_', function(event){
			event.preventDefault();
			var $li = $(this).closest('li'), content = $li.find('a.name_').attr('data-content');
			editor.replaceSelection(content);
		})		
		.on('click', 'a.template_new_', function(event){
			event.preventDefault();
			var query = $('.asset-list input[type="text"]').val();
			var path = $(this).attr('path');
			createTemplate( query, path);
		})
		.on('click', 'a.upload_', function(event){
			event.preventDefault();
			var path = $(this).attr('path');
			createUpload(path);
		})
		.on('click', '.btn-setting', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($this.hasClass('v2')) {
				$('#tree-type-setting a.name_').trigger('click');
			} else {
				$('.file-editor').hide();
				$('.file-editor.configuration').show().trigger('open');
			}
		})
		.on('click', '.folder-wrap > a', function(event){
			event.preventDefault();

			$(this).closest('li')
				.find('a.name_').toggleClass('show').end()
				.find('ul').toggle();
		})
		.on('update', 'a[asset]', function(event){
			event.preventDefault();
			var filename = $(this).attr('asset'), path = $(this).attr('path')||'', doc = documents[filename], name=filename.replace(path+'/','');
			if(doc.isChanged()){
				$(this).text(name+" *");
			}else{
				$(this).text(name);
			}
			
		})

	if (location.hash == '#settings') {
		$('.folder-tree .btn-setting').click();
	}

	(function(){
		var $splitter = $('.editor-container .v-splitter'), x, start, leftWidth, rightWidth;
		$splitter
			.css('left', $splitter.next('.file-editor')[0].offsetLeft - $splitter.width()/2)
			.on('mousedown', function(event){
				event.preventDefault();

				x = event.pageX;
				start = this.offsetLeft;
				leftWidth  = $splitter.prev().width();
				rightWidth = $splitter.next().width();

				$('body').css('cursor', $splitter.css('cursor'));

				$document
					.on('mousemove.splitter', function(event){
						var diff = event.pageX - x;

						if (start + diff < 150) diff = 150 - start;
						if (rightWidth - diff < 400) diff = rightWidth - 400;

						$splitter
							.css('left', start + diff)
							.prev().css('width', leftWidth + diff).end()
							.next().css('width', rightWidth - diff).end();
					})
					.on('mouseup.splitter', function(event){
						$('body').css('cursor', '');
						$document.off('.splitter');
					});
			});
	})();

	var $fileTab = $('#file-tab');
	$fileTab
		.on('update', function(event){
			var $tabs  = $fileTab.children('li'),
		 	    $first = $tabs.eq(0),
			    $current = $tabs.filter('.current'),
			    hiddenTabs = [],
			    left = Math.abs( ($first[0] && $first[0].offsetLeft) || 0 ),
			    width = $fileTab.width(),
				newLeft = -left;

			$fileDrop.empty().parent().hide().removeClass('opened');

			if (!$first.length) return;

			// if $current doesn't exist in view port,
			// scroll first tab to show $current in view port
			if ($current[0].offsetLeft < 0) {
				newLeft -= $current[0].offsetLeft;
			} else if ($current[0].offsetLeft + $current[0].offsetWidth + left > width) {
				newLeft -= ($current[0].offsetLeft + $current[0].offsetWidth - width);
			}

			newLeft = Math.min(newLeft, 0);
			if (newLeft != left) $first.css('margin-left', newLeft);

			// get hidden tabs
			$tabs.each(function(){
				var tabLeft = this.offsetLeft + left, $this = $(this), filename = $this.find("a.files").attr('asset'), doc;
				if ((-newLeft > tabLeft) || (width - newLeft < tabLeft + this.offsetWidth)) {
					$fileDrop.append( $(this).clone().removeAttr('style').removeAttr('class') ).parent().show();
				}
				doc = documents[filename];
				if(doc.isChanged()){
					$this.find("a.files").html(filename+" *");
				}else{
					$this.find("a.files").html(filename);
				}
			});
		})
		.on('click', 'a.files', function(event){
			event.preventDefault();

			var $this = $(this), filename, doc, ext, mode, query, type, oldDoc;

			$this.addClass('current').siblings().removeClass('current');
			$fileDrop.parent().removeClass('opened');

			filename = $this.attr('asset');
			doc = documents[filename];
			oldDoc = editor.getDoc();

			if (!doc) {
				if (ext = filename.match(/\.(\w+)$/)) ext = ext[1];

				type = $this.data('type');
				query = 'theme_id='+themeID+'&type='+type+'&name='+filename;
				if (ext == 'html' || ext == 'css' || ext == 'js') {
					query += '.template';
				}

				$.ajax({
					type : 'GET',
					url  : expand_url_params(urlPrefix + 'get_asset_content.json'),
					data : query,
					dataType : 'json',
					success : function(json) {
						if (!json || !json.status_code) return;

						var content = json.content || '';
						if (content) content = $('<textarea>').html( content ).val();
						createDoc(content, filename, type, json.removable).activate();
					}
				});
			} else {
				doc.activate();
			}
		})
		.on('click', 'a.remove', function(event){
			event.preventDefault();
			editor.getDoc().close();
		});

	var $fileDrop = $('#file-dropdown');
	$fileDrop
		.on('click', 'a.files', function(event){
			event.preventDefault();
			$fileTab.find('a.files[asset="' + $(this).attr('asset') + '"]').click();
		})
		.prev('a')
			.click(function(event){
				event.preventDefault();

				if ($fileDrop.children('li').length > 0) {
					$fileDrop.parent().toggleClass('opened');
				} else {
					$fileDrop.parent().removeClass('opened');
				}
			})
		.end();

	$('.file-editor._editor')
		.on('click', 'a.open', function(event){
			event.preventDefault();
			$(this).parent().toggleClass('opened');
		})
		.on('click', '.btn-save', function(event){
			var $btn = $(this).prop('disabled', true);
			editor.getDoc().save();
		})
		.on('click', '.btn-rename', function(event){
			editor.getDoc().rename();
		})
		.on('click', '.btn-delete', function(event){
			editor.getDoc().delete();
		})
		.on('click', '.btn-revert', function(event){
			var content = editor.getDoc().getValue();
			editor.getDoc().loadRevision(0);
			editor.getDoc().setValue(content);
		})
		.on('click', '.btn-cancel', function(event){
			editor.getDoc().loadRevision(0);
		})
		.on('click', 'a.resize', function(event){
			event.preventDefault();

			var $container = $(this).closest('.editor-container')

			$container
				.children('.asset-list, ._editor').removeAttr('style').end()
				.children('.v-splitter').hide().end()
				.toggleClass('full');

			if (!$container.hasClass('full')) {
				$container.children('.v-splitter').show().css('left', $container.children('.asset-list').width() - 4);
			}
		})
		.on('click', '.history a', function(event){
			event.preventDefault();

			var $this = $(this), rev = +$this.attr('data-revision') || 0;

			$('h4.file-name a.current').click();

			// ignore when the revision is already selected.
			if ($this.hasClass('selected')) return;

			editor.getDoc().loadRevision(rev);
		});

	$('#file_rename')
		.on('renameFile', function(){
			var $btn = $(this).find('.btns-blue-embo').prop('disabled', true),
			    $dialog = $('#file_rename'),
			    deferred = $dialog.data('deferred'),
			    filename = $dialog.data('filename'),
			    path = $dialog.data('path'),
			    fullNewName = $dialog.find('input[type="text"]').val(),
			    fullFilename = (path?(path+'/'+filename):filename),
			    newPath, newName,
			    type = $dialog.data('type');

			newPath = fullNewName.split("/");
			newName = newPath.pop();
			newPath = newPath.join("/");

			$.ajax({
				type : 'PUT',
				url  : expand_url_params(urlPrefix + 'rename_asset.json'),
				data : {type : type, 
						theme_id : themeID,
						name : assetName(fullFilename), 
						to : assetName(fullNewName)},
				dataType : 'json',
				success : function(json) {
					if (!json || !json.status_code) {
						if (json.message) alert(json.message);
						if (deferred) deferred.reject();
						return;
					}

					if (documents[fullFilename]) {
						documents[fullNewName] = documents[fullFilename];
						documents[fullNewName].filename = fullNewName;
						delete documents[fullFilename];
					}

					var $folder = $('.folder-tree, .file-editor, #file-tab');
					var $fileItem = $folder.find('a[asset="'+fullFilename+'"]').text(newName).attr('asset', fullNewName).attr('path', newPath).closest("li");
					var $newFileItem = createFileItem(fullNewName, type, true);
					var $list = $fileItem.closest('ul[id^="tree-type-"]');
					var $prevpath = $list.find('.path[path="'+path+'"]').closest('li');
						
					if(newPath){
						var $path = $list.find('.path[path="'+newPath+'"]').closest('li');
						if(!$path.length){
							$path = createPathItem(newPath, type, true);
							if($prevpath[0] && $prevpath.find("a.path.name_").hasClass('show')){
								$path.find("a.path.name_").addClass('show').end().find("ul").show();
							}
							$list.append($path);
						}
						$path.find("ul").append($newFileItem);
					}else{
						$list.append($newFileItem);
					}
					$fileItem.remove();
					if(path && path!=newPath){
						if(!$prevpath.find("ul li").length){
							$prevpath.remove();
						}
					}
					$newFileItem.closest('ul[id^="tree-type-"]').trigger('sort');

					documents[fullNewName] && documents[fullNewName].showName();

					// update file tab and file dropdown
					$fileTab.trigger('update');

					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.resolve();
				},
				error : function() {
					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.reject();
				},
				complete : function() {
					$btn.prop('disabled', false);
				}
			});
		})
		.on('renameFolder', function(){
			var $btn = $(this).find('.btns-blue-embo').prop('disabled', true),
			    $dialog = $('#file_rename'),
			    deferred = $dialog.data('deferred'),
			    path = $dialog.data('path'),
			    newPath = $dialog.find('input[type="text"]').val(),
			    type = $dialog.data('type');

			$.ajax({
				type : 'PUT',
				url  : expand_url_params(urlPrefix + 'rename_folder.json'),
				data : {type : type, 
						theme_id : themeID,
						name : assetName(path), 
						to : assetName(newPath)},
				dataType : 'json',
				success : function(json) {
					if (!json || !json.status_code) {
						if (json.message) alert(json.message);
						if (deferred) deferred.reject();
						return;
					}

					var $list = $('#tree-type-'+type);
					var $prevpath = $list.find('.path[path="'+path+'"]').closest('li');
					
					$.each(json.assets, function(idx) {
						var obj = json.assets[idx], fullname = obj.name, prevFullname = obj.original_name, $file, $path, path;

						prevFullname  = prevFullname.replace(/\.(html|js|css)\.template/i, '.$1');
						fullname  = fullname.replace(/\.(html|js|css)\.template/i, '.$1');

						if (documents[prevFullname]) {
							documents[fullname] = documents[prevFullname];
							documents[fullname].filename = fullname;
							delete documents[prevFullname];
						}

						path = fullname.split("/");
						path.pop();
						path = path.join("/");

						$path = $list.find(".path[path='"+path+"']").closest('li');
						if(!$path.length){
							$path = createPathItem(path, type, true);
							if($prevpath[0] && $prevpath.find("a.path.name_").hasClass('show')){
								$path.find("a.path.name_").addClass('show').end().find("ul").show();
							}
							$list.append($path);
							$prevpath.remove();
						}

						$file = createFileItem(fullname, type, obj.removable);
						if (obj.url) {
							$file.find('[data-lightbox]')
								.attr('href', obj.url)
								.wrapInner('<span class="name"></span>')
								.append('<span class="preview-asset"><em class="zoom"></em><em class="show"><img src="'+obj.url+'" alt></em></span>');
						}

						$path.find("ul").append($file);

						documents[fullname] && documents[fullname].showName();
						$('.file-editor, #file-tab').find('a.files[asset="'+prevFullname+'"]').attr('asset',fullname).html(fullname);
					});
					

					$list.trigger('sort');

					// update file tab and file dropdown
					$fileTab.trigger('update');

					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.resolve();
				},
				error : function() {
					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.reject();
				},
				complete : function() {
					$btn.prop('disabled', false);
				}
			});
		})
		.on('click', '.btns-blue-embo', function(event){
			event.preventDefault();
			if( $('#file_rename').data('filename')=='' ){
				$('#file_rename').trigger('renameFolder');
			}else{
				$('#file_rename').trigger('renameFile');
			}		
		})
		.on('keyup', 'input[type="text"]', function(event){
			if (event.which == 13 && $.trim(this.value).length) {
				$('#file_rename .btns-blue-embo').click();
			}
		})
		.on('click', '.btns-white', function(event){
			event.preventDefault();
			var $dialog = $('#file_rename'), deferred = $dialog.data('deferred');
			if (deferred) deferred.reject();
		});

	$('#file_delete')
		.on('open', function(){
			$(this).find('.btns-red-embo').focus();
		})
		.on('deleteFile', function(){
			var $btn = $(this).find('.btns-red-embo').prop('disabled', true),
			    $dialog = $('#file_delete'),
			    deferred = $dialog.data('deferred'),
			    filename = $dialog.data('filename'),
			    path,
			    type = $dialog.data('type');

			path = filename.split("/");
			path.pop();
			path = path.join("/");

			$.ajax({
				type : 'DELETE',
				url  : expand_url_params(urlPrefix + 'delete_asset.json'),
				data : {type : type, name : assetName(filename), theme_id : themeID},
				dataType : 'json',
				success : function(json) {
					if (!json || !json.status_code) {
						if (json.message) alert(json.message);
						if (deferred) deferred.reject();
						return;
					}

					if (documents[filename]) delete documents[filename];

					var $fileItem = $('.folder-tree').find('a.name_[asset="'+filename+'"]').closest("li");
					var $list = $fileItem.closest('ul[id^="tree-type-"]');
					$fileItem.remove();
					$('.file-editor, #file-tab').find('a.files[asset="'+filename+'"]').closest('li').remove().end().end().find('a.files:first').trigger('click');
					if(path){
						var $path = $list.find('a.name_[asset="'+path+'"]').closest('li');
						if(!$path.find("ul li").length){
							$path.remove();
						}
					}

					// update file tab and file dropdown
					$fileTab.trigger('update');

					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.resolve();
				},
				error : function() {
					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.reject();
				},
				complete : function() {
					$btn.prop('disabled', false);
				}
			});
		})
		.on('deleteFolder', function(){
			var $btn = $(this).find('.btns-red-embo').prop('disabled', true),
			    $dialog = $('#file_delete'),
			    deferred = $dialog.data('deferred'),
			    path = $dialog.data('path'),
			    type = $dialog.data('type');

			$.ajax({
				type : 'DELETE',
				url  : expand_url_params(urlPrefix + 'delete_folder.json'),
				data : {type : type, name : assetName(path), theme_id : themeID},
				dataType : 'json',
				success : function(json) {
					if (!json || !json.status_code) {
						if (json.message) alert(json.message);
						if (deferred) deferred.reject();
						return;
					}

					var $list = $('#tree-type-'+type);
					var $path = $list.find('.path[path="'+path+'"]').closest('li')

					$path.find("a.name_[asset]").each(function(){
						var filename = $(this).attr('asset');
						if (documents[filename]) delete documents[filename];
						$('.file-editor, #file-tab').find('a.files[asset="'+filename+'"]').closest('li').remove().end().end().find('a.files:first').trigger('click');
					})
					$path.remove();

					// update file tab and file dropdown
					$fileTab.trigger('update');

					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.resolve();

					// update file tab and file dropdown
					$fileTab.trigger('update');

					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.resolve();
				},
				error : function() {
					$dialog.find('.popup_close:first').trigger('click');
					if (deferred) deferred.reject();
				},
				complete : function() {
					$btn.prop('disabled', false);
				}
			});
		})
		.on('click', '.btns-red-embo', function(event){
			event.preventDefault();
			if( $('#file_delete').data('filename')=='' ){
				$('#file_delete').trigger('deleteFolder');
			}else{
				$('#file_delete').trigger('deleteFile');
			}		
			
		})
		.on('click', '.btns-white', function(event){
			event.preventDefault();
			var $dialog = $('#file_delete'), deferred = $dialog.data('deferred');
			if (deferred) deferred.reject();
		});



	$('#template_new')
		.on('click', '.btns-blue-embo', function(event){
			event.preventDefault();

			var $btn = $(this).prop('disabled', true),
			    $dialog = $('#template_new'),
			    name = $dialog.find('input[type="text"][name="template"]').val();
			    path = $dialog.find('select[name="path"]').val();

			var $file, filename, $path, doc, files = {}, $subtree = $('#tree-type-template'), nonameIdx = 1;

			if(name.indexOf('/')){
				var name_array = name.split('/');
				name = name_array.pop();
				if(name_array.length>0){
					path = path + (path?'/':'') + name_array.join('/');
				}
			}

			filename = (path?(path+'/'+name):name) + '.html'
			if( $subtree.find('a.name_[asset="'+filename+'"]').length ){
				do { filename = (path?(path+'/'+name):name) + (nonameIdx++) + '.html' } while ( $subtree.find('a.name_[asset="'+filename+'"]').length );
			}

			doc = createDoc('', filename, 'template', true);
			doc.setValue('<!-- Your template code here. -->\n');
			doc.save();

			if(path){
				$path = $subtree.find(".path[path='"+path+"']").closest('li');
				if(!$path.length){
					$path = createPathItem(path, 'template', true);
					$subtree.append($path);
				}
				$path.find("a.path.name_").addClass('show').end().find("ul").show();
			}

			$file = createFileItem(filename, 'template', true);
			if(path){
				$path.find("ul").append($file);
			}else{
				$subtree.append($file);
			}
			
			$folderTree.trigger('paint-folder');

			// sort file tree
			$subtree.trigger('sort');

			$dialog.find('.popup_close:first').trigger('click');
			var query = $('.asset-list input[type="text"]').val();
			if(query)
				$('.asset-list input[type="text"]').val(name).trigger("keyup");

			$btn.prop('disabled', false);
		})
		.on('keyup', 'input[type="text"]', function(event){
			if (event.which == 13 && $.trim(this.value).length) {
				$('#template_new .btns-blue-embo').click();
			}
		})
		.on('click', '.btns-white', function(event){
			event.preventDefault();
			var $dialog = $('#template_new'), deferred = $dialog.data('deferred');
			if (deferred) deferred.reject();
		})
		.on('click', '.new_folder_', function(event){
			event.preventDefault();
			var deferred = $.Deferred(), $dialog = $('#add_folder');
			$dialog
				.data('path', $('#template_new').find("select[name=path]"))
				.data('deferred', deferred);

			setTimeout(function(){
				$('#add_folder')
				.find('fieldset input[type="text"]').select().focus();
			},200);

			return deferred;
		})

	$('#add_folder')
		.on('click', '.btns-blue-embo', function(event){
			event.preventDefault();
			var $btn = $(this),
				$dialog = $btn.closest('.popup'),
				name = $dialog.find("input:text").val(),
				$pathSelect = $dialog.data('path');
			
			if( $pathSelect.find('option[value="'+name+'"]').length ){
				alertify.alert(name+" already exists!");
				return;
			}

			$('<option value="'+name+'">'+name+'/</option>').appendTo($pathSelect);
			$pathSelect.val(name);
			$("#popup_container").trigger('open.popup', [$($pathSelect.closest('.popup'))] );
		})
		.on('keyup', 'input[type="text"]', function(event){
			if (event.which == 13 && $.trim(this.value).length) {
				$('#add_folder .btns-blue-embo').click();
			}
		})
		.on('click', '.btns-gray-embo', function(event){
			event.preventDefault();
			var $dialog = $('#add_folder'), deferred = $dialog.data('deferred');
			if (deferred) deferred.reject();
		});

	(function(){
		var $dialog = $('.file-editor.configuration'), $tbody, $tpl;

		$tbody = $dialog.find('tbody');
		$tpl = $dialog.find('tr.new_').remove();

		$dialog
			.on('open', function(){
				$dialog
					.find('tr').css('display','').end()
					.find('tr.new_').remove().end()
					.find('tr.removed_').css('display','').removeClass('removed_').end()
					.find('.btn-add').show()
					.find('.btn-save').prop('disabled', true);
			})
			.on('validate', function(){
				$dialog.find('.btn-save').prop('disabled', !!$dialog.find('tr.error').length);
			})
			.on('keyup', 'input[name="search"]', function(event) {
				var v = $.trim(this.value)||'', $input;

				$input = $dialog.find('input[type="text"]');

				if (v.length) {
					$input.closest('tr').hide();
					$input.filter(function(){ return (this.value||'') .toLowerCase().indexOf(v.toLowerCase()) >= 0 }).closest('tr').css('display','');
				} else {
					$input.closest('tr').css('display','').end()
				}
			})
			.on('keyup paste blur change', 'input, select', function(event){
				$dialog.trigger('validate');
			})
			.on('keyup', 'input[name="key"]', function(event) {
				var v = $.trim(this.value), $this = $(this), $keys;

				if (!v.length) {
					$this.next('p').text('Enter Variable Name.').closest('tr').addClass('error');
				} else {
					$keys = $dialog.find('input[name="key"]').filter(function(){ return this.value == v; });
					if ($keys.length > 1) {
						$this.next('p').text('This name is already in use.').closest('tr').addClass('error');
					} else {
						$this.closest('tr').removeClass('error');
					}
				}
				$dialog.trigger('validate');
			})
			.on('click', '.remove_', function(event){
				event.preventDefault();
				if( confirm("Are you sure?")){
					$(this).closest('tr').addClass('removed_').hide();
					$dialog.trigger('validate');
				}				
			})
			.on('click', '.add_', function(event){
				event.preventDefault();
				$tpl.clone().appendTo($tbody);
			})
			.on('click', '.btn-save', function(event){
				event.preventDefault();

				var $btn = $(this), $tr = $dialog.find('tbody > tr'), json = [], keys = {};

				// get settings
				$tr.not('.removed_').each(function(idx, row){
					var data = {};
					$(row).find('input[name],select[name]').each(function(idx, elem){
						var val = $.trim(elem.value);
						if (val.length) data[elem.name] = val;
					});
					if (data.name && data.key && data.type && !keys[data.key]) {
						keys[data.key] = true;
						json.push(data);
					}
				});

				json = JSON.stringify(json) || '';

				$btn.prop('disabled', true);
				$.ajax({
					type : 'POST',
					url  : expand_url_params(urlPrefix + 'update_setting_options.json'),
					data : {json : json, theme_id : themeID},
					dataType : 'json',
					success : function(json){
						if (!json.status_code) {
							if (json.message) alert(json.message);
							return;
						}

						$tr.removeClass('new_').filter('.removed_').remove();
						$dialog.find('.popup_close').click();
					},
					complete : function(){
						$btn.prop('disabled', false);
					}
				});
			})
	})();

	// asset uploader
	(function(){
		var $drop = $('#add_file'), $tbody, $tpl, handlers, url = expand_url_params('/merchant/themes/admin/upload_asset.json');
		var $upload = $('#uploading_file'), $fileTpl = $upload.find('tr.template').remove().removeClass('template_'), $gauge;

		handlers = {
			upload : function(event) {
				var $tb = $upload.find('tbody').empty(), uploader = event.uploader, path = $("#add_file").find("[name=path]").val();
				for (var i = 0; i < uploader.files.length; i++) {
					$fileTpl.clone()
						.find('.index_').text(i+1).end()
						.find('.file_').text( (path?(path+'/'):'')+ (uploader.files[i].name || uploader.files[i].filename)).end()
						.find('.size_').text( sizeStr(uploader.files[i].size) ).end()
						.find('.progress_').html('<span class="progress"><i class="gauge" style="width:1%"></i></span>').end()
						.appendTo($tb);
				}
				$gauge = $tb.find('.gauge');
				$('#popup_container').trigger('open.popup', [$upload]);

				event.uploader.formData.append('path', path || '');
				event.uploader.formData.append('type', 'asset');
				event.uploader.formData.append('theme_id', themeID);
			},
			progress : function(event) {
				$gauge.width( event.percent );
			},
			complete : function(event) {
				$gauge.parent().replaceWith('Done');
				drawAssetTree();
			}
		};

		function sizeStr(num) {
			var units = ['B', 'KB', 'MB', 'GB'], i = 0;

			while (num >= 1024) {
				if (++i > units.length - 1) break; 
				num /= 1024;
			}

			return num.toFixed(1) + ' ' + units[i];
		};

		$drop.uploader({url:url, dragndrop:true}).on(handlers);
		$drop.find('.uploader .btns-gray-embo').uploader({url:url}).on(handlers);
		$drop
			.on('click', '.new_folder_', function(event){
				event.preventDefault();
				var deferred = $.Deferred(), $dialog = $('#add_folder');
				$dialog
					.data('path', $('#add_file').find("select[name=path]"))
					.data('deferred', deferred);

				setTimeout(function(){
					$('#add_folder')
					.find('fieldset input[type="text"]').select().focus();
				},200);

				return deferred;
			})
	})();

	var docExtension = {
		revisions : [],
		activate : function() {
			editor.swapDoc(this);
			editor.focus();

			this.showName();

			// hide configuration tab
			$('.file-editor._editor').removeClass('empty').show();$('.file-editor.configuration').hide();

			// select current revision
			this.selectRevision(0);
			this.loadRevisionList();

			$('.file-info')
				.find('.btns')[this.removable ? 'removeClass' : 'addClass']('norename')
				.find('.btn-save').prop('disabled', !this.isChanged()).end();

			// hide empty message
			$(".file-editor .templates .empty").hide();
			$custom_domain_layer.show();

			// show focus in the asset broowser
			$('.folder-tree')
				.find('li').removeClass('hover').end()
				.find('a.name_[asset="'+this.filename+'"]').parent().addClass('hover');

			// select tab
			var $current = this.$elem().has('.current').has('a.files').addClass('current');

			// remove .current class from other tabs.
			$current.siblings().removeClass('current');

			// update file tab and file dropdown
			$fileTab.trigger('update');
		},
		isChanged : function() {
			return this.getValue() != this.prevText;
		},
		isActive : function() {
			return editor.doc === this;
		},
		save : function(forPreview) {
			if (!this.isChanged()) return;

			var self = this;
			var params = {
				type : this.type,
				name : this.filename + ((this.type == 'setting') ? '':'.template'),
				content : this.getValue(),
				theme_id : themeID
			};

			$.ajax({
				type : 'POST',
				url  : expand_url_params(urlPrefix + 'save_asset.json'),
				data : params,
				dataType : 'json',
				success  : function(json) {
					if (!json) return;
					if (!json.status_code) {
						if (json.message) alert(json.message);
						return;
					}
					self.prevText = params.content;
					documents[self.filename].showName();
					$fileTab.trigger('update');
					var $folder = $('.folder-tree, .file-editor, #file-tab');
					$folder.find('a[asset="'+self.filename+'"]').trigger('update');
					self.loadRevisionList();
				}
			});
		},
		rename : function(newName) {
			var doc = this, deferred;

			if (this.processing) return;
			this.processing = true;

			renameAsset(this.type, this.filename);
		},
		showName : function() {
			if (this.isActive()) {
				var name = this.filename.replace(/(\.\w+)$/, '<small>$1</small>');
				if(this.isChanged()){
					name += " *";
				}
				$('.file-name a.current').html( name );
			}
		},
		delete : function() {
			var doc = this, deferred;

			if (this.processing) return;
			this.processing = true;

			deferred = deleteAsset(this.type, this.filename);
			deferred.done(function(){
				delete documents[doc.filename];
				doc.isChanged = function(){ return false };
				doc.close();
			});
		},
		close : function() {
			var that = this;

			function closeTab(){
				that.setValue(that.prevText);

				var $elem = that.$elem(), $another = $elem.eq(0).next();
				if (!$another.length) $another = $elem.eq(0).prev();

				$elem.remove();
				$('h4.file-name').find('.current').empty().next('.history').children(':gt(0)').remove();
				editor.swapDoc(new CodeMirror.Doc('', 'null'));

				$another.find('a.files').trigger('click');

				// show empty message if there in no more open file
				if( !$another.length){
					$('.file-editor._editor').addClass('empty');
					$custom_domain_layer.hide();
				}

			}
			if (this.isChanged()) {
				alertify.confirm("Your changes will be lost.<br/>Are you sure?", function (e) {
				    if (e) {
					    closeTab();
				    }
				});
			}else{
				closeTab();
			}
			
		},
		$elem : function() {
			return $('.open-files a.files[asset="'+this.filename+'"]').closest('li');
		},
		loadRevisionList : function() {
			var doc = this, rev = this.getActiveRevision();

			$history.children(':not(:first-child)').remove().end();

			$.ajax({
				type : 'GET',
				url  : expand_url_params(urlPrefix + 'asset_revisions.json'),
				data : {theme_id: themeID, name: this.filename+'.template', type: this.type},
				dataType : 'json',
				success : function(data) {
					if (!data || !data.status_code) return;

					var revision, txt, date, today = new Date(), hh, mm;
					for (var i = 0; i < data.revisions.length; i++) {
						revision = data.revisions[i];
						date = new Date(Date.parse(revision.date));

						if (date.toDateString() === today.toDateString()) {
							txt = 'Today';
						} else {
							txt = date.toDateString().replace(/^\w+ /,''); // remove weekday part
						}

						hh = date.getHours();
						if (hh < 10) hh = '0' + hh;

						mm = date.getMinutes();
						if (mm < 10) mm = '0' + mm;

						txt += ' ' + hh + ':' + mm;

						$history.append('<a href="#" data-revision="'+revision.rev+'">'+txt+'</a>');
					}

					doc.selectRevision(rev);
				}
			});
		},
		loadRevision : function(rev) {
			var activeRevision = this.getActiveRevision(), doc = this, $btns, $revertBtns;

			if (activeRevision === rev) return;

			this.selectRevision(rev);
			$btns = $('.file-editor .btns button')

			if (rev === 0) {
				this.setValue(this.currentContent);
				editor.setOption('readOnly', false);
				return;
			}

			if (activeRevision === 0) {
				this.currentContent = this.getValue();
			}

			editor.setOption('readOnly', true);
			doc.setValue('Loading...');
			$revertBtns = $btns.filter('.btn-revert, .btn-cancel').show().prop('disabled', true);

			$.ajax({
				type : 'GET',
				url  : expand_url_params(urlPrefix + 'get_asset_content.json'),
				data : {theme_id: themeID, name: this.filename+'.template', type: this.type, rev: rev},
				dataType : 'json',
				success  : function(data) {
					if (!data || !data.content) return;

					var content = data.content || '';
					if (content) content = $('<textarea>').html( content ).val();

					doc.setValue(content);
					$revertBtns.prop('disabled', false);
				}
			});
		},
		getActiveRevision : function() {
			return parseInt($history.children('.selected').attr('data-revision'));
		},
		selectRevision : function(rev) {
			$history.children('a[data-revision="'+rev+'"]').addClass('selected').siblings().removeClass('selected');

			// view selected revision label
			$('.file-editor .btns > small b').text( $('#revision-history > a[data-revision="'+rev+'"]').text() ).parent().show();

			// hide all buttons
			$btns = $('.file-editor .btns button').hide();
			if (rev === 0) {				
				$('.file-info')
					.find('.btns')[this.removable ? 'removeClass' : 'addClass']('norename');

				$btns.filter('.btn-save, .btn-delete, .btn-rename').removeAttr('style');
			}

		}
	};
	$.extend(CodeMirror.Doc.prototype, docExtension);

	function createDoc(content, filename, type, removable) {
		var doc, ext, mode;

		ext = (filename.match(/\.(html|css|js|json)$/)||[])[1];
		switch (ext) {
			case 'html': mode = 'django'; break;
			case 'css': mode = 'css'; break;
			case 'js':case 'json': mode = 'javascript'; break;
			default: mode = 'null';
		}

		doc = new CodeMirror.Doc(content, mode);
 		doc = $.extend(doc, {prevText : content, filename : filename, type: type, removable:removable});
		doc.on('change', function(d, changed){
			doc.showName();
			$fileTab.trigger('update');
			var $folder = $('.folder-tree, .file-editor, #file-tab');
			$folder.find('a[asset="'+filename+'"]').trigger('update');
			$save.prop('disabled', !d.isChanged());
		});
		documents[filename] = doc;

		return doc;
	};

	function assetName(name) {
		if (/\.(html|js|css)$/.test(name)) name += '.template';
		return name;
	};

	function renameAsset(type, name, path) {
		var deferred = $.Deferred();

		name=name.replace(path+'/','')

		$('#file_rename')
			.find('fieldset input[type="text"]').val( (path?(path+'/'+name):name) ).end()
			.find('p.ltit').html('Rename File').end()
			.data('filename', name)
			.data('path', path)
			.data('type', type)
			.data('deferred', deferred);

		return deferred;
	};

	function deleteAsset(type, name) {
		var deferred = $.Deferred();

		$('#file_delete')
			.find('fieldset b').text(name).end()
			.find('p.ltit').html('Delete File').end()
			.data('filename', name)
			.data('type', type)
			.data('deferred', deferred);

		return deferred;
	};

	function renameFolder(type, path) {
		var deferred = $.Deferred();

		$('#file_rename')
			.find('fieldset input[type="text"]').val( path ).end()
			.find('p.ltit').html('Rename Folder').end()
			.data('filename', '')
			.data('path', path)
			.data('type', type)
			.data('deferred', deferred);

		return deferred;
	};
	
	function deleteFolder(type, path) {
		var deferred = $.Deferred();

		$('#file_delete')
			.find('fieldset b').text(path).end()
			.find('p.ltit').html('Delete Folder').end()
			.data('filename', '')
			.data('path', path)
			.data('type', type)
			.data('deferred', deferred);

		return deferred;
	};

	function getPathList(type){
		var pathList;

		pathList = Array.prototype.slice.call($('#tree-type-'+type).find("a.path.name_[path]").map(function(){return $(this).attr('path')}))
		pathList.unshift('');

		return pathList;
	}

	function createTemplate(name, path){
		var deferred = $.Deferred(), pathList;

		pathList = getPathList('template');
		$('#template_new').find("fieldset select[name=path]").empty();
		$.each(pathList, function(idx) {
			var path = pathList[idx];
			$('<option value="'+path+'">'+path+'/</option>').appendTo($('#template_new').find("fieldset select[name=path]"));
		});
		
		$('#template_new')
			.find('fieldset input[type="text"][name="template"]').val(name||"untitled").end()
			.find('fieldset select[name="path"]').val(path||"").end()
			.data('deferred', deferred);

		setTimeout(function(){
			$('#template_new')
			.find('fieldset input[type="text"]').select().focus();
		},200);

		return deferred;
	}

	function createUpload(path){
		var deferred = $.Deferred(), pathList;

		pathList = getPathList('asset');
		$('#add_file').find("fieldset select[name=path]").empty();
		$.each(pathList, function(idx) {
			var path = pathList[idx];
			$('<option value="'+path+'">'+path+'/</option>').appendTo($('#add_file').find("fieldset select[name=path]"));
		});
		
		$('#add_file')
			.find('fieldset select[name="path"]').val(path||"").end()
			.data('deferred', deferred);

		return deferred;
	}

	function createFileItem(fullname, type, removable) {
		var $file = $fileTpl.clone(), path, name;

		path = fullname.split("/");
		name = path.pop();
		path = path.join("/");

		$file.find('.name_').text(name).attr('asset', fullname).attr('path',path);

		if (type === 'asset') {
			$asset = $file.find('.file').removeClass('file');
			if (/\.(png|gif|jpg)$/i.test(name)) {
				$asset.attr('data-lightbox','asset').attr('data-content', "{{ '"+fullname+"' | asset_url }}").addClass('img');
			} else if (/\.svg$/i.test(name)) {
				$asset.attr('data-lightbox','asset').attr('data-content', "{{ '"+fullname+"' | asset_url }}").addClass('svg');	
			} else if (/\.(eot|ttf|woff)$/i.test(name)) {
				$asset.attr('data-content', "{{ '"+fullname+"' | asset_url }}").addClass('font');	
			} else if (/\.(zip|7z|tar\.bz2|tar\.gz|rar|zipx)$/i.test(name)) {
				$asset.attr('data-content', "{{ '"+fullname+"' | asset_script }}").addClass('zip');	
			} else if (/\.js$/i.test(name)) {
				$asset.attr('data-content', "{{ '"+fullname+"' | asset_script }}").addClass('js');
			} else if (/\.css$/i.test(name)) {
				$asset.attr('data-content', "{{ '"+fullname+"' | asset_css }}").addClass('css');
			} else {
				$asset.addClass('asset');
			}
		} else if (type == 'template' || type == 'layout') {
			$file.find('.dropdown a.insert_').remove();
		} else if (type == 'setting') {
			$file.hide();
		}

		if (!removable) {
			$file.find('.dropdown').hide();
		}

		return $file;
	}

	function createPathItem(path, type, removable){
		var $path = $pathTpl.clone();

		$path.find('.name_').text(path).attr('path', path);

		if(type == 'template'){
			$path.find('.dropdown a.template_new_').attr('path',path).show();
		}else if(type == 'asset'){
			$path.find('.dropdown a.upload_').attr('path',path).show();
		}

		if (!removable || type == 'layout') {
			$path.find('.dropdown').hide();
		}

		return $path;
	}

	function drawAssetTree() {
		$('.asset-list input[type="text"]').val('').trigger('keyup');
		$.ajax({
			type : 'GET',
			url  : expand_url_params(urlPrefix + 'all_assets.json?theme_id=' + themeID),
			dataType : 'json',
			success : function(json) {
				if (!json || !json.status_code) return;

				var $ta = $('<textarea>');

				$.each(json.assets || {}, function(type, list) {
					var $list = $('#tree-type-'+type), $add;

					$add = $list.find('>li.add_').remove();
					$list.empty().append($add);

					if (!$list.length) return;

					$.each(list, function(idx) {
						var obj = list[idx], fullname = obj.name, path, $file, $path, $asset;

						fullname  = fullname.replace(/\.(html|js|css)\.template/i, '.$1');

						path = fullname.split("/");
						name = path.pop();
						path = path.join("/");
						if(path){
							$path = $list.find(".path[path='"+path+"']").closest('li');
							if(!$path.length){
								$path = createPathItem(path, type, obj.removable);
								$list.append($path);
							}
						}

						$file = createFileItem(fullname, type, obj.removable);
						if (obj.url) {
							$file.find('[data-lightbox]')
								.attr('href', obj.url)
								.wrapInner('<span class="name"></span>')
								.append('<span class="preview-asset"><em class="zoom"></em><em class="show"><img src="'+obj.url+'" alt></em></span>');
						}

						if (obj.content) {
							createDoc($ta.html(obj.content).val(), fullname, type, obj.removable);
						}

						if(path){
							$path.find("ul").append($file);
						}else{
							$list.append($file);
						}
					});
				});

				$('[id^="tree-type-"]').trigger('sort');

			}
		});
	}
	drawAssetTree();

	// switch to dark/light
	$('.file-editor .dropdown')
		.on('click', 'a.light, a.dark', function(event){
			event.preventDefault();
			var $this = $(this).hide();

			$this.siblings('a.light, a.dark').show().closest('.dropdown').removeClass('opened');
			if ($this.hasClass('dark')) {
				$this.closest('.file-editor').addClass('dark');
				editor.setOption('theme', 'midnight');
			} else {
				$this.closest('.file-editor').removeClass('dark');
				editor.setOption('theme', 'neo');
			}
		});

	function confirmClose(){
		var changed = [];
		for( k in documents){
			var doc = documents[k];
			if(doc.isChanged()) changed.push(doc);
		}
		if( changed.length ){
			return 'You have unsaved documents.\nAre you sure you want to leave?';
		}
	}
	window.onbeforeunload = confirmClose;
});
