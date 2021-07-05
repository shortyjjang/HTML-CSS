FancyBackbone.App.SharedResources = FancyBackbone.App.SharedResources || {};
(function() {
  var dictionary = {};
  FancyBackbone.App.SharedResources.fetchWarehouses = function() {
    if (!dictionary.warehouseCollectionPromise) {
      dictionary.warehouseCollectionPromise = FancyBackbone.Delegates.fetch(new FancyBackbone.Collections.WarehouseCollection());
    }
    return dictionary.warehouseCollectionPromise;
  };
  FancyBackbone.App.SharedResources.fetchStates = function() {
    if (!dictionary.stateCollectionPromise) {
      dictionary.stateCollectionPromise = FancyBackbone.Delegates.fetch(new FancyBackbone.Collections.StateCollection());
    }
    return dictionary.stateCollectionPromise;
  };
  FancyBackbone.App.SharedResources.fetchPurchaseOrderCarriers = function() {
    if (!dictionary.purchaseOrderCarrierCollectionPromise) {
      dictionary.purchaseOrderCarrierCollectionPromise = FancyBackbone.Delegates.fetch(new FancyBackbone.Collections.PurchaseOrder.CarrierCollection());
    }
    return dictionary.purchaseOrderCarrierCollectionPromise;
  };
  FancyBackbone.App.SharedResources.fetchPurchaseOrderCurrencies = function() {
    if (!dictionary.purchaseOrderCurrencyCollectionPromise) {
      dictionary.purchaseOrderCurrencyCollectionPromise = FancyBackbone.Delegates.fetch(new FancyBackbone.Collections.PurchaseOrder.CurrencyCollection());
    }
    return dictionary.purchaseOrderCurrencyCollectionPromise;
  };
  FancyBackbone.App.SharedResources.fetchPurchaseOrderVendors = function() {
    if (!dictionary.purchaseOrderVendorCollectionPromise) {
      dictionary.purchaseOrderVendorCollectionPromise = FancyBackbone.Delegates.fetch(new FancyBackbone.Collections.PurchaseOrder.VendorCollection());
    }
    return dictionary.purchaseOrderVendorCollectionPromise;
  };
  FancyBackbone.App.SharedResources.fetchCountries = function() {
    if (!dictionary.countryCollectionPromise) {
      dictionary.countryCollectionPromise = FancyBackbone.Delegates.fetch(new FancyBackbone.Collections.CountryCollection());
    }
    return dictionary.countryCollectionPromise;
  };
})();
