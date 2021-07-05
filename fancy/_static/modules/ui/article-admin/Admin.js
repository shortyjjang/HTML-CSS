import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Display } from 'fancymixin';

import Editor from './ReactMediumEditor';
import CoverImage from './CoverImage';
import Info from './Info';
import { GalleryControl } from './Gallery';
import { ThingCard, ThingCardPlaceholder } from './ThingCard';
import Status from './Status';
import { setArticleAdmin } from './ReactBridge';
import { attachExternalEvents, requestFeaturedItems } from './ExternalEventHandlers';
import { handleContentModificationOnInit, handleContentModificationOnSubmission } from './ArticleLifecycle';
import { applyProductSlide } from 'common-components';


const { creating } = window;

// https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

export default class ArticleAdmin extends React.Component {
    constructor(props) {
        super(props);
        const {
            article: {
                content, gallery, slug, published_datetime, is_active,
                options: { action_button, authors, item_header },
                tagline, title, thing_ids, featured,
                cover_image, cover_video,
            }
        } = props;

        this.state = {
            cover_image: cover_image ? cover_image : null,
            cover_video: cover_video ? cover_video : null,
            authors,
            slug,
            content,
            published_datetime: published_datetime ? published_datetime : null,
            is_active,
            gallery,
            tagline,
            title,
            thing_ids,
            item_header,
            // additional tracking state
            featured: featured,
            actionButtonText: action_button.text,
            actionButtonLink: action_button.link,
            remove_video: null,
            // component state
            saving: false,
            codeview: false,
        };
    }

    componentDidMount() {
        setArticleAdmin(this);
        $('.items ol.additional').sortable({ cancel: '.add', items:".item.photo", tolerance : 'intersect'});
        // Refresh internal `_content` prop via sending out change event.
        handleContentModificationOnInit(ReactDOM.findDOMNode(this));
        // finalize init
        window.EditorControl.refresh(() => {
            applyProductSlide();
        });
    }

    handleChange = (content, medium, callback = ()=>{}) => {
        const editor = medium || window.EditorControl.get();
        const _text = editor.serialize().editable.value; // Value to be submitted
        this.setState({ content }, callback);
        this._content = _text;
    }

    handleCodeviewChange = (event) => {
        const nextValue = event.target.value;
        this.setState({ content: nextValue });
        this._content = nextValue;
    }

    setArticleProp = (key, value) => {
        if (key.indexOf('.') === -1) {
            this.setState({ [key]: value });
        } else { // when key is `objectName.propertyName`
            const split = key.split('.');
            if (split.length > 2) {
                console.warn('indexing is supported for direct object access only')
            }
            const [objectName, propertyName] = split;
            const copy = _.extend({}, this.state[objectName]);
            copy[propertyName] = value;
            this.setState({ [objectName]: copy });
        }
    }

    convertToSerialized() {
        const {
            authors,
            slug,
            is_active,
            gallery,
            tagline,
            title,
            published_datetime,
            // Need processing
            cover_image,
            cover_video,
            thing_ids,
            actionButtonText,
            actionButtonLink,
            remove_video,
            item_header,
        } = this.state;

        const originalArticle = window.article;
        const { article_id } = originalArticle;
        const preSerializedContent = handleContentModificationOnSubmission(this._content);
        const content = Base64.encode(preSerializedContent);
        const serialized = _.extend({
            authors,
            slug,
            is_active,
            gallery,
            tagline,
            title,
        }, {
            thing_ids: thing_ids.join(','),
            article_id,
            content,
            action_button_text: actionButtonText,
            action_button_link: actionButtonLink,
        });

        if (cover_image) {
            serialized.cover_image_url = cover_image.url;
        }

        if (cover_video) {
            serialized.video_id = cover_video.id;
            serialized.video_loop = cover_video.loop;
            serialized.video_autoplay = cover_video.autoplay;
        // `cover_video` is removed and `remove_video` flag is set - the purpose is make sure video is not removed by mistake
        } else if (remove_video) {
            serialized.remove_video = true;
        }

        if (this.state.featured &&
            +new Date(published_datetime) // is not NaN?
        ) {
            serialized.published_datetime = published_datetime;
        } else if (this.state.featured === false) {
            serialized.published_datetime = '';
        }

        if (item_header != null && typeof item_header === 'string') {
            serialized.item_header = item_header.trim()
        }
        return serialized;
    }

    handleSubmission = () => {
        this.submitArticle();
    }

    submitArticle = (publishing) => {
        // Serialize image, gallery into shortcodes.
        const serialized = this.convertToSerialized();
        if (publishing === true) {
            serialized.is_active = true
        } else if (publishing === false) {
            serialized.is_active = false
        }
        this.setState({ saving: true }, () => {
            if (creating) {
                $.post('/_admin/articles/create.json', serialized, ({ error, message, aid }) => {
                    let saving = false;
                    if (error) {
                        alertify.alert(error);
                    } else {
                        saving = true;
                        let onComplete = () => { confirmedRedirect(`/_admin/articles/edit?id=${aid}${window.isWhitelabelV2 ? '&v2' : ''}`); };
                        if (message) {
                            alertify.alert(message, onComplete);
                        } else {
                            onComplete();
                        }
                    }
                    if (saving === false) {
                        this.setState({ saving: false });
                    }
                });
            } else {
                $.post('/_admin/articles/update.json', serialized, ({ error, message }) => {
                    let saving = false;
                    if (error) {
                        alertify.alert(error);
                    } else {
                        saving = true;
                        let onComplete = () => { confirmedReload(); };
                        if (message) {
                            alertify.alert(message, onComplete);
                        } else {
                            onComplete();
                        }
                    }
                    if (saving === false) {
                        this.setState({ saving: false });
                    }
                });
            }
        })
    }

