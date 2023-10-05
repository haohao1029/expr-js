const nearley = require("nearley");
const grammar = require("./grammar.js");
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const author = {
  name: "John Doe",
};
// parser.feed(`[1,2,3,4,5][0:1]`);
parser.feed(`author.name?.length`);

for (let i = 0; i < parser.results.length; i++) {
  for (let j = 0; j < parser.results[i].length; j++) {
    const statement = parser.results[i][j];
    console.log(statement);
    ans = interpret(statement);
    // console.log(ans);
  }
}

function interpret(ast) {
  switch (ast.type) {
    case "call_statement":
      return executeFunction(
        ast.function,
        ast.parameters.map((item) => {
          return interpret(item);
        })
      );
    case "array":
      //   console.log(ast.value);
      return ast.value.map((item) => {
        return interpret(item[0]);
      });
    case "number_literal":
      return ast.value;
    case "string_literal":
      return ast.value;
    case "boolean_literal":
      return ast.value;
    case "nil_literal":
      return ast.value;
    case "binary_node":
      return applyBinaryOperator(
        ast.operator,
        interpret(ast.left),
        interpret(ast.right)
      );
    case "member_node":
      const object = interpret(ast.node); // Interpret the base object first
      
      // Handle optional chaining: if object is null or undefined, return undefined
      if (ast.optional && (object === null || object === undefined)) {
        return undefined;
      }
      
      if (typeof ast.property === 'string') {
        return object[ast.property];
      }

      if (ast.property?.type === "slice_node") {
        return sliceValue(
          object,
          ast.property.from ? interpret(ast.property.from) : 0,
          ast.property.to ? interpret(ast.property.to) : undefined
        );
      }
      break;


    case "identifier":
      return global[ast.value];
    default:
      throw new Error(`Unknown AST node type: ${ast.type}`);
  }
}

function executeFunction(func, args) {
  switch (func.value) {
    case "int":
      return parseInt(args[0]);
    case "float":
      return parseFloat(args[0]);
    case "str":
      return args[0].toString();
    case "trim":
      return args[0].trim();
    case "sum":
      ans = args[0].reduce((acc, val) => acc + val, 0);
      return ans;
    case "now":
      return new Date();
    case "date":
      return date(args[0]);
    case "duration":
      return duration(args[0]);
    case "abs":
      return Math.abs(args[0]);
  }

  throw new Error(`Unknown function: ${func.value}`);
}

function applyBinaryOperator(operator, left, right) {
  switch (operator) {
    case "+":
      if (left instanceof Date && typeof right === "number") {
        return new Date(left.getTime() + right);
      }
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "==":
      return left == right;
    case "!=":
      return left != right;
    case "&&":
      return left && right;
    case "||":
      return left || right;
    case ">":
      return left > right;
    case "<":
      return left < right;
    case ">=":
      return left >= right;
    case "<=":
      return left <= right;
    case "contains":
      return left.includes(right);
    case "matches":
      return left.match(right);
    case "??":
      return left ?? right;

    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

function duration(value) {
  const unitMappings = {
    ns: 1e-6, // nanoseconds to milliseconds
    us: 1e-3, // microseconds to milliseconds
    µs: 1e-3, // also microseconds to milliseconds
    ms: 1, // milliseconds to milliseconds
    s: 1000, // seconds to milliseconds
    m: 1000 * 60, // minutes to milliseconds
    h: 1000 * 60 * 60, // hours to milliseconds
  };

  const matches = value.match(/(\d+)(ns|us|µs|ms|s|m|h)/);
  if (matches) {
    const quantity = parseInt(matches[1], 10);
    const unit = matches[2];
    return quantity * unitMappings[unit];
  }

  throw new Error(`Invalid duration format: ${value}`);
}

function date(value) {
  return new Date(value);
}

function sliceValue(value, from, to) {
  if (Array.isArray(value)) {
    return value.slice(from, to);
  } else {
    throw new Error(`Cannot slice a value of type ${typeof value}`);
  }
}
