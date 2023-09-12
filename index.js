const nearley = require("nearley");
const grammar = require("./grammar.js");
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// parser.feed(`[1+1, trim(trim(1 + 2))]`);
// console.log(parser.results[0][0].value[1][0].parameters[0]);
// console.log(parser.results[0][0].parameters[0][0].value);
// parser.feed(`["12",12]`);
// console.log(parser.results[0][0].value);

// parser.feed(`(true==false) != (true!=true)`);
//  console.log(parser.results[0]);

// parser.feed(`(true == true) == (true == true)`);
// console.log(parser.results[0]);

// parser.feed(`sum([12,232]) == 244 ? 1 : false ? 2 : 3`);
// console.log(parser.results[0][0]);

// parser.feed(`{a: [1,2,"3"], b: call(1,2), c: "3"}`)
// console.log(parser.results[0][0].value);


// parser.feed(`"asd" ?? 12 ?? 13`)
// console.log(parser.results[0][0]);



parser.feed(`posts[0].omments[1:0]`)
console.log(parser.results[0][0]);

// parser.feed(`12 ?? 14 ?? 13`)
// console.log(parser.results[0]);
