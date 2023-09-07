// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
    exponent: ["^", "**"],
    additive_operator: ["+", "-"],
    nullish_coalescing_operator: "??",
    multiplicative_operator: ["*", "/", "%"],
    comparison_operator: ["<", "<=", ">", ">=", "==", "!="],
    dot: ".",
    optional_chaining: "?.",
    ws: /[ \t]+/,
    nl: { match: "\n", lineBreaks: true },
    question_mark: "?",
    colon: ":",
    lparan: "(",
    rparan: ")",
    comma: ",",
    lbracket: "[",
    rbracket: "]",
    lbrace: "{",
    rbrace: "}",
    assignment: "=",
    plus: "+",
    minus: "-",
    colon: ":",
    comment: {
        match: /#[^\n]*/,
        value: s => s.substring(1)
    },
    nil_literal: {
     match: "nil",
     value: () => null
},

    string_literal: {
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
        value: s => JSON.parse(s)
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => Number(s)
    },
    identifier: {
        match: /[a-z_][a-z_0-9]*/,
    },
});


function tokenStart(token) {
    return {
        line: token.line,
        col: token.col - 1
    };
}

function tokenEnd(token) {
    const lastNewLine = token.text.lastIndexOf("\n");
    if (lastNewLine !== -1) {
        throw new Error("Unsupported case: token with line breaks");
    }
    return {
        line: token.line,
        col: token.col + token.text.length - 1
    };
}


function convertToken(token) {
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token),
        end: tokenEnd(token)
    };
}

