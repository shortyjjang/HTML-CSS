import type { SaleItem } from "ftypes";

export function isOptionMulti(sales: SaleItem): boolean {
  if (sales.option_meta.length > 1) {
      return true;
  } else if (sales.option_meta.length === 1) {
      return sales.option_meta[0].type !== "dropdown";
  } else {
      return false;
  }
}
