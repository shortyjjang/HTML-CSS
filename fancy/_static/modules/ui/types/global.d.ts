import type { Bundle, GlobalFancySomething, FancyUserConfig, VariableDict } from "ftypes";
import type _ from 'underscore';

declare global {
    const gettext: (str: string) => string;
    const _: typeof _;
    const __Config: VariableDict;
    interface Window {
        CURRENT_LANGCODE: string;
        require_login(next?:string, action?: string, action_param?: string): void;
        renderMoreShare: Function;
        initMoreShareOn?: string;
        gettext: (str: string) => string;
        _: typeof _;
        alertify: alertify.IAlertifyStatic;
        numberType: number;
        track_event: Function;
        Bundle: Bundle;
        thingPageData: Object;
        dataLayer: Array<any>;
        Fancy: GlobalFancySomething;
        from_sds_page: boolean;
        TrackingEvents: {
            addToCart(_: any): any;
        };
        requestIdleCallback: Function;
        __FancyUser: FancyUserConfig;
        __F: VariableDict;
        __Config: VariableDict;
        parseURL: Function;
        FancyApplePay: {
            paymentRequest?: any;
            clicked: boolean;
        };
    }
    interface Document {
        selection: {
            createRange(): Range;
        };
    }
    interface Range {
        moveStart(_: string, __: number): void;
        moveEnd(_: string, __: number): void;
        select(): void;
        text: string;
    }
    interface HTMLInputElement {
        createTextRange(): Range;
    }
    interface JQueryOldTriggeredEvent extends JQuery.TriggeredEvent {
        isTrigger: boolean;
    }
    interface Location {
        args: { [key:string] : string };
    }
}

export {};