function convertTokenId(data) {
    return convertToken(data[0]);
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "input", "symbols": ["top_level_statements"], "postprocess": id},
    {"name": "top_level_statements", "symbols": ["top_level_statement"], "postprocess": 
        d => [d[0]]
                },
    {"name": "top_level_statements", "symbols": ["top_level_statement", "_", {"literal":"\n"}, "_", "top_level_statements"], "postprocess": 
        d => [
            d[0]   ,
            ...d[4]
        ]
                },
    {"name": "top_level_statements", "symbols": ["_", {"literal":"\n"}, "top_level_statements"], "postprocess": 
        d => d[2]
                },
    {"name": "top_level_statements", "symbols": ["_"], "postprocess": 
        d => []
                },
    {"name": "top_level_statement", "symbols": ["expression"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["statement"], "postprocess": id},
    {"name": "statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "expression", "symbols": ["ternary_expr"], "postprocess": id},
    {"name": "ternary_expr", "symbols": ["base_expr", "_", (lexer.has("question_mark") ? {type: "question_mark"} : question_mark), "_", "ternary_expr", "_", (lexer.has("colon") ? {type: "colon"} : colon), "_", "ternary_expr"], "postprocess": d => ({ type: "ternary_node", condition: d[0], trueExpr: d[4], falseExpr: d[8] })},
    {"name": "ternary_expr", "symbols": ["base_expr"], "postprocess": id},
    {"name": "base_expr", "symbols": ["data_type"], "postprocess": id},
    {"name": "base_expr", "symbols": ["nullish_coalescing_expr"], "postprocess": id},
    {"name": "base_expr", "symbols": ["comparison_expr"], "postprocess": id},
    {"name": "base_expr", "symbols": ["additive_expr"], "postprocess": id},
    {"name": "base_expr", "symbols": ["member_expr"], "postprocess": id},
    {"name": "nullish_coalescing_expr", "symbols": ["comparison_expr"], "postprocess": id},
    {"name": "nullish_coalescing_expr", "symbols": ["nullish_coalescing_expr", "_", (lexer.has("nullish_coalescing_operator") ? {type: "nullish_coalescing_operator"} : nullish_coalescing_operator), "_", "comparison_expr"], "postprocess": d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] })},
    {"name": "data_type", "symbols": ["nil"], "postprocess": id},
    {"name": "data_type", "symbols": ["number"], "postprocess": id},
    {"name": "data_type", "symbols": ["string_literal"], "postprocess": id},
    {"name": "data_type", "symbols": ["array"], "postprocess": id},
    {"name": "data_type", "symbols": ["boolean_literal"], "postprocess": id},
    {"name": "data_type", "symbols": ["map"], "postprocess": id},
    {"name": "data_type", "symbols": ["call_statement"], "postprocess": id},
    {"name": "comparison_expr", "symbols": ["additive_expr"], "postprocess": id},
    {"name": "comparison_expr", "symbols": ["comparison_expr", "_", (lexer.has("comparison_operator") ? {type: "comparison_operator"} : comparison_operator), "_", "additive_expr"], "postprocess": d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] })},
    {"name": "additive_expr", "symbols": ["multiplicative_expr"], "postprocess": id},
    {"name": "additive_expr", "symbols": ["additive_expr", "_", (lexer.has("additive_operator") ? {type: "additive_operator"} : additive_operator), "_", "multiplicative_expr"], "postprocess": d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] })},
    {"name": "multiplicative_expr", "symbols": ["exponent_expr"], "postprocess": id},
    {"name": "multiplicative_expr", "symbols": ["multiplicative_expr", "_", (lexer.has("multiplicative_operator") ? {type: "multiplicative_operator"} : multiplicative_operator), "_", "exponent_expr"], "postprocess": d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] })},
    {"name": "exponent_expr", "symbols": ["primary_expr", "_", (lexer.has("exponent") ? {type: "exponent"} : exponent), "_", "exponent_expr"], "postprocess": d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] })},
    {"name": "exponent_expr", "symbols": ["primary_expr"], "postprocess": d => d[0]},
    {"name": "primary_expr", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "primary_expr", "symbols": [{"literal":"!"}, "expression"], "postprocess": d => ({ type: "unary_node", operator: "!", operand: d[1] })},
    {"name": "primary_expr", "symbols": ["data_type"], "postprocess": id},
    {"name": "member_expr", "symbols": ["base_expr", "_", (lexer.has("dot") ? {type: "dot"} : dot), "_", "identifier"], "postprocess": 
        d => ({ type: "member_node", object: d[0], property: d[4] })
                },
    {"name": "member_expr", "symbols": ["member_expr", "_", (lexer.has("dot") ? {type: "dot"} : dot), "_", "identifier"], "postprocess": 
        d => ({ type: "member_node", object: d[0], property: d[4] })
                },
    {"name": "call_statement", "symbols": ["function_name", "_", {"literal":"("}, "_", "parameter_list", "_", {"literal":")"}], "postprocess": 
        d => {
            return ({
            type: "call_statement",
            function: d[0],
            parameters: d[4]
        })}
            },
    {"name": "function_name", "symbols": ["identifier"], "postprocess": id},
    {"name": "parameter_list", "symbols": [], "postprocess": () => []},
    {"name": "parameter_list", "symbols": ["expression"], "postprocess": d => [d[0]]},
    {"name": "parameter_list", "symbols": ["expression", "_", {"literal":","}, "_", "parameter_list"], "postprocess": 
        d => [d[0], ...d[4]]
                },
    {"name": "array", "symbols": [{"literal":"["}, "_", "element_list", "_", {"literal":"]"}], "postprocess": d => ({ type: "array", value: d[2] })},
    {"name": "element_list", "symbols": [], "postprocess": () => []},
    {"name": "element_list", "symbols": ["element"], "postprocess": d => [d[0]]},
    {"name": "element_list", "symbols": ["element", "_", {"literal":","}, "_", "element_list"], "postprocess": d => [d[0], ...d[4]]},
    {"name": "element", "symbols": ["expression"]},
    {"name": "boolean_literal", "symbols": [{"literal":"true"}], "postprocess": 
        d => ({
            type: "boolean_literal",
            value: true,
            start: tokenStart(d[0]),
            end: tokenEnd(d[0])
        })
                },
    {"name": "boolean_literal", "symbols": [{"literal":"false"}], "postprocess": 
        d => ({
            type: "boolean_literal",
            value: false,
            start: tokenStart(d[0]),
            end: tokenEnd(d[0])
        })
                },
    {"name": "line_comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": convertTokenId},
    {"name": "question_mark", "symbols": [(lexer.has("question_mark") ? {type: "question_mark"} : question_mark)], "postprocess": convertTokenId},
    {"name": "colon", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon)], "postprocess": convertTokenId},
    {"name": "string_literal", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": convertTokenId},
    {"name": "number", "symbols": [(lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": convertTokenId},
    {"name": "nil", "symbols": [(lexer.has("nil_literal") ? {type: "nil_literal"} : nil_literal)], "postprocess": convertTokenId},
    {"name": "map", "symbols": [{"literal":"{"}, "_", "key_value_list", "_", {"literal":"}"}], "postprocess": 
        d => ({
            type: "map",
            value: d[2],
            start: tokenStart(d[0]),
            end: tokenEnd(d[0])
        })
            },
    {"name": "key_value_list", "symbols": [], "postprocess": () => []},
    {"name": "key_value_list", "symbols": ["key_value_pair"], "postprocess": d => [d[0]]},
    {"name": "key_value_list", "symbols": ["key_value_pair", "_", {"literal":","}, "_", "key_value_list"], "postprocess": 
        d => [d[0], ...d[4]]
            },
    {"name": "key_value_pair", "symbols": ["identifier", "_", {"literal":":"}, "_", "expression"], "postprocess": 
        d => ({
            key: d[0],
            value: d[4]
        })
            },
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": convertTokenId},
    {"name": "func_identifier", "symbols": [(lexer.has("func_identifier") ? {type: "func_identifier"} : func_identifier)], "postprocess": convertTokenId},
    {"name": "_ml$ebnf$1", "symbols": []},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "multi_line_ws_char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "multi_line_ws_char", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "multi_line_ws_char", "symbols": [{"literal":"\n"}]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
