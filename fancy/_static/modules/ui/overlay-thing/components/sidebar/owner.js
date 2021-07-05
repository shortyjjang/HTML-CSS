import React, { Component } from 'react';
import classnames from 'classnames';
import { isEmpty, cdnUtils } from 'fancyutils';
import { BGImage, Display } from 'fancymixin';

import appState from '../../appstate';
import { toggleFollow } from '../../action/action-helpers';


export default class SidebarOwner extends Component {
    handleFollowToggle = (event) => {
        event.preventDefault();
        if (!appState.loggedIn) {
            return window.require_login();
        }
        var { thing: { owner }, dispatch } = this.props;
        dispatch(toggleFollow({ user_id: owner.id }));
    }

    isFollowingUser(followContext) {
        return followContext && followContext.followUser.following === true;
    }

    render() {
        const { appContext: { viewer }, thing, thing: { sales_available, owner, owner_recent_activity }, followContext } = this.props;

        if (owner == null) {
            return null;
        }

        // SaleThing owner goes below of the content, have more items
        var ITEMS_COUNT = sales_available ? 8 : 5;
        var activityExists = !isEmpty(owner_recent_activity);
        var following = this.isFollowingUser(followContext);

        return (
            <div className={classnames("wrapper added-info thing-more", { "loading": thing.loading })}>
                <a href={owner.html_url} className="tit">
                    <BGImage url={owner.profile_image_url} schemeless />
                    <small>{gettext('Added by')}</small>
                    <b>{owner.full_name}</b>
                </a>
                <button className={classnames('btns-gray-embo btn-follow', following ? 'following' : 'follow')}
                        style={Display.NoneIf(owner.id === viewer.id)}
                        onClick={this.handleFollowToggle} />
                {activityExists &&
                    <ul className="after">
                        {owner_recent_activity
                            .filter((_, idx) => idx < ITEMS_COUNT)
                            .map((recentActivity, idx) => {
                                recentActivity = recentActivity || { html_url: ''};
                                return <li key={`owner_recent_activity-${idx}`}>
                                    <a href={recentActivity.html_url}>
                                        <BGImage url={cdnUtils.resizedSchemelessImage(recentActivity.image_path, 148, 'crop')} />
                                    </a>
                                </li>
                            })
                        }
                    </ul>
                }
            </div>
        );
    }
}
