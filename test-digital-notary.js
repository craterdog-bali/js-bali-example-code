// import required modules
const debug = 1;  // debug level: [0..3]
const bali = require('bali-component-framework').api(debug);
const account = bali.tag();  // new account
const directory = 'config/';  // for testing purposes only
const notary = require('bali-digital-notary').test(account, directory, debug);

// wrap the test in an asynchronous function
const test = async function() {
console.log();

// generate a new notary key and associated public certificate
var certificate = await notary.generateKey();

// print the public certificate to the console
console.log('public certificate: ' + certificate);
console.log();

// notarize the public certificate
certificate = await notary.notarizeDocument(certificate);

// print the notarized certificate to the console
console.log('notarized certificate: ' + certificate);
console.log();

// activate the notary key using its notarized certificate
var citation = await notary.activateKey(certificate);

// print the resulting certificate citation to the console
console.log('certificate citation: ' + citation);
console.log();

// create a transaction document
const transaction = bali.instance('/starbucks/types/Transaction/v2.3', {
    $timestamp: bali.moment(),  // now
    $consumer: 'Derk Norton',
    $merchant: '<https://www.starbucks.com/>',
    $amount: '4.95($currency: $USD)'
});

// print the transaction document to the console
console.log('transaction: ' + transaction);
console.log();

// notarize the transaction with the private notary key
const contract = await notary.notarizeDocument(transaction);

// print the notarized transaction to the console as a document
console.log('contract: ' + contract);
console.log();

// prove the notarized transaction is authentic using the public certificate
const isValid = await notary.validContract(contract, certificate);
console.log('is valid: ' + isValid);
console.log();

// generate a document citation for the notarized transaction
citation = await notary.citeDocument(transaction);

// print the transaction citation to the console as a document
console.log('transaction citation: ' + citation);
console.log();

// prove the notarized document matches the document citation
const citationMatches = await notary.citationMatches(citation, transaction);
console.log('citation matches: ' + citationMatches);
console.log();

};

// execute the tests
test();
