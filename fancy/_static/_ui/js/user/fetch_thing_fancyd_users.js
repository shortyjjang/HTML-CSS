jQuery(function($) {
    var thing_ids = []
    var LIMIT = 4
    $('.need-fetch-fancyd-users').each(function(i,a) {
        thing_ids.push($(this).attr('data-thing-id'))
    })
    thing_ids = thing_ids.join(',')

    if(!thing_ids) return

    params = {
        'thing_ids': thing_ids,
        'limit': LIMIT
    }
    $.get('/rest-api/v1/things/fancyd_users', params, function(res) {
        console.log(res)
        for(thing_id in res) {
            fancyd_users = res[thing_id]
        }

        var template = '<a href="##URL##" class="user">'+
        '<img src="/_ui/images/common/blank.gif" style="background-image:url(\'##IMAGE_URL##\');">'+
        '<em>##NAME##</em>'+
        '</a>'
        $('.need-fetch-fancyd-users').each(function(i,a) {
            thing_id = $(this).attr('data-thing-id')
            var $parent = $(this).parent()
            if(thing_id in res) {
                fancyd_users = res[thing_id]
                for(i in fancyd_users) {
                    user = fancyd_users[i]
                    tag = template.replace('##URL##', '/'+user.username).replace('##IMAGE_URL##', user.image_url).replace('##NAME##', user.fullname)
                    $parent.append(tag)
                }
            }
            $(this).remove()
        })
    })
})
