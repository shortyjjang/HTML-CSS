import ReactDOM from 'react-dom';
import React from 'react';
import { selectOrCreate } from './FancyUtils';


function selectPopup(popupName) {
    if ($(`#popup_container .${popupName}`).length > 0) {
        if (popupName) {
            return $.dialog(popupName);
        }
    }
    return null;
}

export function openPopup(popupName, bindOverlayData = true) {
    const popup = selectPopup(popupName);
    if (popup) {
        if (bindOverlayData) {
            popup.$obj.data('via-overlay', true);
            popup.$obj.one('close', function() {
                $(this).data('via-overlay', false);
            });
        }
        popup.open();
    }
}

export function closePopup(popupName) {
    const popup = selectPopup(popupName);
    if (popup) {
        popup.$obj.data('via-overlay', false);
        popup.close();
    }
}

const popupContainer = document.getElementById('popup_container');
export function renderPopup(PopupComponent, attrs, callback) {
    // unless `attrs.openOnMount` is explicitly set as `false` and callback is set, it will open right after mount.
    attrs = attrs || {};
    if (attrs.openOnMount !== false && callback == null) {
        callback = function () {
            openPopup(PopupComponent.popupName);
        };
    }

    if (!PopupComponent.popupName) {
        console.warn(`renderPopup: Please set \`popupName\` property of ${PopupComponent.name}`);
    }
    return ReactDOM.render(
        <PopupComponent {...attrs} />,
        selectOrCreate(`.popup.${PopupComponent.popupName || ''}`, popupContainer),
        callback
    );
}
