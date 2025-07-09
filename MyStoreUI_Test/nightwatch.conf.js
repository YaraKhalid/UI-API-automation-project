const path = require('path');
const HtmlReporter = require('nightwatch-html-reporter');
const reporter = new HtmlReporter({
  openBrowser: false, // Set to true if you want the report to open automatically
  reportsDirectory: __dirname + '/reports', // Directory to save reports
  themeName: 'default', // Choose a theme (default, compact, etc.)
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
      // ✅ Prevent stopping on failure
      skip_testcases_on_fail: false,

      // ✅ (Optional) Enable screenshots on failure
      screenshots: {
        enabled: true,
        path: 'screens',
        on_failure: true,
        on_error: true
      },

      // ✅ Basic Chrome WebDriver setup
      webdriver: {
        start_process: true,
        erver_path: '/usr/bin/chromedriver', // This is the correct path on cimg/node:*-browsers
        port: 9515,
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
