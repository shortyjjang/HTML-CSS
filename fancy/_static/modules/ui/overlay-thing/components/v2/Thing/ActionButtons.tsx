import React from "react";
import classnames from "classnames";
import { FancyUser, MP, renderPopup } from "fancyutils";
import { useDispatch } from 'react-redux'
import { FancydByPopupV4 } from 'common-components';

import { useFancy } from "../FancyContext";
import AdminPopup from "../../popup/AdminPopup"
import SimpleSharePopup from "../../popup/SimpleSharePopup"
import AddlistPopup from "../../popup/AddlistPopup"
import { toggleFancy, getCordialProperties } from "../../../action/action-helpers";

function Favorite() {
    const { appContext, thing, fancyContext } = useFancy();
    const dispatch = useDispatch();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('favortie');
        if (!appContext.loggedIn) {
            window.require_login(null, "fancy_thing", thing.id);
            return;
        }

        if (fancyContext.loading) {
            return;
        }

        dispatch(toggleFancy(thing.id));

        if (!fancyContext.fancyd) {
            MP("Fancy", { thing_id: thing.id });
            try {
                window.crdl('event', 'favorite_item', getCordialProperties(thing));
            } catch (e) {
            }
        } else {
            MP("Unfancy", { thing_id: thing.id });
        }
    };

    return (
        <a className={classnames("button button-static fancy _count", { fancyd: fancyContext.fancyd })} onClick={handleClick}>
            Favorite
        </a>
    );
}

export default function ActionButtons() {
    const {
        appContext: { viewer, loggedIn },
        thing,
        thing: { id: objectId },
        fancyContext,
    } = useFancy();

    let msg;
    if (thing.fancyd_friends) {
        const cnt = fancyContext.fancyd_count - 1;
        if (cnt > 0) {
            msg = <>
                Favorited by <a href={thing.fancyd_friends[0].url}>{thing.fancyd_friends[0].full_name}</a> and <b>{cnt} other{(cnt > 1) ? `s` : ``}</b>
            </>
        } else {
            msg = <>Favorited by <a href={thing.fancyd_friends[0].url}>{thing.fancyd_friends[0].full_name}</a></>
        }
    } else {
        msg = <>{fancyContext.fancyd_count} people favorited</>
    }

    return (
        <>
            <span className="_fancyd fancyd_user" onClick={(e : React.MouseEvent<HTMLSpanElement>) => {
                if (e.target.tagName === 'A') {
                    return;
                }
                renderPopup(FancydByPopupV4, { objectId, objectType: 'thing', loggedIn: FancyUser.loggedIn, viewerId: FancyUser.id });
            }}>{msg}</span>
            <a onClick={(event) => {
                event.preventDefault();
                if (!loggedIn) {
                    window.require_login();
                    return;
                }
                renderPopup(AddlistPopup, { objectId });
            }} className="add-list">Add to List</a>
            <div className="figure-button action-button-v2">
                {viewer.is_admin_any && (
                    <a className="edit"
                        onClick={(event) => {
                            event.preventDefault();
                            renderPopup(AdminPopup, { viewer, thing });
                        }}>Edit</a>
                )}
                <Favorite />
                <a
                    className="btn-share"
                    onClick={(event) => {
                        event.preventDefault();
                        renderPopup(SimpleSharePopup, { viewer, thing });
                    }}>
                    Share
                </a>
            </div>
        </>
    );
}
