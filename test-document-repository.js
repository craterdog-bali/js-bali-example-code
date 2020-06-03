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
console.log('certificate: ' + certificate);
console.log();
await storage.writeContract(certificate);

// create a document
var document = bali.instance('/acme/types/Profile/v1', {
    $name: 'Jane Doe',
    $age: 30,
    $email: bali.reference('mailto:jane.doe@acme.org')
});
console.log('document: ' + document);
console.log();

// save the document to the document repository
var citation = await repository.saveDocument(document);
console.log('citation: ' + citation);
console.log();

// update the saved document
document = await repository.retrieveDocument(citation);
document.setValue('$age', 29);
document.setParameter('$version', 'v1.1');
document.setParameter('$previous', citation);
console.log('document: ' + document);
console.log();

// save the updated document to the document repository
citation = await repository.saveDocument(document);
console.log('citation: ' + citation);
console.log();

// commit the document to the document repository as a notarized contract
const name = '/acme/profiles/jane/v1';
await repository.commitDocument(name, document);

// retrieve the named document from the repository
document = await repository.retrieveDocument(name);
console.log('document: ' + document);
console.log();

// retrieve the full contract from the repository
const contract = await repository.retrieveContract(name);
console.log('contract: ' + contract);
console.log();
};

// execute the tests
test();
