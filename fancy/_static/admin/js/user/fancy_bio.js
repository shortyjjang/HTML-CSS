jQuery(function($){
    $('.add-photos ol').on('click', '.add_photo', function(e) {
        e.preventDefault();
        $.dialog('add-bio-items').open();
        showPopup();
    });

    $('ol.photo-list').on('click', 'li.photo-item > a.delete-button', function(e) {
        e.preventDefault();
        $(this).closest('li').remove();
    });

    $('.popup.add-bio-items').on('click', '.btn-save', function(e) {
        console.log('save!');
        var itemIDList = $('.popup.add-bio-items .text').val();
        var prevList = _.map($('li.photo-item'), function(item) {
            return $(item).data('tid');
        });

        var ids = _.map($('.fancyd-list li.selected'), function(item) {
            var tid = $(item).data('tid');
            if (prevList.indexOf(tid) < 0) return tid;
        });
        ids = _.without(ids, undefined);

        if (prevList.length + ids.length > 6) {
            alert('The item list can have 6 items.');
            return;
        }

        var thing_ids = '';
        if( itemIDList ) {
             thing_ids = itemIDList + ',' + ids.join(',');
        } else {
            thing_ids = ids.join(',');
        }
        $.get('/rest-api/v1/things/simple_info?thing_ids=' + thing_ids, function(json) {
            renderItems(json);
            $.dialog('add-bio-items').close();
        })
    });

    $('.popup.add-bio-items .fancyd-list').on('click', 'ul > li:not(.selected)', function(e) {
        $(this).addClass('selected');
        $(this).find('input').prop('checked', 'checked');
    });

    $('.popup.add-bio-items .fancyd-list').on('click', 'ul > li.selected', function(e) {
        $(this).removeClass('selected');
        $(this).find('input').prop('checked', false);
    });

    function showPopup() {
        if ($('.popup.add-bio-items').hasClass('init')) return;
        var username = $('.popup.add-bio-items .fancyd-list').attr('username');
        if (!username) alert("Failed to get user's fancyd list.");
        $.get('/' + username + '/fancyd.json', function(json) {
            if (json.things) {
                renderFancydItems(json.things);
            }
        });
    }

    function renderFancydItems(things) {
        var $fancydList = $('.fancyd-list > ul');
        _.each(things, function(thing) {
            var $li = $('<li><input type="checkbox" /><label></label><img src="/_ui/images/common/blank.gif"></li>');
            $li.attr('data-tid', thing.id);
            $li.find('img').css('background-image', 'url(' + thing.thumb_image_url + ')');
            $fancydList.append($li);
        });
    }

    function renderItems(items) {
        console.log("render!");
        var template = _.template(
            '<li class="photo-item" data-tid="<%= data.thing_id_str %>">' +
                '<a class="delete-button" href="#"><i class="icon"></i></a>' +
                '<img src="/_ui/images/common/blank.gif" style="background-image:url(<%= data.thumbnail_url %>)" alt="">' +
            '</li>'
        );

        var $add = $('ol.photo-list .add_photo');
        _.each(items, function(item) {
            console.log(item.thing_id_str);
            $add.before(template({ data: item }));
        });

        if ($('li.photo-item').length >= 6) {
            $('li.add_photo').hide();
        }
    }

    var coverImage = new Fancy.CoverImage({
        input : $('#uploadcover'),
        image : $('#coverImg'),
        loader : $(".cover-preview .infscr-loading"),
        button : $('span.no'),
        objectType : 'userbioprofile',
        maxWidth : 1940,
        autoupload : true
    });

    $('.data-frm .search .text').on('keydown', function(e) {
        var searchStr = $(this).val();
        console.log(searchStr);
        switch(event.keyCode) {
            case 13:
                searchUser(searchStr);
                return;
        }

        if (searchStr.length > 2) {
            $.get('/search-users.json?term=' + searchStr, function(json) {
                renderSearchUserResult(json);
            });
        }
    });

    function searchUser(username) {
        $.get('/rest-api/v1/users/by_name/' + username, function(e) {
            if (e.is_active) {
                location.href = '/_admin/fancy-bio/' + username;
            } else {
                alert('The username is not valid.');
            }
        }).fail(function() {
            alert('The username is not valid.');
        });
    }

    function renderSearchUserResult(data) {
        var template = _.template(
            '<li>' +
                '<a href="/_admin/fancy-bio/<%= user.username %>">' +
                    '<img src="/_ui/images/common/blank.gif" style="background-image:url(<%= user.profile_image_url %>)">' +
                    '<b><%= user.name %></b>' +
                    '<small>@<%= user.username %></small>' +
                '</a>' +
            '</li>'
        );

        var $ul = $('.data-frm .search .user-list');
        $ul.html('').hide();
        _.each(data, function(user) {
            $ul.append(template({ user:user }));
        });
        $ul.show();
    }

    $('.data-frm .btn-save-bio').on('click', function(e) {
        var username = $('.fancy_bio').attr('username');
        if (!username) {
            alert('You should select a user');
            return;
        }

        var name = $('.data-cont .name .text').val();
        if (name === '') return;
        $.post('/rest-api/v1/users/profile/bio/' + username, {
                name: name,
                bio: tinyMCE.get('fancy-bio').getContent(),
                tagline: $('.data-cont .tagline .text').val(),
                thing_ids: _.map($('.additional li.photo-item'), function(item) { return $(item).data('tid'); }).join(','),
            }, function(json) {
                console.log(json);
                if (json.error) {
                    alert(json.error);
                } else {
                    alert(json.msg);
                    if (coverImage.hasUploadedImage()) {
                        console.log('image uploading....');
                        coverImage.objectId = json.obj_id;
                        coverImage.save(function(){
                            location.href = '/' + json.username + '/bio?v2';
                        });
                    }else{
                        location.href = '/' + json.username + '/bio?v2';    
                    }
                }
            }
        );
    });

    function render(data) {
        $('.data-cont .name .text').val(data.name);
        $('.data-cont .tagline .text').val(data.tagline);
        if (data.cover_image_url) {
            $('.data-cont .cover-preview #coverImg').attr('src', data.cover_image_url).show();
            $('.data-cont .cover-preview').removeClass('blank');
        }
        renderItems(data.items);
        tinyMCE.get('fancy-bio').setContent(data.bio);
    }

    function getUserBioProfile() {
        var username = $('.fancy_bio').attr('username');
        if (!username) return;
        $.get('/rest-api/v1/users/profile/bio/' + username, function(res) {
            render(res);
        });
    }

    $(window).load(function(){
        getUserBioProfile();
    });

});
