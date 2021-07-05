import React, { Component, lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { MoreShare, Video } from "common-components";
import { isStaticArticlePage } from "fancyutils";
import dateFormat from 'date-fns/format';

import { historyData } from "../container/history";
import { FancydUsers } from "./ArticleFancydUsers";
import { OaContainer } from "../container/entry-events";
import { AdminHeader, ArticleList, ThingList, initGallery } from "./ArticleWidgets";
import "../Shortcode";
import { applyProductSlide } from 'common-components';


function mapStateToProps(state) {
    var { appContext, article: { data, isFetching, status } } = state;

    if (data && data.content && window.convertArticleShortcode) {
        data.content = window.convertArticleShortcode(data.content);
    }

    return {
        appContext,
        status,
        article: data,
        isFetching
    };
}
const Lightbox = lazy(() => import(/* webpackChunkName: "OverlayArticle" */'react-images'));

// Container class for overlayed article detail.
export class OverlayArticle extends Component {
    componentDidMount() {
        OaContainer.scrollToTop();
        applyProductSlide();

        // fitvids 1.2.0
        !function(t){t.fn.fitVids=function(e){var i={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var r=document.head||document.getElementsByTagName("head")[0],a=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",d=document.createElement("div");d.innerHTML='<p>x</p><style id="fit-vids-style">'+a+"</style>",r.appendChild(d.childNodes[1])}return e&&t.extend(i,e),this.each(function(){var e=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];i.customSelector&&e.push(i.customSelector);var r=".fitvidsignore";i.ignore&&(r=r+", "+i.ignore);var a=t(this).find(e.join(","));a=a.not("object object"),a=a.not(r),a.each(function(){var e=t(this);if(!(e.parents(r).length>0||"embed"===this.tagName.toLowerCase()&&e.parent("object").length||e.parent(".fluid-width-video-wrapper").length)){e.css("height")||e.css("width")||!isNaN(e.attr("height"))&&!isNaN(e.attr("width"))||(e.attr("height",9),e.attr("width",16));var i="object"===this.tagName.toLowerCase()||e.attr("height")&&!isNaN(parseInt(e.attr("height"),10))?parseInt(e.attr("height"),10):e.height(),a=isNaN(parseInt(e.attr("width"),10))?e.width():parseInt(e.attr("width"),10),d=i/a;if(!e.attr("name")){var o="fitvid"+t.fn.fitVids._count;e.attr("name",o),t.fn.fitVids._count++}e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*d+"%"),e.removeAttr("height").removeAttr("width")}})})},t.fn.fitVids._count=0}(window.jQuery||window.Zepto);

        $('.media-youtube').fitVids();
    }

    componentDidUpdate(prevProps) {
        const pt = prevProps.article;
        const ct = this.props.article;

        if (ct != null) {
            if (!pt || pt.id !== ct.id) {
                if (!isStaticArticlePage()) {
                    $("#overlay-article > .popup").attr("tabindex", -1).focus();
                }
                OaContainer.scrollToTop();
            }

            if (this.props.appContext.viewer.is_admin_senior) {
                $("body").addClass("admin");
            } else {
                $("body").removeClass("admin");
            }
        }
    }

    render() {
        const { article, appContext: { viewer } } = this.props;

        var display = null;
        if (historyData.locationIsArticlePage) {
            if (article != null) {
                display = (
                    <div>
                        {viewer.is_admin_senior && <AdminHeader {...this.props} />}
                        <Article {...this.props} />
                        <div className={"container"}>
                            <ThingList {...this.props} hasPagination={window.isWhitelabel} />
                            <ArticleList {...this.props} />
                        </div>
                    </div>
                );
            } else {
                display = <div />;
            }
        } else {
            display = <div />;
        }

        return display;
    }
}

export default connect(mapStateToProps)(OverlayArticle);

class Article extends Component {
    state = {
        lightboxImages: [],
        lightboxOpen: false,
    }
    constructor(props) {
        super(props);
        if ($("#article-fonts").length === 0) {
            $(document.head).append(
                '<link rel="stylesheet" id="article-fonts" href="//fonts.googleapis.com/css?family=Merriweather:300,300i,400,400i,700,700i,900,900i|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i|Merriweather+Sans:300,300i,400,400i,700,700i,800,800i" type="text/css" />'
            );

            if ($("body").is(".static-article")) {
                $("#container-wrapper #scroll-to-top").hide();
            }
        }
    }

    componentDidMount() {
        // Initial loading
        initGallery(ReactDOM.findDOMNode(this));
        if (window.isWhitelabelV2) {
            setTimeout(() => {
                $('.itemSlide.product').productSlide({ itemPerSlide: 4, center: true });
            }, 2500);
        }
    }

    handleGalleryClick = (event) => {
        var $this = $(event.target);
        if (window.isWhitelabelV2) {
            if ($this.is(".gallery .paging a")) {
                event.preventDefault();
                const $gallery = $this.closest(".gallery");
                const $paging = $gallery.find(".paging");
                const len = $gallery.find('.paging a.pager').length;
                const galleryNth = $('.gallery').index($this.closest(".gallery"));
                const indexSelector = `.gallery:eq(${galleryNth}) .paging a.pager`

                let idx;
                let incdec = 0
                if ($this.is(".btn .prev")) {
                    idx = $gallery.find('.paging a.pager.current').index(indexSelector);
                    incdec = -1
                } else if ($this.is(".btn .next")) {
                    idx = $gallery.find('.paging a.pager.current').index(indexSelector);
                    incdec = +1
                } else {
                    idx = $this.index(indexSelector);
                }
                idx += incdec;
                if (idx < 0) {
                    idx = len - 1
                } else if (idx >= len - 1) {
                    idx = 0
                }
                $paging
                    .find("a.current").removeClass("current").end()
                    .find(`a.pager:eq(${idx})`).addClass("current");
                $gallery
                    .find("li.active").removeClass("active").end()
                    .find(`li:eq(${idx})`).addClass("active");
            } 
        } else {
            if ($this.is(".gallery .paging a, .gallery li *")) {
                if ($this.is(":not(.gallery li a.linked, .gallery li a.linked *)")) {
                    event.preventDefault();
                }
                if ($this.is(".gallery li *")) {
                    $this = $this.closest("li");
                }
    
                var $gallery = $this.closest(".gallery");
                var $paging = $gallery.find(".paging");
    
                var idx = $this.index();
                $paging.find("a.current").removeClass("current").end().find("a:eq(" + idx + ")").addClass("current");
                $gallery.find("li.active").removeClass("active").end().find("li:eq(" + idx + ")").addClass("active");
                var left = 0;
                if (idx == 0) {
                    left = 0;
                } else if (idx == $gallery.find("li").length - 1) {
                    left = $gallery.width() - $gallery.find(".photo-list").width();
                } else {
                    left =
                        ($gallery.width() - $gallery.find("li:eq(" + idx + ")").width()) / 2 -
                        $gallery.find("li:eq(" + idx + ")").position().left;
                }
                $gallery.find(".photo-list").css("left", left + "px");
            }
        }
    }

    prepareProductSlide = (event, $this) => {
        var $slide = $this.closest('.product');
        if ($slide.data('slideInit')) {
            event.preventDefault();
        } else {
            $slide.productSlide({ itemPerSlide: 4, center: true })
            setTimeout(() => {
                $this.click();
            }, 500);
        }
    }

    handleContentClick = (event) => {
        var $this = $(event.target);
        if ($this.is(".gallery *")) {
            this.handleGalleryClick(event);
        } else if ($this.is(".description .grid")) {
            this.prepareLightboxOpen();
        } else if ($this.is('.itemSlide .prev, .itemSlide .next')) {
            this.prepareProductSlide(event, $this);
        }
    }

    // lightbox stuff
    prepareLightboxOpen() {
        this.setState({
            lightboxOpen: true,
            lightboxCurrentImage: 0,
            lightboxImages: $('.grid img').toArray().map((e) => ({ src: $(e).data('src')}) ),
        });
    }

    handleClickPrev = () => {
        this.setState({ lightboxCurrentImage: Math.max(this.state.lightboxCurrentImage - 1, 0) });
    }

    handleClickNext = () => {
        this.setState({ lightboxCurrentImage: Math.min(this.state.lightboxCurrentImage + 1, this.state.lightboxImages.length - 1) });
    }

    handleClose = () => {
        this.setState({ lightboxOpen: false });
    }

    handleClickThumbnail = (idx) => {
        this.setState({ lightboxCurrentImage: idx })
    }

    render() {
        const { appContext: { lastFullyRenderedArticleID, viewer, loggedIn }, article } = this.props;

        let video;
        let coverImgUrl = '';
        if (article.cover_image) {
            coverImgUrl = article.cover_image.url;
        }
        if (Video.isVideoAvailableForArticle(article)) {
            const videoProps = {
                object: article,
                display: true,
                autoplay: article.cover_video.autoplay || false,
                lastFullyRenderedObjectID: lastFullyRenderedArticleID,
            };
            if (coverImgUrl) {
                videoProps.poster = coverImgUrl;
            }
            video = <Video {...videoProps} />;
        }

        const coverImage = (
            <div className="inner-wrapper">
                <div id="coverImage" className="cover image purple">
                    {video}
                    {!video &&
                        <div className="image">
                            <img id="coverImg" src={coverImgUrl} />
                        </div>}
                </div>
            </div>
        );

        const author = (
            article.options &&
            article.options.authors &&
            <div className="author" dangerouslySetInnerHTML={{ __html: article.options.authors }} />
        );

        return (
            <div id="summary" className="wrapper article-wrapper">
                {!window.isWhitelabelV2 && coverImage}
                {/*floatingVideo*/}
                <div className="info">
                    <h1 className="title"><b>{article.title}</b> <small>{article.tagline}</small></h1>
                    {window.isWhitelabelV2 && author}
                    {window.isWhitelabelV2 && article.date_created &&
                        <div className="date text-placeholder">{
                            dateFormat(article.date_created || new Date, 'MMMM DD, YYYY')
                        }</div>
                    }
                    {window.isWhitelabel ? null : <FancydUsers {...this.props} />}
                    <div className="interaction">
                        <MoreShare objectType="article" objectId={article.id} loggedIn={loggedIn} title={article.title}
                                       viewerUsername={viewer.username} showShortcuts={true} fromThingSidebar={true} />
                        {article.options &&
                            article.options.action_button &&
                            (_.isString(article.options.action_button.text) &&
                                article.options.action_button.text.trim()) &&
                            <a href={`${article.options.action_button.link}`} className="btn-shop">
                                {article.options.action_button.text}
                            </a>}
                        {window.isWhitelabel ? <FancydUsers {...this.props} /> : null}
                    </div>
                </div>
                {window.isWhitelabelV2 && coverImage}
                <div className="description more">
                    {!window.isWhitelabelV2 && author}
                    <div dangerouslySetInnerHTML={{ __html: article.content }} onClick={this.handleContentClick} />
                </div>
                {window.isWhitelabelV2 && 
                    <Suspense fallback={<div />}>
                        <Lightbox 
                            fallback={<div />}
                            images={this.state.lightboxImages}
                            isOpen={this.state.lightboxOpen}
                            preventScroll={true}
                            showThumbnails={true}
                            currentImage={this.state.lightboxCurrentImage}
                            onClickPrev={this.handleClickPrev}
                            onClickNext={this.handleClickNext}
                            onClose={this.handleClose}
                            onClickThumbnail={this.handleClickThumbnail}
                        />
                    </Suspense>
                }
            </div>
        );
    }
}
