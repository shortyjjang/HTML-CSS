// This is entrypoint, which `React.render` takes place after DOM is ready.
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import { history } from "common-components";

import OverlayThing from "./components/v2"

import { attachEntryEvents } from "./container/entry-events";
import { pagingContext } from "./container/routeutils";
import store from "./store/store";
import { historyHook } from "./container/history";

if (__Config.bugsnag) {
    Bugsnag.start({
        apiKey: "a54d48e98cb0410b7bdf0e60a905b00e",
        plugins: [new BugsnagPluginReact()],
        user: {
            id: window.__FancyUser?.id || undefined
        },
    });
}

const onLoad = () => {
    require("./Shared");

    const overlayContainer = document.querySelector("#container-wrapper .container")
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

    const ErrorBoundary = __Config.bugsnag ? Bugsnag.getPlugin("react")!.createErrorBoundary(React) : React.Fragment;

    const tree = (
        <ErrorBoundary>
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <Route path="/things/*">
                            <OverlayThing />
                        </Route>
                        <Route path="*" component={() => null} />
                    </Switch>
                </Router>
            </Provider>
        </ErrorBoundary>
    );

    render(tree, overlayContainer, () => {
        history.listen(historyHook);
        historyHook({ pathname: location.pathname, search: location.search }); // should init once
        attachEntryEvents();
        pagingContext.init();
    });
};

if (document.readyState !== "loading") {
    onLoad();
} else {
    document.addEventListener("DOMContentLoaded", onLoad);
}
