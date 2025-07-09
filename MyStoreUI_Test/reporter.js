const HtmlReporter = require('nightwatch-html-reporter');
const path = require('path');

const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory: path.join(__dirname, 'reports'),
  reportFilename: 'test-report.html',
  themeName: 'default'
});

// Directly export the reporter function
module.exports = reporter.fn;
