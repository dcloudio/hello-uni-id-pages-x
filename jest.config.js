const path = require('path');
module.exports = {
	testTimeout: 30000,
	reporters: [
		'default'
	],
	watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
	moduleFileExtensions: ['js', 'json'],
	rootDir: __dirname,
	// testMatch: ["<rootDir>/pages/**/*test.[jt]s?(x)","<rootDir>/uni_modules/uni-id-pages-x/pages/**/*test.[jt]s?(x)"],
  testMatch: ["<rootDir>/pages/index/index.test.js"],
  // testMatch: ["<rootDir>/uni_modules/uni-id-pages-x/pages/login/login.test.js"],
	testPathIgnorePatterns: ['/node_modules/'],
	testSequencer: path.join(__dirname, "testSequencer.js")
}
