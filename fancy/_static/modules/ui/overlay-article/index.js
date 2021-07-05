// This is entrypoint, which `React.render` takes place after DOM is ready.
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { selectOrCreate } from "fancyutils";
import { history } from 'common-components';

import App from "./container/app";
import { attachEntryEvents } from "./container/entry-events";
import store from "./store/store";
import OverlayArticle from "./components/article";
import { historyHook } from "./container/history";


const onLoad = () => {
    require("./shared");

    const thingRegex = /\/(sales|things)\/(\d+)/;
    const articleRegex = /\/articles\/(.+)/;
    const initialHref = location.href;

    $(window).on("popstate.overlay", function(event) {
        if (
            location.href !== initialHref &&
            !(location.pathname.match(thingRegex) || location.pathname.match(articleRegex))
        ) {
            event.preventDefault();
            location.reload();
        }
    });

    const overlayArticleContainer = selectOrCreate("#overlay-article");
    const $overlayArticleContainer = $(overlayArticleContainer);
    if ($overlayArticleContainer.hasClass('seo')) {
        $overlayArticleContainer.empty();
        $overlayArticleContainer.removeClass('seo');
    }
    render(
        <Provider store={store}>
            <Router history={history}>
                <App>
                    <Switch>
                        <Route path="/articles/*" component={OverlayArticle} />
                        <Route path="*" component={() => null} />
                    </Switch>
                </App>
            </Router>
        </Provider>,
        overlayArticleContainer,
        () => {
            history.listen(historyHook);
            historyHook({ pathname: location.pathname, search: location.search }) // should init once
            attachEntryEvents();
        }
    );
}

if (document.readyState !== "loading") {
    onLoad();
} else {
    document.addEventListener("DOMContentLoaded", onLoad);
}
