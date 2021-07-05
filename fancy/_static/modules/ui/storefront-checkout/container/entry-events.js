import { KEYS, didClickOn, getObjectTypeFromUrl, getPathname, isPlainLeftClick, isHomepage } from 'fancyutils';

import store from '../store/store';
import { Selectors } from '../config';
import { LinkTypes, transition } from './routeutils';
import { closeOverlay } from '../action/action-helpers';
import { historyData } from './history';

function conditionalTransition(aElement) {
    
}

var oneshotEventAttached = false;
export function attachEntryEvents() {
    if (oneshotEventAttached) {
        return;
    }
    oneshotEventAttached = true;
}
