# expr-js

The aim of this project is to build a 1 line web expression editor, inspired by https://expr.medv.io/playground.

## Example Use Case
```javascript
sum([1,2,3,4,5])
split(" 1, 2 ")
```

## The grammar that currently support
|||
| ------------- | ------------- |
| Arithmetic |	+, -, *, /, % (modulus), ^ or ** (exponent) |
| Comparison |	==, !=, <, >, <=, >= |
| Logical |	not or !, and or &&, or or || |
| Conditional |	?: (ternary), ?? (nil coalescing) |

## To add grammar
|||
| ------------- | ------------- |
| Membership |	[], ., ?., in |
| String |	+ (concatenation), contains, startsWith, endsWith |
| Regex |	matches |
| Range |	.. |
| Slice |	[:] |
| Pipe |	| |