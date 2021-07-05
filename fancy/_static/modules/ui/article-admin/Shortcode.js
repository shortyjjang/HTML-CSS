import { mountToDisposable } from 'dom-helper';
import { jQueryPromiseAll } from 'fancyutils';

// tokens
export function getShortcodeString(json) {
    return `<p class="shortcode" data-internal='${json}'></p>`;
}

const ImageModes = {
    Full: 'Full',
    Normal: 'Normal',
    Quoted: 'Quoted',
    Grid: 'Grid',
};

const ImageModesClasses = {
    Full: 'mode-full',
    Normal: 'mode-normal',
    Quoted: 'mode-quoted',
    Grid: 'mode-grid',
};

const Templates = {
    FancyArticleProductSlideshow: 
        _.template(`<div class="itemSlide product" contenteditable="false">
            <div class="itemSlideWrap">
                <ul class="stream after">
                <% items.forEach(function(item, idx) { %>
                <li class="itemSlideElement" data-id="<%= item.id %>" data-idx="<%= idx %>">
                    <div class="figure-item">
                    <figure <% if (item.image_fit_to_bounds) { %>class="fit"<% } %>>
                        <a href="<% if (item.html_url) { %><%= item.html_url %><% } else { %>/sales/<%= item.id %>?utm=article<% } %>"><span
                            class="back"></span><img class="figure" src="/_ui/images/common/blank.gif" style="background-image: url(<%= item.image %>);"></a>
                    </figure>
                    <figcaption>
                        <span class="show_cart">
                        <button class="btn-cart nopopup soldout">
                            <% if (item.retail_price != null) { %><b class="price sales">$<%= item.price %> <small class="before">$<%= item.retail_price %></small></b><% } else { %><b class="price">$<%= item.price %></b><% } %>
                        </button>
                        </span><a href="<% if (item.html_url) { %><%= item.html_url %><% } else { %>/sales/<%= item.id %>?utm=article<% } %>" class="title"><%= item.title %></a>
                    </figcaption>
                    <a class="delete"></a>
                    </div>
                </li>
                <% }); %>
                </ul>
            </div>
            <a href="#" class="prev">Prev</a>
            <a href="#" class="next">Next</a>
            <small class="add_option_tools" style="display:none;">
                <a class="add-product">Organize Products</a>
                <a class="delete-slideshow">Delete Slideshow</a>
            </small>
        </div>`),
    FancyArticleProductCard: 
        _.template(`<ul class="itemList product" contenteditable="false">
            <% items.forEach(function(item, idx) { %>
            <li class="itemListElement" data-id="<%= item.id %>" data-idx="<%= idx %>">
                <span class="figure <% if (item.image_fit_to_bounds) { %>fit<% } %>">
                    <img src="/_ui/images/common/blank.gif" style="background-image:url(<%= item.image %>)">
                </span>
                <span class="figcaption">
                    <span class="title"><%= item.title %></span>
                    <% if (item.retail_price != null) { %><b class="price sales">$<%= item.price %> <small class="before">$<%= item.retail_price %></small></b><% } else { %><b class="price">$<%= item.price %></b><% } %>
                </span>
                <a class="remove">Remove</a>
            </li>
            <% }); %>
            <small class="add_option_tools" style="display:none;">
                <a class="add-product">Organize Products</a>
                <a class="delete-slideshow">Delete Grid</a>
            </small>
        </ul>`)
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

// Shortcode -> DOM
export const ShortCodeTransformers = {
    /* <% {"name": fancy-article-gallery,
           "images": [{ src: "https://img-address-1", caption: "An image caption", uiid: 1 }, ... ],
           "title": "a gallery title",
           "tagline": "a gallery tagline"} %> */
    ['fancy-article-gallery']({ images, title, tagline }, $shortcode) {
        window.GalleryControl.renderTo($shortcode, { images, title, tagline });
    },
    /* <% {"name": "fancy-article-img",
           "images": [{
               "mode": "Quoted",
               "src": "https://img-address",
               "caption": "A image caption",
           }]
          } %> */
    ['fancy-article-img'](options, $shortcode) {
        const { images } = options;

        let $el;
        if (images.length > 0) {
            let el = '<div class="medium-insert-images" contenteditable="false">';
            if (images[0].mode === ImageModes.Grid) {
                el += `<figure data-mode="${ImageModes.Grid}">`
                images.forEach(image => {
                    el += `<div class="grid">
                        <img src="${window.blankUrl}" style="background-image:url('${image.src}')" data-src="${image.src}" />
                        <a href="#" class="remove">Remove</a>`
                    if (image.caption) {
                    el += `<figcaption class="text-placeholder" data-placeholder="Type an image caption">${image.caption}</figcaption><a href="#" class="btn-caption">Edit Caption</a>`
                    } else {
                    el += '<a href="#" class="btn-caption">Add Caption</a>';
                    }
                    el += `</div>`;
                });
                el += '</figure>';
                $el = $(el);
            } else {
                images.forEach(image => {
                    let fig; 
                    fig  = `<figure data-mode="${ImageModes.Normal}"><img src="${image.src}" alt="" class="" />`;
                    if (image.caption) {
                    fig += `<figcaption>${image.caption}</figcaption>`
                    }
                    fig += `</figure>`;
    
                    const $fig = $(fig);
                    if (image.mode !== ImageModes.Normal) {
                        window.ReactMediumEditor__changeMode &&
                        window.ReactMediumEditor__changeMode($fig, ImageModes.Normal, image.mode);
                    }
                    el += $fig.prop('outerHTML');
                });
                el += '</div>';
                $el = $(el);
                $el.addClass(`medium-insert-images-${ImageModesClasses[images[0].mode]}`)
            }
        } else {
            console.warn('[ShortCodeTransformers]: Error - images not exist');
        }
        $shortcode.replaceWith($el);
    },
    ['fancy-article-product'](options, $shortcode) {
        const { products } = options;
        const getIsolatedShortcodeElement = getJumper($shortcode)
        getProductContext(products, ctx => {
            const el = Templates.FancyArticleProductCard(ctx);
            getIsolatedShortcodeElement().replaceWith(el);
        });
    },
    ['fancy-article-product-slideshow'](options, $shortcode) {
        const { products } = options;
        const getIsolatedShortcodeElement = getJumper($shortcode)
        getProductContext(products, ctx => {
            const el = Templates.FancyArticleProductSlideshow(ctx);
            getIsolatedShortcodeElement().replaceWith(el);
        });
    }
};

export function convertShortcode(articleDOM) {
    $(articleDOM).find('p.shortcode').each((i, shortcode) => {
        const $sc = $(shortcode);
        try {
            const data = JSON.parse($sc.attr('data-internal'));
            ShortCodeTransformers[data.name](data, $sc);
        } catch(e) { console.warn(e) }
    });
}

function getWrappedSingleNode(target) {
    return $(`<div class="singlenode-wrapper">${target}</div>`);
}

function reverseTransformerWrapper(procedure) {
    return function wrapper(target) {
        const wrapped = getWrappedSingleNode(target);
        const $disposable = mountToDisposable(wrapped);

        procedure(wrapped);

        $disposable.remove();
        return wrapped.html();
    }
}

function escStr(str){
    return str.replace(/'/g, '&apos;');
}

// Exporting
export const ShortCodeReverseTransformers = {
    transformFancyArticleImage(wrapped) {
        const $target = wrapped.find('.medium-insert-images');
        $target.each((i, e) => {
            const images = [];
            const imageDOMContainer = $(e);
            const _$fig = imageDOMContainer.find('figure');
            if (_$fig.attr('data-mode') === ImageModes.Grid) {
                _$fig.find('.grid').each((ii, ee) => {
                    const $div = $(ee);
                    const data = {
                        mode: ImageModes.Grid,
                        src: $div.find('img').attr('data-src'),
                    };
                    const caption = $div.find('figcaption').text();
                    if (caption) {
                        data.caption = caption.replace(/'/g, "&#39;"); // quote causes error on re-parse
                    }
                    images.push(data);
                })
            } else {
                _$fig.each((ii, ee) => {
                    const $fig = $(ee);
                    const data = {
                        mode: $fig.attr('data-mode') || ImageModes.Normal,
                        src: $fig.find('img').attr('src'),
                    };
                    // Add caption, if any exists.
                    const caption = (data.mode === ImageModes.Quoted) ? $fig.find('.textarea').text() : $fig.find('figcaption').text();
                    if (caption) {
                        data.caption = caption.replace(/'/g, "&#39;"); // quote causes error on re-parse
                    }
                    images.push(data);
                });
            }
            if (images.length > 0) {
                const json = JSON.stringify({ name: 'fancy-article-img', images });
                imageDOMContainer.replaceWith(getShortcodeString(json));
            }
        });
    },
    transformFancyArticleGallery(wrapped) {
        const $gals = wrapped.find('.gallery-container');
        if ($gals.length > 0) {
            $gals.each((idx, gal) => {
                const $gal = $(gal);
                const galObjs = Galleries[$gal.data('id')]
                if (galObjs) {
                    const { instance } = galObjs;
                    const serialized = instance.serialize();
                    // escape quote mark. TODO: move this to serialization function
                    serialized.title = escStr(serialized.title)
                    serialized.tagline = escStr(serialized.tagline)
                    if (serialized.images.length > 0) {
                        serialized.images.forEach(img => { img.caption = escStr(img.caption) })
                    }
                    // json
                    const json = JSON.stringify(serialized);
                    $gal.replaceWith(getShortcodeString(json));
                } else {
                    
                }
            });
        }
    },
    transformFancyArticleProduct(wrapped) {
        const $cards = wrapped.find('.itemList');
        $cards.each((i, e) => {
            const products = [];
            const $card = $(e);
            $card.find('.itemListElement').each((i, e) => {
                products.push($(e).attr('data-id'));
            });
            const json = JSON.stringify({ name: 'fancy-article-product', products });
            $card.replaceWith(getShortcodeString(json));
        })
    },
    transformFancyArticleProductSlideshow(wrapped) {
        const $slideshows = wrapped.find('.itemSlide');
        $slideshows.each((i, e) => {
            const products = [];
            const $slideshow = $(e);
            $slideshow.find('.itemSlideElement').each((i, e) => {
                products.push($(e).attr('data-id'));
            });
            const json = JSON.stringify({ name: 'fancy-article-product-slideshow', products });
            $slideshow.replaceWith(getShortcodeString(json));
        })
    },
    cleanupContent(wrapped) {
        // Wipe out empty <div>s - possibly moved gallery, image, etc.
        wrapped.children()
            .filter((i, e) => {
                if (e.tagName === 'DIV' &&
                    e.className === '' &&
                    $(e).text().trim() === ''
                ) {
                    return true;
                }
            }).remove();
        // Remove first hollow paragraph if exist.
        const fp = wrapped.children().first();
        if (fp.attr('class') == null && fp.text().trim() === '') {
            fp.remove();
        }
    }
};
// FIXME: refactor to class
ShortCodeReverseTransformers.transformFancyArticleImage = reverseTransformerWrapper(ShortCodeReverseTransformers.transformFancyArticleImage)
ShortCodeReverseTransformers.transformFancyArticleGallery = reverseTransformerWrapper(ShortCodeReverseTransformers.transformFancyArticleGallery)
ShortCodeReverseTransformers.transformFancyArticleProduct = reverseTransformerWrapper(ShortCodeReverseTransformers.transformFancyArticleProduct)
ShortCodeReverseTransformers.transformFancyArticleProductSlideshow = reverseTransformerWrapper(ShortCodeReverseTransformers.transformFancyArticleProductSlideshow)
ShortCodeReverseTransformers.cleanupContent = reverseTransformerWrapper(ShortCodeReverseTransformers.cleanupContent)
