// import required modules
const debug = 1;  // debug level: [0..3]
const bali = require('bali-component-framework').api(debug);
const account = bali.tag();  // new account
const directory = 'config/';  // for testing purposes only
const notary = require('bali-digital-notary').test(account, directory, debug);
const repository = require('bali-document-repository').test(notary, directory, debug);

// wrap the test in an asynchronous function
const test = async function() {

// generate a new notarized public certificate
const publicKey = await notary.generateKey();
const certificate = await notary.notarizeDocument(publicKey);
await notary.activateKey(certificate);
console.log(certificate.toString());

// commit the public certificate to the document repository
var citation = await repository.writeDocument(certificate);
console.log(citation.toString());

// create a notarized draft document
const profile = bali.catalog({
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
const draft = await notary.notarizeDocument(profile);
console.log(draft.toString());

// save the draft document to the document repository
citation = await repository.writeDraft(draft);
console.log(citation.toString());

// verify the draft is in the repository
const tag = profile.getParameter('$tag');
const version = profile.getParameter('$version');
console.log(await repository.draftExists(tag, version));

// commit the draft document to the document repository (permanently)
citation = await repository.writeDocument(draft);
console.log(citation.toString());

// verify that the draft is no longer in the repository
console.log(await repository.draftExists(tag, version));

// read the committed document from the repository
var document = await repository.readDocument(tag, version);
console.log(document.toString());

// name the document in the repository
const name = bali.component('/acme/profiles/JaneDoe/' + version);
await repository.writeName(name, citation);

// retrieve the document from the repository by name
document = await repository.readName(name);
console.log(document.toString());
};

// execute the tests
test();
