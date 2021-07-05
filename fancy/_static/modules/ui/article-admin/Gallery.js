import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import autosize from 'autosize';
import { sortable } from 'react-sortable';

import { triggerEvent } from 'fancyutils';



function move(array, fromIndex, toIndex) {
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0] );
    return array;
}

window.onerror = function(messageOrEvent, source, lineno, colno, error) {
    alert(`${messageOrEvent} - line:${lineno} col:${colno} error:${error}`);
}
const Galleries = {};
window.Galleries = Galleries;
export class GalleryControl {
    container = null;
    $container = null;
    instance = null;
    id = null;
    data = { images: [], title: "", tagline: "" };
    constructor(data) {
        if (data) {
            this.data = data;
        }
        this.id = ('' + Math.random()).substr(2, 10);
        const $conatinerEl = $(`<div class="gallery-container" style="display:none;" data-id="${this.id}"/>`)
        $('.gallery-container-pool').append($conatinerEl);
        this.$container = $conatinerEl;
        this.container = this.$container[0];
    }

    render(callback) {
        const ctl = this;
        const instance = ReactDOM.render(<Gallery {...this.data} control={this} />, this.container, function (...args) {
            ctl.instance = this;
            Galleries[ctl.id] = { instance: this, control: ctl }
            callback(...args)
        });
        ctl.instance = instance;
    }

    processGallery() {
        // If inserted already, remove existing container
        const $ct = $(this.container);
        // prevent modification on container textnode
        const $galleryWrapper = $ct.closest('.description.more > div');
        $galleryWrapper
            .attr('contenteditable', 'false')
            .addClass('gallery-container-wrapper');
        $galleryWrapper.find('br').remove();
    }

    setData(data, callback) {
        if (data) {
            this.instance.setState(data, callback);
        } else {
            callback();
        }
    }

    getDOM() {
        if (this.instance) {
            return ReactDOM.findDOMNode(this.instance);
        }
    }
    setState(nextState) {
        if (this.instance) {
            this.instance.setState(nextState);
        }
    }
    revert() {
        if (this.container) {
            $(this.container).hide();
            $(this.container).insertAfter($('#article-container'));
            window.EditorControl.refresh();
            $('.add_option_tools .gallery-insert-action').css('display', 'block');
        }
    }

    // static renderToReplace(target, data, callback) {
    static renderTo(target, data, callback) {
        const control = new GalleryControl(data);
        const $targ = $(target);
        const id = `shortcode-${control.id}`;
        $targ.attr('id', id);

        control.render(() => {
            const $ct = $(control.container);
            control.setData(data, _ => {
                const $targ2 = $(`#${id}`);
                $targ2.replaceWith($ct);
                control.processGallery();
                $ct.show();
                callback && callback(control);
                // set cursor next and set medium-insert-active
                const an = document.getSelection().anchorNode;
                const anWrapper = $(an).closest('p');
                anWrapper.click();
            });

            if (!window.isWhitelabelV2) {
                $('.add_option_tools .gallery-insert-action').hide();
            }
        });
        return control
    }

    static uploadImages(callback) {
        var $file = $('#image-fileupload');
        if ($file.length === 0) {
            $file = $('<input id="image-fileupload" type="file" multiple style="opacity:0.01;" />');
            $(document.body).append($file);
        }
        $file.one('change', function() {
            console.log('change');
            var files = [].slice.call($file.get(0).files);
            Promise.all(
                files.map(file =>
                    new Promise(function(res, rej){ 
                        const formData = new FormData();
                        formData.append('file', file);
                        $.ajax({
                            url: '/_admin/image-upload-add.json',
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            data: formData,
                        })
                        .done((image) => {
                            console.log('done');
                            res(image);
                        })
                        .fail(jqxhr => {
                            alert('[Gallery] : addimage fail', jqxhr.responseText);
                            res();
                        });
                    })
                )
            ).then((nextImages) => {
                callback(nextImages)
            }).catch((jqxhr) => {
                console.log('failure', jqxhr)
                callback(false)
            });
        });
        $file.one('click', function() {
            $(this).val(null)
        });
        $file.click();
    }
}

export class Gallery extends React.Component {
    state = {
        draggingIndex: null,
        loaderPx: null,
        paging: 0,
        images: [],
    };

    constructor(props) {
        super(props);
        const { control } = props;
        this.control = control;
    }

