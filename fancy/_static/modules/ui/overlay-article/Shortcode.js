/* BEWARE: this code is directly imported via mobile article.new.html, use ES5 */
var ImageModes = {
    Full: 'Full',
    Normal: 'Normal',
    Quoted: 'Quoted',
    Grid: 'Grid',
};

function getRandomId() {
    return 'shortcode-' + String(Math.random()).substr(2)
}

function getJumper($element) {
    var _id = getRandomId();
    $element.attr('id', _id);
    return function () {
        return $('#' + _id)
    }
}

function jQueryPromiseAll(arrayOfPromises) {
    return jQuery.when.apply(jQuery, arrayOfPromises).then(function() {
        return Array.prototype.slice.call(arguments, 0);
    });
}
function getProductContext(products, callback) {
    if (products.length > 0) {
        jQueryPromiseAll(products.filter(function(e){ return e }).map(function(sid) {
            var dfd = $.Deferred()
            $.get('/rest-api/v1/things/' + sid + '?sales=true&include_every_image=true')
                .then(function(thing) {
                    dfd.resolve(thing);
                })
                .fail(function(xhr) {
                    if (xhr.status === 404) {
                        alertify.alert('Product id ' + sid + 'not found.');
                    } else {
                        console.warn('There was an error whiel fetching sid:', sid, xhr)
                    }
                    dfd.resolve(null);
                });
            return dfd.promise()
        }))
        .done(function(things) {
            var ctx = {
                items: things.map(function(thing){
                    var image_fit_to_bounds = false;
                    var image = thing.image.src;
                    try {
                        image_fit_to_bounds = thing.sales.images[0].fit_to_bounds;
                        image = thing.sales.images[0].src;
                    } catch(e) {}
                    return thing.sales && { title: thing.sales.emojified_name, price: thing.sales.price, retail_price: thing.sales.retail_price, image: image, image_fit_to_bounds: image_fit_to_bounds, id: thing.sales.id }
                }).filter(function(e){ return e })
            };
            callback(ctx);
        })
    } else {
        console.warn('[ShortCodeTransformers]: Error - product does not exist');
    }
}

function getTemplateByImageMode(imageMode) {
    switch (imageMode) {
        case ImageModes.Grid:
            return (
                '<div class="grid"><img src="/_ui/images/common/blank.gif"  alt="<%= image.caption %>" class="" style="background-image:url(\'<%= image.src %>\');" data-src="<%= image.src %>"><% if (image.caption) { %><figcaption class="text-placeholder"><%= image.caption %></figcaption><% } %></div>'
            )
        case ImageModes.Full:
            return (
                '<figure class="mode-full"><img src="<%= image.src %>" alt="<%= image.caption %>"></figure>'
            );
        case ImageModes.Quoted:
            return (
                '<figure class="mode-quoted"><p><img src="<%= image.src %>" alt="<%= image.caption %>"></p><p class="textarea"><%= image.caption %></p></figure>'
            );
        case ImageModes.Normal:
        default:
            return (
                '<figure class="mode-normal"><img src="<%= image.src %>" alt="<%= image.caption %>"></figure>'
            );
    }
}

var ShortCodeTransformers = {};
/* 
<% {"name": fancy-article-gallery,
    "images": [{ src: "https://img-address-1", caption: "An image caption", uiid: 1 }, ... ],
    "title": "a gallery title",
    "tagline": "a gallery tagline"} %>
*/
ShortCodeTransformers['fancy-article-gallery'] = function(options, $shortcode) {
    var images  = options.images;
    var title   = options.title;
    var tagline = options.tagline;
    var markup = '';
        markup += '<div class="gallery">'
        markup +=   '<h3><span><%= title %></span><small class="tagline"><span><%= tagline %></span></small></h3>'
        markup +=   '<ul class="photo-list">'
        markup +=     '<% _.each(images, function(image, idx) { %>'
        markup +=       '<li class="<%= idx === 0 ? \'active\' : \'\' %>"><a href="<%= image.link %>" <%= image.link ? "rel=\'noopener\' target=\'_blank\' class=\'linked\'" : "onclick=\'return false;\'" %>><img src="<%= image.src %>"></a><span><%= image.caption %></span></li>'
        markup +=     '<% }) %>'
        markup +=   '</ul>'
        markup +=   '<div class="paging">'
    if (window.isWhitelabelV2) {
        markup +=     '<div class="btn"><a class="prev"></a><a class="next"></a></div>'
    }
        markup +=     '<% _.each(images, function(e, idx) { %> '
        markup +=       '<a href="#" class="<%= idx === 0 ? \'current\' : \'\' %> pager"><%= idx + 1 %></a>'
        markup +=     '<% }) %>'
        markup +=   '</div>'
        markup += '</div>'

    var $next = $(_.template(markup)({ images: images, title: title, tagline: tagline }));
    if (window.isWhitelabelV2) {
        $next.find('img').wrap('<span class="figure" />');
        $next = $('<div class="gallery-container" />').append($next);
    }
    $shortcode.replaceWith($next.prop('outerHTML'));
};
/*
<% {"name": "fancy-article-img",
    "images": [{
        "mode": "Quoted",
        "src": "https://img-address",
        "caption": "A image caption",
    }]
   } %>
*/
ShortCodeTransformers['fancy-article-img'] = function(options, $shortcode) {
    var images = options.images;
    var html = images.reduce(function(prev, image) {
        return prev + _.template(getTemplateByImageMode(image.mode))({ image: image });
    }, '');
    if (images[0] && images[0].mode === ImageModes.Grid) {
        html = ('<figure class="mode-grid">' + html + '</figure>')
    }
    $shortcode.replaceWith(html);
};

