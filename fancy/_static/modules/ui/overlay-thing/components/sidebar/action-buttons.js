import React, { Component } from 'react';
import { MoreShareFacade } from 'common-components';

import { getThingName } from '../map';
import { FancydUsers } from '../FancydUsers';


export default class ActionButtons extends Component {
    render() {
        const {
            appContext: { loggedIn, viewer },
            thing,
        } = this.props;

        return (
            <div className="figure-button action-button-v2">
                <span className="buttons">
                    <FancydUsers {...this.props} bigContainer={true} displayCount={4} />
                    <MoreShareFacade objectType="thing" objectId={thing.id} loggedIn={loggedIn} title={getThingName(thing)}
                                     viewerUsername={viewer.username} showShortcuts={true} fromThingSidebar={true} />
                </span>
            </div>
        );
    }
}

