import React, { Component } from "react";
import { MP } from "fancyutils";

import SidebarOwner from "../owner";
import ActionButtons from "../action-buttons";
import { getSafeNameProp } from "../../map";
import { Keys } from "../../Perf";


export default class LaunchApp extends Component {
    constructor(props) {
        super(props);
        this.state = { displayAppList: false };
    }

    handleAppListClick = () => {
        this.setState({ displayAppList: false });
    };

    handleDownloadClick = () => {
        this.setState({ displayAppList: true });
    };

    handleAppDownloadClick = external_app => {
        MP("Download App", {
            "thing id": this.props.thing.id,
            url: external_app.parameter1,
            app_type: external_app.parameter2
        });
    };

    getAppDownloadLabel(appType, appTypeOnly) {
        var ret;
        if (appTypeOnly) {
            switch (appType) {
                case "ios":
                    ret = "iOS";
                    break;
                case "itunes":
                    ret = "iTunes";
                    break;
                case "google_play":
                    ret = "Google Play";
                    break;
                case "android":
                    ret = "Android";
                    break;
                case "windows":
                    ret = "Windows Store";
                    break;
                case "windows_app":
                    ret = "Windows Store";
                    break;
                case "mac_app":
                    ret = "Mac App Store";
                    break;
                case "facebook_app":
                    ret = "Facebook App";
                    break;
                case "web_app":
                    ret = "Web App";
                    break;
                default:
                    ret = "";
                    break;
            }
        } else {
            appType;
            switch (appType) {
                case "ios":
                    ret = "Download on iOS";
                    break;
                case "itunes":
                    ret = "Download from iTunes Store";
                    break;
                case "google_play":
                    ret = "Download from Google Play";
                    break;
                case "android":
                    ret = "Download on Android";
                    break;
                case "windows":
                    ret = "Download from Windows Store";
                    break;
                case "windows_app":
                    ret = "Download from Windows Store";
                    break;
                case "mac_app":
                    ret = "Download from Mac App Store";
                    break;
                case "facebook_app":
                    ret = "Launch App";
                    break;
                case "web_app":
                    ret = "Launch App";
                    break;
                default:
                    ret = "Download";
                    break;
            }
        }
        return ret;
    }

    render() {
        var { thing, thing: { external_apps, metadata } } = this.props;
        var { displayAppList } = this.state;

        return (
            <div key={Keys.Sidebar.Wrap}>
                <div className="wrapper figure-info" key={Keys.Sidebar.Body}>
                    <h1 key={Keys.Sidebar.Title} className="title" {...getSafeNameProp(thing)} />
                    {metadata.category && metadata.category !== "Other" && <p className="price">{metadata.category}</p>}
                    <div className="description" key={Keys.Sidebar.Desc}>
                        <div>
                            {metadata.description && (
                                <div>
                                    {metadata.description}
                                    <br />
                                    <br />
                                </div>
                            )}
                            <small>
                                {gettext("Available on") + ' ' + external_apps.reduce((prev, next) => {
                                    var nextAppLabel = this.getAppDownloadLabel(next.parameter2, true);
                                    if (prev.length) return `${prev}, ${nextAppLabel}`;
                                    else return nextAppLabel;
                                }, "")}
                            </small>
                        </div>
                    </div>
                    <div className="frm" key={Keys.Sidebar.Form}>
                        <button className="btns-blue-embo" onClick={this.handleDownloadClick}>
                            {gettext("Download Now")}
                        </button>
                        <div
                            className="app-list"
                            onClick={this.handleAppListClick}
                            style={{ display: displayAppList ? "block" : "none" }}>
                            <ul>
                                {external_apps &&
                                    external_apps.map((external_app, idx) => (
                                        <li key={`external_app-${idx}`}>
                                            <a
                                                href={external_app.parameter1}
                                                className={external_app.parameter2}
                                                onClick={this.handleAppDownloadClick.bind(this, external_app)}
                                                target="_blank">
                                                {this.getAppDownloadLabel(external_app.parameter2)}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <ActionButtons {...this.props} />
                    </div>
                </div>
                <SidebarOwner key={Keys.Sidebar.Owner} {...this.props} />
            </div>
        );
    }
}
