// import required modules
const debug = 1;  // debug level: [0..3]
const bali = require('bali-component-framework').api(debug);
const account = bali.tag();  // new account
const directory = 'config/';  // for testing purposes only
const notary = require('bali-digital-notary').test(account, directory, debug);
const repository = require('bali-document-repository').test(notary, directory, debug);

// wrap the test in an asynchronous function
const test = async function() {
console.log();

// generate a new private notary key and public certificate
var certificate = await notary.generateKey();
console.log('certificate: ' + certificate);
console.log();

// notarize the public certificate
var document = await notary.notarizeDocument(certificate);
await notary.activateKey(document);

// commit the notarized public certificate to the document repository
await repository.writeDocument(document);

// create a notarized draft document
var profile = bali.catalog({
    $name: 'Jane Doe',
    $age: 30,
    $email: bali.reference('mailto:jane.doe@gmail.com')
}, {
    $type: '/bali/examples/Profile/v1',
    $tag: bali.tag(),  // new random document tag
    $version: bali.version(),  // initial version of the document (v1)
    $permissions: '/bali/permissions/private/v1',
    $previous: bali.pattern.NONE  // no previous version of the document
});
var draft = await notary.notarizeDocument(profile);
console.log('draft: ' + draft);
console.log();

// save the draft document to the document repository
var citation = await repository.writeDraft(draft);
console.log('citation: ' + citation);
console.log();

// validate the citation against the draft document
console.log('citation matches: ' + await notary.citationMatches(citation, draft));
console.log();

// verify the draft is in the repository
console.log('draft exists: ' + await repository.draftExists(citation));
console.log();

// update the draft document
draft = await repository.readDraft(citation);
profile = draft.getValue('$content');
profile.setValue('$age', 29);
draft = await notary.notarizeDocument(profile);
console.log('draft: ' + draft);
console.log();

// the citation is now invalid against the updated profile
console.log('citation matches: ' + await notary.citationMatches(citation, draft));
console.log();

// save the updated draft document to the document repository
await repository.writeDraft(draft);

// commit the draft document to the document repository (permanently)
citation = await repository.writeDocument(draft);
console.log('citation: ' + citation);
console.log();

// verify that the draft is no longer in the repository
console.log('draft exists: ' + await repository.draftExists(citation));
console.log();

// read the committed document from the repository
document = await repository.readDocument(citation);
console.log('document: ' + document);
console.log();

// name the document in the repository
const name = bali.component('/acme/profiles/JaneDoe/v1');
await repository.writeName(name, citation);

// retrieve the document from the repository by name
document = await repository.readName(name);
console.log('document: ' + document);
console.log();
};

// execute the tests
test();
