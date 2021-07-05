jQuery(function($){
    $('.tb-admin1 tbody').on('click', 'td .btn-switch', function(e) {
        var $this = $(this);
        var $thisItem = $(this).closest('tr').find('.saleitem');

        $this.toggleClass('on');
        $.ajax({
            type : 'PUT',
            url  : '/rest-api/v1/seller/' + $thisItem.attr('seller-id') + '/products/' + $thisItem.data('id') + '/video',
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify({ featured: $this.hasClass('on') }),
            processData : false,
            success  : function(res) {}
        });
    });

    $('.tb-admin1 tbody').on('click', 'td .btn-del', function(e) {
        e.preventDefault();
        var $thisItem = $(this).closest('tr').find('.saleitem');
        if (window.confirm(gettext('Are you sure you want to delete?'))){
            $.ajax({
                type : 'DELETE',
                url  : '/rest-api/v1/seller/' + $thisItem.attr('seller-id') + '/products/' + $thisItem.data('id') + '/video',
                success  : function(res) {
                    alert('Successfully deleted.');
                }
            });
        }
    });

    $('.tb-admin1 th').on('click', 'a', function(e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass('down') || $this.hasClass('up')) return;

        $('.tb-admin1 th').find('.down').removeClass('down');
        $('.tb-admin1 th').find('.up').removeClass('up');
        var field = $this.data('field');
        $.get('/rest-api/v1/videos/saleitem', {
            'sort\[sort\]': field,
            'sort\[ascending\]': false
        }, function(res) {
            $('.tb-admin1 tbody').empty();
            render(res.videos);
            $this.addClass('down');
        });
    });

    $('.tb-admin1 th').on('click', 'a.down, a.up', function(e) {
        e.preventDefault();
        var $this = $(this);
        var field = $this.data('field');

        $(this).toggleClass('down up');
        $.get('/rest-api/v1/videos/saleitem', {
            'sort\[sort\]': field,
            'sort\[ascending\]': $this.hasClass('up')
        }, function(res) {
            $('.tb-admin1 tbody').empty();
            render(res.videos);
        });
    });

    $('.search .btn-submit').on('click', function(e) {
        var field = $('.search #search-keyword').val();
        var searchStr = $('.search .text').val();

        $.get('/rest-api/v1/videos/saleitem', {
            'search\[field\]': field,
            'search\[text\]': searchStr
        }, function(res) {
            $('.tb-admin1 tbody').empty();
            render(res.videos);
        });
    })

    function render(videos) {
        var template = _.template(
            '<tr data-id="<%= data.id %>">' +
                '<td class="id"><%= data.id %></td>' +
                '<td class="seller"><a href="/shop/<%=data.owner%>"><%= data.object.brand_name %></a></td>' +
                '<td class="saleitem" data-id="<%= data.object.id %>" seller-id="<%= data.object.seller_id %>">' +
                    '<a href="/sales/<%= data.object.id %>/"><%= data.object.title %></a>' +
                '</td>' +
                '<td>' +
                    '<button name="timeline_featured" class="btn-switch <% if(data.featured) print(\'on\') %>">' +
                        '<span class="on">On</span>' +
                        '<span class="off">Off</span>' +
                    '</button>' +
                '</td>' +
                '<td>' +
                    '<a href="#" class="btn-del tooltip"><i class="icon"></i><em>Remove</em></a>' +
                '</td>' +
            '</tr>'
        );

        var $tableBody = $('.tb-admin1 tbody');
        _.each(videos, function(video) {
            if(video.object){
                $tableBody.append(template({ data: video }));    
            }
        });
    }

    var calling = false;
    var page = 1;
    var maxPage = 1;
    function docHeight() {
        var d = document;
        return Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
    };
    function onScroll(){
        if (calling ) return;

        calling = true;

        var rest = docHeight() - $(document).scrollTop();
        if (rest > 2000){
            calling = false;
            return;
        }

        if( page+1 <= maxPage){
            $.get('/rest-api/v1/videos/saleitem', {page:page+1}, function(res) {
                page = res.current_page;
                render(res.videos);
                calling = false;
            });
        }

    }
    $(window).scroll(onScroll);

    function getVideoData(){
        $.get('/rest-api/v1/videos/saleitem', function(res) {
            page = res.current_page;
            maxPage = res.max_page;
            render(res.videos);
        });
    }
    getVideoData();
});