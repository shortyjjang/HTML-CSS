import C from './action-constants';


// Action on requesting thing starts
export function requestThing(pendingID) {
    return {
        type: C.REQUEST_THING,
        status: 'request',
        pendingID
    };
}

// Action on requesting thing fails
export function requestThingFail() {
    return {
        type: C.REQUEST_THING_FAILURE,
        status: 'failed'
    };
}

// action on loading request result
export function loadThing(ID, data) {
    return {
        type: C.LOAD_THING,
        status: 'idle',
        ID,
        data
    };
}

// Action on close overlay
export function openThing() {
    return {
        type: C.OPEN_THING
    };
}

// Action on close overlay
export function closeThing() {
    return {
        type: C.CLOSE_THING,
        ID: null,
        pendingID: null,
        thing: null
    };
}


export function setThumbnailIndex(thumbnailIndex) {
    return {
        type: C.SET_THUMBNAIL_INDEX,
        thumbnailIndex,
    };
}

export function toggleFollow(followType) {
    return {
        type: C.TOGGLE_FOLLOW,
        followType
    };
}

export function cancelFollow(followType) {
    return {
        type: C.CANCEL_FOLLOW,
        followType
    };
}

export function completeFollow(followType) {
    return {
        type: C.COMPLETE_FOLLOW,
        followType
    };
}

export function toggleFancy(thingID) {
    return {
        type: C.TOGGLE_FANCY,
        thingID,
    };
}

export function cancelFancy(thingID) {
    return {
        type: C.CANCEL_FANCY,
        thingID,
    };
}

export function completeFancy(thingID, fancyd_count) {
    return {
        type: C.COMPLETE_FANCY,
        thingID,
        fancyd_count
    };
}

export function updateAppContext(contextObject) {
    return {
        type: C.UPDATE_APP_CONTEXT,
        context: contextObject
    };
}
