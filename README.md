# expr-js

The aim of this project is to build a 1 line web expression editor, inspired by https://expr.medv.io/playground.

With this expressions editor, admin can define complex expression & logic without the help of developer.
## Example Use Case
```javascript
sum([1,2,3,4,5]) == 15 ? true : false
split(" 1, 2 ")
```

## Supported Literals
<table>
    <tr>
        <td>Comment</td>
        <td>
             <code>#</code>
        </td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>
            <code>true</code>, <code>false</code>
        </td>
    </tr>
    <tr>
        <td>Number</td>
        <td>
            <code>42</code>, <code>42.24</code>
        </td>
    </tr>
    <tr>
        <td>String</td>
        <td>
            <code>"foo"</code>, <code>'bar'</code>
        </td>
    </tr>
    <tr>
        <td>Array</td>
        <td>
            <code>[1, 2, 3]</code>
        </td>
    </tr>
    <tr>
        <td>Map</td>
        <td>
            <code>&#123;a: 1, b: 2, c: 3&#125;</code>
        </td>
    </tr>
    <tr>
        <td>Nil</td>
        <td>
            <code>nil</code>
        </td>
    </tr>
</table>

## The grammar that currently support
<table>
    <tr>
        <td>Arithmetic</td>
        <td>
            <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code> (modulus), <code>^</code> or <code>**</code> (exponent)
        </td>
    </tr>
    <tr>
        <td>Comparison</td>
        <td>
            <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>
        </td>
    </tr>
    <tr>
        <td>Logical</td>
        <td>
            <code>not</code> or <code>!</code>, <code>and</code> or <code>&amp;&amp;</code>, <code>or</code> or <code>||</code>
        </td>
    </tr>
    <tr>
        <td>Conditional</td>
        <td>
            <code>?:</code> (ternary), <code>??</code> (nil coalescing)
        </td>
    </tr>
</table>

## The grammar that currently working on 
<table>
    <tr>
        <td>Membership</td>
        <td>
            <code>[]</code>, <code>.</code>, <code>?.</code>, <code>in</code>
        </td>
    </tr>
    <tr>
        <td>String</td>
        <td>
            <code>+</code> (concatenation), <code>contains</code>, <code>startsWith</code>, <code>endsWith</code>
        </td>
    </tr>
    <tr>
        <td>Regex</td>
        <td>
            <code>matches</code>
        </td>
    </tr>
    <tr>
        <td>Range</td>
        <td>
            <code>..</code>
        </td>
    </tr>
    <tr>
        <td>Slice</td>
        <td>
            <code>[:]</code>
        </td>
    </tr>
    <tr>
        <td>Pipe</td>
        <td>
            <code>|</code>
        </td>
    </tr>
</table>