    componentDidMount() {
        const { images , title, tagline } = this.props;
        this.setState({
            images: images || [],
            title: title || '',
            tagline: tagline || '' 
        });
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleTaglineChange = (event) => {
        this.setState({ tagline: event.target.value });
    }

    handleRemove(event) {
        this.control.revert();
    }

    serialize() {
        const { images, title, tagline } = this.state;
        return {
            name: 'fancy-article-gallery',
            images,
            title,
            tagline
        };
    }

    toggleAdding(nextAddingState) {
        this.adding = nextAddingState;
        this.setState({ adding: nextAddingState });
    }

    loading = false;
    toggleLoading(nextLoadingState, callback = _=>_) {
        this.loading = nextLoadingState;
        this.setState({ loading: nextLoadingState }, callback);
    }
    
    addImages(nextImages) {
        const { images } = this.state;
        const newImages = images.map(e => e); // introduce new container
        nextImages.forEach(({ image_url, id, width, height }) => {
            if (width == null || height == null) {
                alert(`[warning] ${id}: There is possibility that the image is not uploaded correctly, or uploaded one is not an image.`)
            } else {
                newImages.push({ uiid: id, src: image_url, caption: '' });
            }
        });
        this.setState({ images: newImages });
    }

    handleAddImage = (event) => {
        const files = [].slice.call(event.target.files);
        if (files.length > 0) {
            this.toggleLoading(true, () => {
                Promise.all(
                    files.map(file =>
                        new Promise(function(res, rej){ 
                            const formData = new FormData();
                            formData.append('file', file);
                            $.ajax({
                                url: '/_admin/image-upload-add.json',
                                processData: false,
                                contentType: false,
                                type: 'POST',
                                data: formData,
                                xhr: this.createXhr
                            })
                            .done((image) => {
                                res(image);
                            })
                            .fail(jqxhr => {
                                alert('[Gallery] : addimage fail', jqxhr.responseText);
                                rej();
                            });
                        })
                    )
                ).then((nextImages) => {
                    this.addImages(nextImages);
                    this.toggleLoading(false);
                    this.toggleAdding(false);
                }).catch(() => {
                    this.toggleLoading(false);
                    this.toggleAdding(false);
                })
            });
        }
    };

    // loading animation

    baseLoaderPx = -132;
    handleProgress = (loaded, total) => {
        const loaderPx = this.baseLoaderPx + -this.baseLoaderPx * loaded / total;
        this.setState({ loaderPx });
    }

    reset = null;
    resetLoader = () => {
        if (this.reset) {
            return;
        }
        this.reset = setTimeout(_ => {
            this.setState({ loaderPx: 0 }, _ => {
                this.setState({ adding: false }, () => {
                    this.setState({ loaderPx: null });
                    this.reset = null;
                });
            });
        }, 300);
    }

    createXhr = () => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('load', this.resetLoader);
        xhr.upload.addEventListener('error', this.resetLoader);
        xhr.upload.addEventListener('abort', this.resetLoader);
        xhr.upload.addEventListener('progress', (e) => {
            this.handleProgress(e.loaded, e.total);
        }, false);
        return xhr;
    }
    // loding animation end

