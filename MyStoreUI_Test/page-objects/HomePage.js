module.exports = {
  url: 'http://automationpractice.multiformis.com/index.php',

  //page locators
  elements: {
    searchInput: '#search_query_top',
    searchButton: 'button[name="submit_search"]',
    searchResults: '.product_list', 
    noResultsMessage: '.alert.alert-warning' 
  },

  commands: [{
    searchForProduct(searchTerm) { //Search function
      return this
        .setValue('@searchInput', searchTerm)
        .click('@searchButton');
    },

    assertResultsDisplayed() {  
      return this
        .waitForElementVisible('@searchResults', 5000)
        .assert.visible('@searchResults');
    },

    assertNoResults() {
      return this
        .waitForElementVisible('@noResultsMessage', 5000)
        .assert.containsText('@noResultsMessage', 'No results were found');
    }
  }]
};
