// import the required modules
const debug = 1;  // debug level: [0..3]
const bali = require('bali-component-framework').api(debug);

// construct a transaction component from a javascript object
const transaction = bali.catalog({
    transaction: bali.tag(),  // generate a new unique tag
    timestamp: bali.moment(),  // now
    consumer: bali.text('Derk Norton'),
    merchant: bali.reference('https://www.starbucks.com/'),
    amount: bali.component('4.95($currency: $USD)')
});
console.log();

// print it to the console as a Bali document
console.log('transaction: ' + transaction);
console.log();

// create a list containing the the keys from the transaction
const list = bali.list(transaction.getKeys());

// print the list to the console as a Bali document
console.log('list: ' + list);
console.log();

// create an ordered set from the list of keys
const set = bali.set(list);  // automatically ordered

// print the set to the console as a Bali document
console.log('set: ' + set);
console.log();

// sort the items in the list
list.sortItems();

// print the sorted list to the console as a Bali document
console.log('sorted list: ' + list);
console.log();

// sort the associations in the transaction
transaction.sortItems();

// print the sorted transaction to the console as a Bali document
console.log('sorted transaction: ' + transaction);
console.log();

// compare the sorted list with the keys from the sorted transaction
const keys = transaction.getKeys();
const areEqual = keys.isEqualTo(list);
console.log('are equal: ' + areEqual);
console.log();

