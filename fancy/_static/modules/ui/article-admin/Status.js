import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Display } from 'fancymixin';


export default class Status extends React.Component {
    state = {
        showFeatured: false
    };
    handleSetFeatured = _ => {
        this.props.setArticleProp('featured', !this.props.featured);
    };

    handleSetLive = _ => {
        this.props.setArticleProp('is_active', !this.props.is_active);
    };

    handleToggleCodeview = event => {
        $('.description.more .medium-insert-buttons').remove();
        window.EditorControl.refresh();
        this.props.setArticleProp('codeview', !this.props.codeview);
    };

    handlePublishedDatetimeChange = event => {
        this.props.setArticleProp('published_datetime', event.target.value);
    };

    handlePublishedDatetimeChangeEnd = event => {
        this.props.setArticleProp('published_datetime', $.trim(event.target.value));
    };

    handleSlugChange = event => {
        this.props.setArticleProp('slug', $.trim(event.target.value));
    };

    handleFeaturedMouseOver = event => {
        this.over = true;
        if (!this.state.showFeatured) {
            console.debug('showFeatured true')
            this.setState({ showFeatured: true });
        }
    }

    showFeaturedTimer = null;
    handleFeaturedMouseOut = event => {
        this.over = false;
        if (this.state.showFeatured && this.showFeaturedTimer == null) {
            console.debug('showFeatured false')
            this.showFeaturedTimer = setTimeout(() => {
                if (this.over) {
                    this.showFeaturedTimer = null;
                    return;
                }
                this.setState({ showFeatured: false }, () => {
                    this.showFeaturedTimer = null;
                });
            }, 500);
        }
    }

    render() {
        const { codeview, featured, is_active, published_datetime } = this.props;
        return (
            <div className="status">
                <p className="url">
                    <span>{window.appRootUrl || `https://fancy.com`}/articles/</span>
                    <input type="text" className="text" placeholder="article-title" onChange={this.handleSlugChange}
                           value={this.props.slug} />
                </p>
                <ul>
                    <li><label>Code View</label> <button onClick={this.handleToggleCodeview} className={classnames('btn-switch', { on: codeview })}>ON/OFF</button></li>
                    <li className={classnames("nested", { 'show-featured': this.state.showFeatured })} onMouseOver={this.handleFeaturedMouseOver} onMouseOut={this.handleFeaturedMouseOut}>
                        <div className="featured-control has-arrow" style={Display.NoneIf(!featured)}><input type="text" className="text" value={published_datetime} onChange={this.handlePublishedDatetimeChange} onBlur={this.handlePublishedDatetimeChangeEnd} /></div>
                        <label>Featured</label> <button onClick={this.handleSetFeatured} className={classnames('btn-switch', { on: featured })}>ON/OFF</button>
                    </li>
                    <li><label>Live</label> <button onClick={this.handleSetLive} className={classnames('btn-switch', { on: is_active })}>ON/OFF</button></li>
                </ul>
            </div>
        );
    }
}
