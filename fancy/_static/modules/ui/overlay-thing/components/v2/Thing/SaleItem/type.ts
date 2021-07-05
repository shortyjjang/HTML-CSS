import type { OverlayProps, ReduxProps, SelectedMetaOption } from "ftypes";
import type { MultiOptionState } from "../SaleItemForm";

export type ISaleItemSidebarHeadProps = OverlayProps & ReduxProps & { showInfo: boolean };
export type ISaleItemSidebarHeadState = {
    loading: boolean;
    selected: null | {} | SelectedMetaOption;
    disabled: Array<any>;
    multiOptionState: null | MultiOptionState;
    showSelectWarning: boolean;
}
