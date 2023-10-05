@{%
const moo = require("moo");

const lexer = moo.compile({
    exponent: ["^", "**"],
    additive_operator: ["+", "-"],
    multiplicative_operator: ["*", "/", "%"],
    comparison_operator: ["<", "<=", ">", ">=", "==", "!=", "??", "matches", "contains", "startsWith", "endsWith"],
    dot_member_operator: [".", "?."],
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
    match: /[a-zA-Z_][a-zA-Z_0-9]*/,
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

%}

@lexer lexer

input -> top_level_statements {% id %}

top_level_statements
    ->  top_level_statement
        {%
            d => [d[0]]
        %}
    |  top_level_statement _ "\n" _ top_level_statements
        {%
            d => [
                d[0]   ,
                ...d[4]
            ]
        %}
    # below 2 sub-rules handle blank lines
    |  _ "\n" top_level_statements
        {%
            d => d[2]
        %}
    |  _
        {%
            d => []
        %}

top_level_statement
    ->  expression    {% id %}
    | statement       {% id %}

statement
    -> line_comment   {% id %}

expression
    ->  ternary_expr   {% id %}

ternary_expr
    -> base_expr _ %question_mark _ ternary_expr _ %colon _ ternary_expr
        {% d => ({ type: "ternary_node", condition: d[0], trueExpr: d[4], falseExpr: d[8] }) %}
    | base_expr {% id %}

base_expr
    -> 
    comparison_expr {% id %}

data_type
    -> dot_member_operator {% id %} 
    | call_statement       {% id %}
    | nil                  {% id %}
    | number               {% id %}
    | string_literal       {% id %}
    | array                {% id %}
    | boolean_literal      {% id %}
    | map                  {% id %}

bracket_operator
    -> dot_member_operator "[" _ bracket_value _ "]" 
        {% d => ({
            type: "member_node",
            node: d[0],
            property: d[3]
        }) %}

bracket_value
    -> string_literal   {% id %}
    | number            {% id %}
    |  %colon _ number 
        {% d => ({ type: "slice_node", from: null, to: d[2] }) %}
    | number _ %colon 
        {% d => ({ type: "slice_node", from: d[0], to: null }) %}
    | number _ %colon _ number 
        {% d => ({ type: "slice_node", from: d[0], to: d[4] }) %}
    | %colon {% d => ({ type: "slice_node", from: null, to: null }) %}

dot_member_operator
    -> dot_member_base_expression %dot_member_operator identifier
        {% d => ({
            type: "member_node",
            node: d[0],
            property: d[2].value,
            optional: d[1].type === "dot_member_operator" && d[1].value === "?."
        }) %}
    | dot_member_base_expression "[" _ bracket_value _ "]"
        {% d => ({
            type: "member_node",
            node: d[0],
            property: d[3],
        }) %}

dot_member_base_expression
    -> dot_member_operator   {% id %}
    | identifier             {% id %}
    | map                    {% id %}
    | array                  {% id %}


comparison_expr
    -> additive_expr {% id %}
    | comparison_expr _ %comparison_operator _ additive_expr
        {% d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] }) %}
    
additive_expr
    -> multiplicative_expr {% id %}
    | additive_expr _ %additive_operator _ multiplicative_expr
        {% d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] }) %}

multiplicative_expr
    -> exponent_expr {% id %}
    | multiplicative_expr _ %multiplicative_operator _ exponent_expr
        {% d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] }) %}

exponent_expr
    -> primary_expr _ %exponent _ exponent_expr
        {% d => ({ type: "binary_node", operator: d[2].value, left: d[0], right: d[4] }) %}
    | primary_expr {% d => d[0] %}


primary_expr
    -> "(" _ expression _ ")" {% d => d[2] %}
    # | "!" expression {% d => ({ type: "unary_node", operator: "!", operand: d[1] }) %}
    | data_type {% id %} 


call_statement -> function_name _ "(" _ parameter_list _ ")" 
    {%
        d => {
            return ({
            type: "call_statement",
            function: d[0],
            parameters: d[4]
        })}
    %}
    
function_name -> identifier  {% id %} 

parameter_list
    -> null        {% () => [] %}
    | expression   {% d => [d[0]] %}
    | expression _ "," _ parameter_list
        {%
            d => [d[0], ...d[4]]
        %}

array -> "[" _ element_list _ "]" {% d => ({ type: "array", value: d[2] }) %}

element_list -> null {% () => [] %} 
             | element {% d => [d[0]] %} 
             | element _ "," _ element_list {% d => [d[0], ...d[4]] %} 

element -> expression

boolean_literal
    -> "true"
        {%
            d => ({
                type: "boolean_literal",
                value: true,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}
    |  "false"
        {%
            d => ({
                type: "boolean_literal",
                value: false,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}


line_comment -> %comment {% convertTokenId %}

question_mark -> %question_mark {% convertTokenId %}

colon -> %colon {% convertTokenId %}

string_literal -> %string_literal {% convertTokenId %}

number -> %number_literal {% convertTokenId %}

nil -> %nil_literal {% convertTokenId %}

map -> "{" _ key_value_list _ "}"
    {%
        d => ({
            type: "map",
            value: d[2],
            start: tokenStart(d[0]),
            end: tokenEnd(d[0])
        })
    %}

key_value_list -> null {% () => [] %}
    | key_value_pair {% d => [d[0]] %}
    | key_value_pair _ "," _ key_value_list
    {%
        d => [d[0], ...d[4]]
    %}

key_value_pair -> identifier _ ":" _ expression
    {%
        d => ({
            key: d[0],
            value: d[4]
        })
    %}

identifier -> %identifier {% convertTokenId %}

func_identifier -> %func_identifier {% convertTokenId %} 

_ml -> multi_line_ws_char:*

multi_line_ws_char
    -> %ws
    |  "\n"

__ -> %ws:+

_ -> %ws:*
