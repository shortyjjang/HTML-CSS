import React, { Component } from 'react';

import { closeOverlay } from '../action/action-helpers';
import store from '../store/store';
import { historyHook } from './history';


class App extends Component {
    handleCloseArticle(event) {
        event.preventDefault();
        event.stopPropagation();
        store.dispatch(closeOverlay());
    }

    render() {
        return (
            <div className={`popup article ${window.isWhitelabel ? 'whitelabel-article' : ''} ${window.isWhitelabelV2 ? 'whitelabel-article-v2' : ''}`} id="article-container">
                {this.props.children}
                <a href="#" className="ly-close" onClick={this.handleCloseArticle}>Close</a>
            </div>
        );
    }
}

export default App;
