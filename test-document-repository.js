// import required modules
const debug = 1;  // debug level: [0..3]
const bali = require('bali-component-framework').api(debug);
const account = bali.tag();  // new account
const directory = 'config/';  // for testing purposes only
const notary = require('bali-digital-notary').test(account, directory, debug);
const Repository = require('bali-document-repository');
const storage = Repository.local(notary, directory, debug);
const repository = Repository.repository(notary, storage, debug);

// wrap the test in an asynchronous function
const test = async function() {
console.log();

// initialize the digital notary
var certificate = await notary.generateKey();
certificate = await notary.notarizeDocument(certificate);
await notary.activateKey(certificate);
await storage.writeContract(certificate);

// create a document
var document = bali.instance('/acme/types/Profile/v1', {
    $name: 'Jane Doe',
    $email: bali.reference('mailto:jane.doe@acme.org')
});
console.log('document: ' + document);
console.log();

// save the document to the document repository
var citation = await repository.saveDocument(document);
console.log('citation: ' + citation);
console.log();

// update the document
document = await repository.retrieveDocument(citation);
document.setValue('$age', 29);
console.log('updated document: ' + document);
console.log();

// commit the document to the document repository as a notarized contract
var name = '/acme/profiles/jane/v1';
await repository.commitDocument(name, document);

// retrieve the named document from the repository
document = await repository.retrieveDocument(name);
console.log('named document: ' + document);
console.log();

// checkout and update a new version of the document from the repository
const level = 2;  // version level to increment
document = await repository.checkoutDocument(name, level);
document.setValue('$age', 30);
console.log('next version: ' + document);
console.log();

// commit the new version to the document repository
name = '/acme/profiles/jane/v1.1';
await repository.commitDocument(name, document);

// retrieve the notarized contract for the new version from the repository
const contract = await repository.retrieveContract(name);
console.log('notarized contract: ' + contract);
console.log();
};

// execute the tests
test();
