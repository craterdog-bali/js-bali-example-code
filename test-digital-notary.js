// import required modules
const debug = 1;  // debug level: [0..3]
const bali = require('bali-component-framework').api(debug);
const account = bali.tag();  // new account
const directory = 'config/';  // for testing purposes only
const notary = require('bali-digital-notary').test(account, directory, debug);

// wrap the test in an asynchronous function
const test = async function() {

// generate a new notary key and associated public key
const publicKey = await notary.generateKey();

// print the public key to the console as a document
console.log(publicKey.toString());

// notarize the public key to create the notary certificate
const certificate = await notary.notarizeDocument(publicKey);

// print the notarized certificate to the console as a document
console.log(certificate.toString());

// activate the notary key using its certificate
var citation = await notary.activateKey(certificate);

// print the certificate citation to the console as a document
console.log(citation.toString());

// create a transaction
var transaction = bali.catalog({
    $timestamp: bali.moment(),  // now
    $consumer: bali.text('Derk Norton'),
    $merchant: bali.reference('https://www.starbucks.com/'),
    $amount: 4.95
}, {
    $type: bali.component('/starbucks/types/Transaction/v2.3'),
    $tag: bali.tag(),
    $version: bali.version(),
    $permissions: bali.component('/bali/permissions/Public/v1'),
    $previous: bali.NONE
});

// notarize the transaction with the private notary key
transaction = await notary.notarizeDocument(transaction);

// print the notarized transaction to the console as a document
console.log(transaction.toString());

// prove the notarized transaction is authentic using the public key
var result = await notary.validDocument(transaction, certificate);
console.log(result);

// generate a document citation for the notarized transaction
citation = await notary.citeDocument(transaction);

// print the transaction citation to the console as a document
console.log(citation.toString());

// prove the notarized document matches the document citation
result = await notary.citationMatches(citation, transaction);
console.log(result);

};

// execute the tests
test();
