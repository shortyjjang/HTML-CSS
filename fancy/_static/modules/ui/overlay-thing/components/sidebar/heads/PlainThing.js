import React, { Component } from 'react';

import SidebarOwner from '../owner';
import ActionButtons from '../action-buttons';
import { getSafeNameProp } from '../../map';
import { Keys } from '../../Perf';


export default class PlainThing extends Component {
    render() {
        var { thing } = this.props;
        return (
            <div key={Keys.Sidebar.Wrap}>
                <div className="wrapper figure-info" key={Keys.Sidebar.Body}>
                    <h1 key={Keys.Sidebar.Title} className="title" {...getSafeNameProp(thing)} />
                    <p>This item is no longer available.</p>
                    <div className="frm" key={Keys.Sidebar.Form}>
                        <ActionButtons {...this.props} />
                    </div>
                </div>
                <SidebarOwner key={Keys.Sidebar.Owner} {...this.props} />
            </div>
        );
    }
}
