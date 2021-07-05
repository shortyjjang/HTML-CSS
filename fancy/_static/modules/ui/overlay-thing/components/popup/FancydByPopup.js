import React from 'react';

import { FancydPerson } from "common-components"

import appState from "../../appstate";


export class FancydByFriendsPopup extends React.Component {
    static popupName = 'fancyd_friends';

    render() {
        const { thing: { fancyd_friends } } = this.props;

        return (
            <div>
                <p className="ltit">{gettext("Fancy'd by friends")}</p>
                <ul>
                    {fancyd_friends.map((user, idx) => <FancydPerson key={`FancydByFriends-${idx}`} following={true} user={user} loggedIn={appState.loggedIn} viewerId={appState.viewer.id} />)}
                </ul>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        )
    }
}
