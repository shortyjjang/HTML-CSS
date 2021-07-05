FancyBackbone.Mixins.PaginatedCollectionMixin = {
  parsePageInfo: function(response) {
    this.currentPage = response.current_page;
    this.maxPage = response.max_page;
    this.totalCount = response.total_count;
  },
};
