MyStore Automated Testing Project
This project contains automated UI tests for the MyStore website (http://automationpractice.multiformis.com/index.php) , focusing on the Homepage Search functionality and the Contact Us page.
The project uses Nightwatch.js and follows the Page Object Model (POM) design pattern; no hardcoded selectors
 
 Project Structure
MyStore/
├── page-objects/          # Page Object classes for HomePage & ContactUsPage
│   ├── HomePage.js
│   └── ContactUsPage.js
├── tests/                  # Test scripts for the application
│   ├── homepageSearchTest.js
│   └── contactUsTest.js
├── uploads/                # Test files for upload scenario
├── nightwatch.conf.js      # Nightwatch configuration file
├── package.json            # Project dependencies and scripts
└── README.md                # Project documentation
 
Tech Stack
•    Test Framework: Nightwatch.js
•    Language: JavaScript (Node.js)
•    Automation Design Pattern: Page Object Model (POM)
•    Assertion Library: Built-in Nightwatch assertions
•    Browser: Google Chrome (via Chromedriver)
 
Test Scenarios Covered
Homepage Search Tests
•    Search with valid keyword “dress”
•    Verify product titles contain the keyword
•    Search with no results
•    Search with:
o    Uppercase & lowercase keywords
o    Mixed-case keywords
o    Special characters
o    Extra spaces
•    Verify the search term remains in the search bar
•    Search using the Enter key
•    Click search with an empty search field
•    Clear search input
Contact Us Page Tests
•    Submit form with valid data & file upload
•    Submit form with invalid email
•    Missing mandatory fields (subject, message, email)
•    Upload invalid file formats
•    Submit a message with:
o    Minimum letters
o    Large input (50,000 characters)
 
Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/mystore-test.git
cd mystore-test
2. Install dependencies
npm install
3. Run ChromeDriver locally
Make sure ChromeDriver is running on port 9515, or update the nightwatch.conf.js to match your setup.
4. Run the tests
Run contactUs test:
npx nightwatch tests/contactUsTest.js --env default
Run homepage Search test
npx nightwatch tests/homepageSearchTest.js --env default

 
Author
Yara Khaled Sayed
Software Test Engineer