    handleDeleteThing = event => {
        event.preventDefault();
        $(this).closest('li').remove();
    }

    handleAddThing = event => {
        event.preventDefault();
        $.dialog('add_thing_item').open();
        requestFeaturedItems(null, true);
    }

    updateThingIds(addingTids) {
        const { thing_ids } = this.state;
        const nextThingIds = thing_ids.concat(addingTids.filter(tid => _.indexOf(thing_ids, tid) === -1));
        this.setState({ thing_ids: nextThingIds });
    }

    handleToggleDeveloperMode = () => {
        this.setState({ isDeveloperMode: !this.state.isDeveloperMode });
    }

    handlePreview = () => {
        if (!creating) {
            window.open(`/articles/${this.state.slug}?preview${window.isWhitelabelV2 ? '&v2' : ''}`);
        }
    }

    handleThingCardRemove = (thingId) => {
        this.setState({ thing_ids: this.state.thing_ids.filter(tid => tid !== thingId) })
    }

    handleItemHeaderChange = () => {
        this.setState({ item_header: event.target.value })
    }

    handleDraftAction = () => {
        this.submitArticle(false)
    }

    handlePublish = () => {
        this.submitArticle(true)
    }

    render() {
        const {
            authors,
            actionButtonText,
            actionButtonLink,
            cover_image,
            cover_video,
            is_active,
            item_header = '',
            featured,
            slug, title,
            tagline,
            thing_ids,
            codeview,
            saving,
            published_datetime
        } = this.state;

        const placeholdersLength = (4 - thing_ids.length % 4) - 1;
        const placeholders = [];
        for (let i = 0; i < placeholdersLength; i++) {
            placeholders.push(<ThingCardPlaceholder key={i} />)
        }

        const info = <Info setArticleProp={this.setArticleProp} authors={authors} title={title} tagline={tagline}
        actionButtonText={actionButtonText} actionButtonLink={actionButtonLink} />;
        const coverImage = <CoverImage setArticleProp={this.setArticleProp} cover_image={cover_image} cover_video={cover_video} />

        return (
        <div className={window.isWhitelabel ? "_whitelabel whitelabel-article" : null}>
            <h2 className="ptit embo">
                <a href="/_admin/articles">Articles</a> <span className="arrow">&gt;</span> <b>{creating ? 'New Article' : 'Edit Article'}</b>
            </h2>
            {window.isWhitelabelV2 &&
                <span className={classnames("status", { live: is_active})}>{is_active ? "This article is live on Gear.com" : "This article is a draft and is not visible on Gear.com"}</span>
            }
            <div id="summary" className="wrapper article-wrapper">
                {window.isWhitelabelV2 ? null : <Status codeview={codeview} featured={featured} is_active={is_active} slug={slug} setArticleProp={this.setArticleProp} published_datetime={published_datetime} />}
                {window.isWhitelabelV2 ? info : coverImage}
                {window.isWhitelabelV2 ? coverImage : info}
                <textarea id="editable-codeview" style={Display.NoneIf(!codeview)} value={this.state.content} onChange={this.handleCodeviewChange} />
                <Editor style={Display.NoneIf(codeview)}
                        className="description more"
                        id="editable"
                        content={this.state.content}
                        onChange={this.handleChange} />
            </div>
            {window.isWhitelabelV2 ? null : 
                <div className="wrapper-content thing-stream-wrapper">
                    <div id="content">
                        {!window.isWhitelabel && <input className="item_header" type="text" value={item_header} onChange={this.handleItemHeaderChange} placeholder="Type Item Header..." />}
                        <ol className="stream after">
                        {thing_ids.map(tid => <ThingCard key={tid} tid={tid} onRemove={this.handleThingCardRemove} />)}
                        <li>
                            <div className="figure-item add">
                            <input type="file" onClick={this.handleAddThing}/>
                            </div>
                        </li>
                        {placeholders}
                        </ol>
                    </div>
                </div>
            }
            <div className="btn-area">
              {/*<button className="btns-gray-embo" onClick={this.handleCancel}>Discard</button>*/}
              {window.isWhitelabelV2 && <button className={classnames("btns-gray-embo", { disabled: saving })} onClick={this.handleDraftAction} disabled={saving}>{(creating || !is_active) ? "Save Draft" : "Set as Draft"}</button>}
              {!creating && <button className="btns-gray-embo" onClick={this.handlePreview}>Preview</button>}
              {!window.isWhitelabelV2 && <button className={classnames("btns-blue-embo", { disabled: saving })} onClick={this.handleSubmission} disabled={saving}>Save Changes</button>}
              {window.isWhitelabelV2 && <button className={classnames("btns-green-embo", { disabled: saving })} onClick={this.handlePublish} disabled={saving}>{(creating || !is_active) ? "Publish" : "Update"}</button>}
            </div>
        </div>
        );
    }
}

$(async () => {
    attachExternalEvents();
    window.GalleryControl = GalleryControl;

    await import('./MediumEditorInsertPluginFancy');
    window.articleAdmin = ReactDOM.render(<ArticleAdmin article={window.article} />, document.querySelector('.container-2'));
    $(window).on('beforeunload', function (e) {
        var msg = 'Are you sure you want to leave this page? Your changes may not be saved.'
        e.returnValue = msg
        return msg
    })
});


function confirmedRedirect(targetLocation) {
    $(window).off('beforeunload')
    location.href = targetLocation
}

function confirmedReload() {
    $(window).off('beforeunload')
    location.reload()
}
