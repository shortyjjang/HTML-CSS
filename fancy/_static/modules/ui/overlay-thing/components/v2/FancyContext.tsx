import { OverlayProps, ReduxProps } from 'ftypes';
import React from 'react';

export function getFancyContextDefaultValue() {
  return {
      appContext: {},
      thing: {},
      followContext: {},
      fancyContext: {},
      slideContext: {},
      saleContext: {},
      dispatch: () => {},
  }
}

// @ts-ignore
const FancyContext = React.createContext<OverlayProps & ReduxProps>(getFancyContextDefaultValue());

export const useFancy = () : OverlayProps & ReduxProps => {
  return React.useContext(FancyContext);
}

export default FancyContext;