ShortCodeTransformers['fancy-article-product'] = function(options, $shortcode) {
    var items  = options.products;
    const getIsolatedShortcodeElement = getJumper($shortcode)
    getProductContext(items, function (ctx) {
    var markup = '';
        markup += '<ul class="itemList product">'
        markup += '<% items.forEach(function(item) { %>'
        markup +=   '<li class="itemListElement" data-id="<%= item.id %>">'
        markup +=     '<a href="<%= item.html_url %>?utm=article">'
        markup +=     '<span class="figure <% if (item.image_fit_to_bounds) { %>fit<% } %>">'
        markup +=       '<img src="/_ui/images/common/blank.gif" style="background-image:url(<%= item.image %>)">'
        markup +=     '</span>'
        markup +=     '<span class="figcaption">'
        markup +=       '<span class="title"><%= item.title %></span>'
        markup +=       '<% if (item.retail_price != null) { %><b class="price sales">$<%= item.price %> <small class="before">$<%= item.retail_price %></small></b><% } else { %><b class="price">$<%= item.price %></b><% } %>'
        markup +=     '</span>'
        markup +=   '</li>'
        markup += '<% }); %>'
        markup += '</ul>'
        var next = _.template(markup)(ctx);
        getIsolatedShortcodeElement().replaceWith(next);
    });
};

ShortCodeTransformers['fancy-article-product-slideshow'] = function(options, $shortcode) {
    var items  = options.products;
    const getIsolatedShortcodeElement = getJumper($shortcode)
    getProductContext(items, function(ctx) {
    var markup = '';
        markup += '<div class="itemSlide product">'
        markup +=   '<div class="itemSlideWrap">'
        markup +=     '<ul class="stream after">'
        markup +=       '<% items.forEach(function(item) { %>'
        markup +=       '<li class="itemSlideElement">'
        markup +=         '<div class="figure-item">'
        markup +=           '<figure <% if (item.image_fit_to_bounds) { %>class="fit"<% } %>><a href="<% if (item.html_url) { %><%= item.html_url %><% } else { %>/sales/<%= item.id %>?utm=article<% } %>?utm=article">'
        markup +=             '<span class="back"></span>'
        markup +=             '<img class="figure" src="/_ui/images/common/blank.gif"'
        markup +=                  'style="background-image: url(<%= item.image %>);">'
        markup +=           '</a></figure>'
        markup +=           '<figcaption>'
        markup +=             '<span class="show_cart">'
        markup +=               '<button class="btn-cart nopopup soldout">'
        markup +=                 '<% if (item.retail_price != null) { %><b class="price sales">$<%= item.price %> <small class="before">$<%= item.retail_price %></small></b><% } else { %><b class="price">$<%= item.price %></b><% } %>'
        markup +=               '</button>'
        markup +=             '</span>'
        markup +=             '<a href="<%= item.html_url %>?utm=article" class="title"><%= item.title %></a>'
        markup +=           '</figcaption>'
        markup +=         '</div>'
        markup +=       '</li>'
        markup +=       '<% }); %>'
        markup +=     '</ul>'
        markup +=   '</div>'
        markup +=   '<a href="#" class="prev">Prev</a>'
        markup +=   '<a href="#" class="next">Next</a>'
        markup += '</div>'

        var next = _.template(markup)(ctx);
        getIsolatedShortcodeElement().replaceWith(next);
    });
};

function getWrappedSingleNode(target) {
    return $('<div class="singlenode-wrapper">' + target + '</div>');
}

function convertShortcode(content) {
    var $wrapped = getWrappedSingleNode(content);
    var $disposable = mountToDisposable($wrapped);

    $wrapped.find('p.shortcode').each(function(i, shortcode) {
        var $sc = $(shortcode);
        try {
            var data = JSON.parse($sc.attr('data-internal'));
            ShortCodeTransformers[data.name](data, $sc);
        } catch(e) { console.warn(e) }
    });

    $disposable.remove();
    return $wrapped.html();
}
window.convertArticleShortcode = convertShortcode;

function mountToDisposable(unmountedDOM) {
    // Create/Select disposable mounting DIV to correctly modify a element.
    let $disposable = $(document.body).find('.disposable');
    if ($disposable.length > 0) {
        $disposable = $disposable.eq(0).empty();
    } else {
        $disposable = $('<div />', { id: 'disposable', style: 'display:none;'}).appendTo(document.body);
    }

    if (unmountedDOM) {
        // Append unmounted DOM if exists
        $disposable.append(unmountedDOM);
    }
    // return disposable DOM
    return $disposable;
}
