import React, { useCallback } from "react";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import { updateSaleContext } from "../../../../action/action-helpers";
import { getCurrentSaleOption, getWaiting } from "../../../map";
import { useFancy } from "../../FancyContext";
import appState from "../../../../appstate";
import type { SaleOption } from "ftypes";

interface ICartButtonProps {
  available: boolean;
  waiting: boolean;
  soldout: boolean;
  loading: boolean;
  onPurchase(): React.MouseEventHandler;
}

const CartButton: React.FC<ICartButtonProps> = ({ onPurchase, loading }) => {
  const dispatch = useDispatch();
  const { thing: { sales }, saleContext } = useFancy();

  const waiting = getWaiting(sales, saleContext);
  const available = sales.available;
  const { soldout } = getCurrentSaleOption(sales, saleContext) as SaleOption;

  if (!available) {
    return <Button
      className="btn-create not-available"
      label={gettext("Not Available")}
      disabled={true}
    />
  }

  const onNotifyLater = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!appState.loggedIn) {
        return window.require_login();
      }
      const opt = getCurrentSaleOption(sales, saleContext, true);
      const params: any = { sale_item_id: sales.id };

      if (opt != null) {
        params.option_id = opt.id;
      }

      const waiting = getWaiting(sales, saleContext);
      if (waiting) {
        params.remove = 1;
      }

      $.ajax({
        type: "post",
        url: "/wait_for_product.json",
        data: params,
        dataType: "json",
      }).done((json) => {
        if (!json || json.status_code == null) {
          return;
        }
        if (json.status_code == 0 && json.message) {
          window.alertify.alert(json.message);
          return;
        }
        const waiting = params.remove ? false : true;
        dispatch(updateSaleContext({ waiting }));
      });
    }
    , [dispatch, sales, saleContext])

  return <>
    <Button
      onClick={onPurchase}
      className={classnames("add_to_cart btn-cart", {
        "btn-create": soldout,
        "btns-blue-embo": !soldout,
        loading
      })}
      disabled={!!soldout}
      label={soldout ? gettext("Sold out") : gettext("Add to cart")}
    />
    <Button
      className={classnames("btn-create notify-available", { subscribed: waiting })}
      label={waiting ? gettext("Subscribed") : gettext("Notify me when available")}
      style={!soldout ? { display: "none" } : undefined}
      onClick={onNotifyLater}
    />
  </>
}

const Button: React.FC<React.ButtonHTMLAttributes<null> & { label: string; }> = ({ ...props }: any) => (
  <button {...props} label={null}>
    {props.label}
  </button>
);

export default CartButton;
