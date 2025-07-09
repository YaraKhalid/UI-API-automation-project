module.exports = {
  before: function (browser) {
    console.log('Starting Homepage Search Tests...');
  },

  after: function (browser) {
    browser.end();
  },

  'TC_001: Verify successful search with keyword "dress"': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('dress')
      .assertResultsDisplayed();
  },

  'TC_002: Verify product titles contain the keyword "dress"': function (browser) {
  const homePage = browser.page.HomePage();

  homePage
    .navigate()
    .waitForElementVisible('@searchInput', 5000)
    .searchForProduct('dress')
    .waitForElementVisible('@searchResults', 5000);

  browser.elements('css selector', '.product_list .product-name', function (result) {
    result.value.forEach(element => {
      browser.elementIdText(element.ELEMENT, function (textResult) {
        const text = textResult.value || '';
        browser.assert.ok(
          text.toLowerCase().includes('dress'),
          `Product title "${text}" contains "dress"`
        );
      });
    });
  });
},

  'TC_003: Verify the number of search results is displayed': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('dress')
      .waitForElementVisible('.product-count', 5000)
      .assert.visible('.product-count');
  },

  'TC_004: Verify system behavior if no matching results exist': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('nonexistentproduct12345')
      .assertNoResults();
  },

  'TC_005: Verify the search term remains in the search bar after search': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('dress')
      .getValue('@searchInput', result => {
        browser.assert.strictEqual(result.value, 'dress');
      });
  },

  'TC_006: Verify that the search works using the Enter key': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .setValue('@searchInput', 'dress');

    browser.keys(browser.Keys.ENTER);

    homePage
      .waitForElementVisible('@searchResults', 5000)
      .assert.visible('@searchResults');
  },

  'TC_007: Verify search results for uppercase input "DRESS"': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('DRESS')
      .assertResultsDisplayed();
  },

  'TC_008: Verify search results for mixed-case input "DrEsS"': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('DrEsS')
      .assertResultsDisplayed();
  },

  'TC_009: Verify search when extra spaces are present after "dress"': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('dress   ')
      .assertResultsDisplayed();
  },

  'TC_010: Verify search with special characters "dress@#!"': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .searchForProduct('dress@#!')
      .assertResultsDisplayed();
  },

  'TC_011: Verify system behavior when clicking search with empty search field': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .click('@searchButton')
      .waitForElementVisible('@noResultsMessage', 5000)
      .assert.containsText('@noResultsMessage', 'Please enter a search keyword');
  },

  'TC_012: Verify that the search term is removed after pressing clear (if available)': function (browser) {
    const homePage = browser.page.HomePage();

    homePage
      .navigate()
      .waitForElementVisible('@searchInput', 5000)
      .setValue('@searchInput', 'dress')
      .waitForElementVisible('@searchInput', 2000)
      .clearValue('@searchInput') // clearValue avoids stale element error
      .getValue('@searchInput', result => {
        browser.assert.strictEqual(result.value, '', 'Search input should be empty after clearing');
      });
  }
};