    handleAddImageClick = (event) => {
        if (!this.adding) {
            this.toggleAdding(true);
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    handleAddImageFocus = () => {
        if (this.adding && !this.loading) {
            this.toggleAdding(false);
        }
    }

    handlePagingClick = (event) => {
        const nextIdx = event.currentTarget.getAttribute('data-idx');
        this.setState({ paging: Number(nextIdx) });

        var $this = $(event.target);
        if($this.is(".gallery .paging a")){
            event.preventDefault();
            
            var $gallery = $this.closest(".gallery");
            var idx = $this.index();
            var left = 0;
            if(idx == 0){
                left = 0;
            }else if(idx == $gallery.find("li").length -1 ){
                left = $gallery.width() - $gallery.find(".photo-list").width() ;
            }else{
                left = ( $gallery.width() - $gallery.find("li:eq("+idx+")").width() )/2 - $gallery.find("li:eq("+idx+")").position().left
            }
            $gallery.find(".photo-list").css('left', left+"px");
        }
    };

    getPaging() {
        const { images } = this.state;
        return images ? _.range(0, images.length) : [0];
    }

    handleCaptionChange = (imageIndex, caption) => {
        const newImages = this.state.images.map(e => e);
        newImages[imageIndex].caption = caption;
        this.setState({ images: newImages });
    }

    handlePagingPrevNextClick = (event) => {
        let next;
        if (this.state.images.length === 0) {
            return;
        }
        const cls = event.currentTarget.className;
        if (cls === 'prev') {
            next = Math.max(this.state.paging - 1, 0)
            if (this.state.paging === next) {
                next = this.state.images.length - 1;
            }
        } else if (cls === 'next') {
            next = Math.min(this.state.paging + 1, this.state.images.length - 1);
            if (this.state.paging === next) {
                next = 0;
            }
        }
        var pagDom = $(this.galleryEl).find('.paging a.pager').eq(next).get(0);
        triggerEvent(pagDom, 'click');
    }

    /*handleImageMove = (imageIndex) => {
        const newImages = this.state.images.map(e => e);
        move(newImages, imageIndex, (imageIndex +1) % this.state.images.length);
        this.setState({ images: newImages });
    }*/

    handleImageRemoval = (imageIndex) => {
        const { paging, images } = this.state;
        const newImages = images.map(e => e);
        move(newImages, imageIndex, newImages.length - 1); // move element to last
        newImages.pop();
        const nextState = { images: newImages };
        if (paging < imageIndex) {
            // NOOP
        } else if (paging >= imageIndex) {
            // Removing last image
            if (paging === 0 && imageIndex === 0) {
                if (!window.isWhitelabelV2) {
                    $(this.photoList).css('left', 0);
                }
            }
            nextState.paging = Math.max(paging - 1, 0);
        }
        if (window.isWhitelabelV2 && newImages.length === 0) {
            this.control.revert();
        }
        this.setState(nextState);
    }

    handleImagePagingChange = (imageIndex) => {
        var pagDom = $(this.galleryEl).find('.paging a').eq(imageIndex).get(0);
        triggerEvent(pagDom, 'click');
    }

    handleImageLinkChange = (imageIndex, link) => {
        const newImages = this.state.images.map(e => e);
        newImages[imageIndex].link = link;
        this.setState({ images: newImages });
    }

    updateState = (obj) => {
        this.setState(obj);
    }

    handleAddImageClick2 = () => {
        window.GalleryControl.uploadImages((nextImages) => {
            if (nextImages) {
                this.addImages(nextImages);
            }
        });
    }

    handleMouseOverGallery = () => {
        if (window.isWhitelabelV2) {
            this.setState({ showToolbar: true })
        }
    }

    handleMouseOutGallery = () => {
        if (window.isWhitelabelV2) {
            this.setState({ showToolbar: false })
        }
    }

    handleRemoveSlideshow = () => {
        this.control.revert();
    }

    handleOrganizeImages = () => {
        const data = this.state.images.map(e => ({ url: e.src, id: e.uiid, caption: e.caption || '' }));
        organizeImageService.open(data, (changedImages) => {
            this.setState({ images: changedImages.map(e => ({ src: e.url, uiid: e.id, caption: e.caption })) })
        });
    }

    render() {
        const { adding, paging, images, title, tagline, draggingIndex, loading, showToolbar } = this.state;
        const loaderPx = (this.state.loaderPx != null) ? `${this.state.loaderPx}px` : null;
        return (
            <div className="gallery" ref={(element) => {this.galleryEl = element;}} onMouseOver={this.handleMouseOverGallery} onMouseOut={this.handleMouseOutGallery}>
                <h3>
                    <input type="text" placeholder="Type a Slideshow Title"
                           onChange={this.handleTitleChange} value={title} />
                    {!window.isWhitelabelV2 &&
                        <small className="tagline">
                            <input type="text" placeholder="Type a gallery tagline"
                                onChange={this.handleTaglineChange}
                                value={tagline} />
                        </small>
                    }
                </h3>
                <ul className="photo-list" ref={(element) => {this.photoList = element;}}>
                    {images.map((image, i) => <GalleryImage key={i}
                                                            items={images}
                                                            draggingIndex={draggingIndex}
                                                            onSortItems={this.updateState}
                                                            sortId={i}
                                                            outline="list"
                                                            childProps={{
                                                                image,
                                                                idx: i,
                                                                selected: paging === i,
                                                                onCaptionChange: this.handleCaptionChange,
                                                                onImageRemoval: this.handleImageRemoval,
                                                                onImagePagingChange: this.handleImagePagingChange,
                                                                onImageLinkChange: this.handleImageLinkChange,
                                                            }} />)}
                    <li>
                        <div className={classnames('add', { adding })}>
                            <i className="loader" style={{ backgroundPosition: loaderPx, display: (adding || loading) ? 'inline-block' : 'none' }} />
                            <input type="file" ref={(element) => {this.fileInput = element;}}
                                   onChange={this.handleAddImage}
                                   onClick={this.handleAddImageClick}
                                   onFocus={this.handleAddImageFocus}
                                   multiple={true} />
                        </div>
                    </li>
                    <li>
                        <div className="placeholder" />
                    </li>
                </ul>
                <div className="paging" style={{visibility: images.length > 1 ? 'visible' : 'hidden' }}>
                    {window.isWhitelabelV2 &&
                        <div className="btn">
                            <a className="prev" onClick={this.handlePagingPrevNextClick} />
                            <a className="next" onClick={this.handlePagingPrevNextClick} />
                        </div>}
                    {this.getPaging().map((e, i) =>
                        <a className={classnames('pager', { "current": i === paging })}
                        data-idx={i} key={i} onClick={this.handlePagingClick}>{i + 1}</a>
                    )}
                </div>
                {!window.isWhitelabelV2 && <a className="remove" onClick={this.handleRemove}>Remove</a>}
                {window.isWhitelabelV2 &&
                    <small className="add_option_tools" style={{display: showToolbar ? 'block' : 'none'}}>
                        <a onClick={this.handleAddImageClick2}>Add images</a>
                        <a onClick={this.handleOrganizeImages}>Organize images</a>
                        <a onClick={this.handleRemoveSlideshow}>Remove Slideshow</a>
                    </small>
                }
            </div>
        );
    }
}

class _GalleryImage extends React.Component {
    componentDidMount() {
        if (window.isWhitelabelV2) {
            autosize(this.ta1);
        }
    }

    handleCaptionChange = ({ target }) => {
        const { childProps: { idx, onCaptionChange } } = this.props;
        onCaptionChange(idx, target.value);
    }

    handleImageRemoval = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const { childProps: { idx, onImageRemoval } } = this.props;
        onImageRemoval(idx);
    }

    handlePagingClick = () => {
        if (window.isWhitelabelV2) {
            return
        }
        const { childProps: { idx, onImagePagingChange } } = this.props;
        onImagePagingChange(idx);
    }

    handleImageLinkChange = ({ target }) => {
        const { childProps: { idx, onImageLinkChange } } = this.props;
        onImageLinkChange(idx, target.value);
    }

    render() {
        const { childProps: { image, selected } } = this.props;
        const img = <img src={image.src} alt={image.caption} onClick={this.handlePagingClick} />
        return (
            <li {...this.props}
                data-uiid={image.uiid}
                className={selected ? 'active' : null}>
                <a>
                    {window.isWhitelabelV2 ?
                        <span className="figure">
                            {img}
                        </span> :
                        img
                    }
                    <span className="caption">
                        {window.isWhitelabelV2 ? 
                            <textarea type="text" placeholder="Type an image caption" value={image.caption} onChange={this.handleCaptionChange} ref={(element) => {this.ta1 = element;}} /> :
                            <input type="text" placeholder="Type an image caption" value={image.caption} onChange={this.handleCaptionChange} />
                        }
                    </span>
                    <span className="link">
                        <input type="text" placeholder="Type an image link" value={image.link} onChange={this.handleImageLinkChange}/>
                    </span>
                </a>
                <a className="remove" onClick={this.handleImageRemoval}>Remove</a>
            </li>
        );
    }
}

const GalleryImage = sortable(_GalleryImage);

class OrganizeImageService {
    constructor() {
        // attach events for popup
        $(document).ready(() => {
            $.dialog('organize_image').$obj
                .on('click', '.btn-cancel', () => {
                    this.cancel();
                })
                .on('click', '.btn-save', () => {
                    this.complete();
                });
        });
    }
    data = null;
    callback = null;
    open(data, callback) { // [{ id, url }]
        this.callback = callback;
        this.data = data;
        const tpl = _.template($('#popup-org-img-each').html().trim());

        const diag = $.dialog('organize_image');
        const $wrapper = diag.$obj.find('ol');
        $wrapper.empty();

        this.data.forEach((img) => {
            const $el = $(tpl(img));
            $el.data('img', img);
            $wrapper.append($el);
        });
        Sortable.create(diag.$obj.find('ol').get(0), { filter: '.remove', onFilter(evt) {
            var item = evt.item,
                ctrl = evt.target;
    
            if (Sortable.utils.is(ctrl, ".remove")) {  // Click on remove button
                $(item).remove();
            }
        } });

        diag.open();
    }

    cancel() {
        $.dialog('organize_image').close();
        this.clean();
    }

    complete() {
        const { callback } = this;
        callback(this.serialize());
        $.dialog('organize_image').close();
        this.clean();
    }

    serialize() {
        return $.dialog('organize_image').$obj.find('ol li').map((i, e) => $(e).data('img')).toArray();
    }

    clean() {
        this.data = null;
        this.callback = null;
    }
}
window.organizeImageService = new OrganizeImageService();
