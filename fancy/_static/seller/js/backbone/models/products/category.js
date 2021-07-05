FancyBackbone.Models.Product = FancyBackbone.Models.Product || {};
FancyBackbone.Collections.Product = FancyBackbone.Collections.Product || {};

FancyBackbone.Models.Product.Category = Backbone.RelationalModel.extend({
  // urlRoot: '/rest-api/v1/seller/products/categories',
  idAttribute: 'id_str',
  createSelectOption: function() {
    return {
      value: this.id,
      display: this.get('display'),
    };
  },
});

FancyBackbone.Collections.Product.CategoryCollection = Backbone.Collection.extend({
  model: FancyBackbone.Models.Product.Category,
  url: '/rest-api/v1/products/categories',
  omniCategories: [],
  initialize: function(models, options) {
    if (options && options.url) {
      this.url = options.url;
    }
    this.options = options;
  },
  parse: function(response) {
    // for searching categories
    var tempCatDict = {};
    var copy = JSON.parse(JSON.stringify(response.categories));
    copy.forEach(function(cat) {
      tempCatDict[cat.id] = cat;
      delete cat.id_str
      delete cat.parent_id_str
      cat.omniDisplay = '';
    });
    copy.forEach(function(cat) {
      tempCatDict[cat.id] = cat;
      var catz = [cat.display]
      var parentId = cat.parent_id
      while (parentId) {
        var parentCat = tempCatDict[parentId];
        !parentCat && console.log(parentId, parentCat)
        catz.unshift(parentCat.display);
        if (tempCatDict[parentCat.parent_id]) {
          parentId = tempCatDict[parentCat.parent_id].id;
        } else {
          parentId = null
        }
      }
      cat.omniDisplay = catz.join(' > ')
    });
    this.omniCategories = copy;
    tempCatDict = undefined; // free 
    return response.categories;
  },
  findCategoryByString: function(str) {
    var key = str.toLowerCase();
    return this.omniCategories.filter(function(oc) {
      return oc.omniDisplay.toLowerCase().indexOf(key) !== -1;
    });
  },
  findParentCategory: function(category) {
    if (category === null) {
      return category;
    } else {
      return this.get(category.get("parent_id"));
    }
  },
  findSubCategories: function(parentCategory) {
    var parentCategoryId = parentCategory ? parentCategory.id : null;
    return this.filter(function(category) {
      return category.get("parent_id") == parentCategoryId;
    });
  }
});

FancyBackbone.Models.Product.CategoryLegacy = Backbone.RelationalModel.extend({
  // urlRoot: '/rest-api/v1/seller/products/categories',
  idAttribute: 'id_str',
  createSelectOption: function() {
    return {
      value: this.id,
      display: this.get('display'),
    };
  },
});

FancyBackbone.Collections.Product.CategoryCollectionLegacy = Backbone.Collection.extend({
  model: FancyBackbone.Models.Product.CategoryLegacy,
  url: '/rest-api/v1/products/categories',
  initialize: function(models, options) {
    if (options && options.url) {
      this.url = options.url;
    }
    this.options = options;
  },
  parse: function(response) {
    return response.categories;
  },
  findParentCategory: function(category) {
    if (category === null) {
      return category;
    } else {
      return this.get(category.get("parent_id"));
    }
  },
  findSubCategories: function(parentCategory) {
    var parentCategoryId = parentCategory ? parentCategory.id : null;
    return this.filter(function(category) {
      return category.get("parent_id") == parentCategoryId;
    });
  }
});
