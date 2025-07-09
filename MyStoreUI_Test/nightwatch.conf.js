const path = require('path');
const chromedriver = require('chromedriver'); // ✅ Require the local Chromedriver
const HtmlReporter = require('nightwatch-html-reporter');

// ✅ HTML Report configuration
const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory: path.join(__dirname, 'reports'),
  themeName: 'default',
});

module.exports = {
  // ✅ Test and Page Object locations
  src_folders: ['tests'],
  page_objects_path: ['page-objects'],

  // ✅ Enable parallel execution (optional, keep if needed)
  test_workers: {
    enabled: true,
    workers: 'auto'
  },

  test_settings: {
    default: {
      skip_testcases_on_fail: false,

      screenshots: {
        enabled: true,
        path: 'screens',
        on_failure: true,
        on_error: true
      },

      // ✅ Automatically start Chromedriver from node_modules
      webdriver: {
        start_process: true,
        server_path: chromedriver.path,
        port: 9515,
        host: 'localhost',
      },

      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless', '--no-sandbox', '--disable-gpu', '--window-size=1920,1080']
        }
      },

      globals: {
        reporter: reporter.fn,
        waitForConditionTimeout: 5000
      }
    }
  }
};
