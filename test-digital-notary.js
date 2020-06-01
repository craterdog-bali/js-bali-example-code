// import required modules
const debug = 1;  // debug level: [0..3]
const bali = require('bali-component-framework').api(debug);
const account = bali.tag();  // new account
const directory = 'config/';  // for testing purposes only
const notary = require('bali-digital-notary').test(account, directory, debug);

// wrap the test in an asynchronous function
const test = async function() {
console.log();

// generate a new notary key and associated public key
const publicKey = await notary.generateKey();

// print the public key to the console as a document
console.log('public key: ' + publicKey);
console.log();

// notarize the public key to create the notary certificate
const certificate = await notary.notarizeDocument(publicKey);

// print the notarized certificate to the console as a document
console.log('certificate: ' + certificate);
console.log();

// activate the notary key using its certificate
var citation = await notary.activateKey(certificate);

// print the certificate citation to the console as a document
console.log('certificate citation: ' + citation);
console.log();

// create a transaction
const transaction = bali.catalog({
    $timestamp: bali.moment(),  // now
    $consumer: bali.text('Derk Norton'),
    $merchant: bali.reference('https://www.starbucks.com/'),
    $amount: bali.component('4.95($currency: $USD)')
}, {
    $type: bali.component('/starbucks/types/Transaction/v2.3'),
    $tag: bali.tag(),
    $version: bali.version(),
    $permissions: bali.component('/bali/permissions/Public/v1'),
    $previous: bali.NONE
});

// notarize the transaction with the private notary key
const contract = await notary.notarizeDocument(transaction);

// print the notarized transaction to the console as a document
console.log('contract: ' + contract);
console.log();

// prove the notarized transaction is authentic using the public key
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
