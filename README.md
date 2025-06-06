# About
This library contains helpful methods that work on any object. They can be configured as extensions as well to work without being imported or invoked directly on `Object`.

# Install
```
npm i @locustjs/extensions-object
```

# Usage

CommonJs
```javascript
var someFn = require('@locustjs/extensions-object').someFn;
```

ES6
```javascript
import { someFn } from '@locustjs/extensions-object'
```

## Current Version
```
2.3.3
```

# Functions
- `isSubClassOf` 
- `toJson`		 
- `merge` 
- `clean` 
- `flatten` 
- `unflatten` 
- `query` 
- `set` 
- `foreach` 
- `toArray` 
- `keys`

# configuring as extensions
Using `configureObjectExtensions()` function, we can configure any of the above functions as an extension method on any variable or value or directly on `Object`.

```javascript
import { configureObjectExtensions } from "@locustjs/extensions-object";

configureObjectExtensions("query,set");	// only configure 'query' and 'set'
```

Configuring object extensions should normally happen at the start of an application.

We can then use `query()` and `set()` anywhere in our application on any variable or on `Object`.

```javascript
const x = { a: 10, b: 'john' }

console.log(x.query('a'));
console.log(Object.query(x, 'a'));
```

In order to configure all extensions, we can pass nothing or `*` to `configureObjectExtensions()`.

```javascript
import { configureObjectExtensions } from "@locustjs/extensions-object";

configureObjectExtensions();	// configure all extensions
```

## `isSubClassOf(ChildClass, ParentClass)`
Checks whether a Class is a sub-class of `ParentClass` or not.

Example:
```javascript
class Foo { }
class Bar extends Foo { }
class Buz { }

console.log(isSubClassOf(Bar, Foo));  // true
console.log(isSubClassOf(Buzz, Foo));  // false
```

If configured as an extension, it can be called over classes directly.

```javascript
...
Bar.isSubClassOf(Foo);  // true
Buz.isSubClassOf(Foo);  // false
```

## `toJson(obj, filter, replacer, space)`
Serializes `obj` into json format using `JSON.stringify` function.

Example 1: 
```javascript
const x = { name: 'John Doe', age: 23 };

// call directly
console.log(toJson(x));  // { "name": "John Doe", "age": 23 }

// as an extension method
console.log(x.toJson());  // { "name": "John Doe", "age": 23 }
```

`filter` argument is used for cleaning the object. `replacer` and `space` works the same way as in `JSON.stringify`.

The benefit of `toJson()` is that it supports cleaning the object before serialization.

By default it cleans `empty` values (`null`, `undefined`, `NaN`, empty strings). The cleaning can be extended for other empty values such as empty objects or zero numbers as it is explaind in `clean()` method.

Example 2:
```javascript
const x = { name: 'John Doe', address: null, scores:[], zip: "", age: 0, parent: {} };

console.log(toJson(x, "all"));
// { "name": "John Doe" }
// all props with null, undefined, 0, empty array, empty object values are filtered or ignored
```

Note that, the cleaning `toJson` provides is not applied to the source object.

## `merge(obj, obj1, obj2, ...)`
`Object.assign()` and `destructure ... operator` perform shallow merge. `merge` function provides deep merge.
The source object is affected.

Example:
```javascript
const a = { person: { name: 'John' } };
const b = { person: { age: 23 } }

console.log(Object.assign({}, a, b));	// { person: { age: 23 } }
console.log({ ...a, ...b });	// { person: { age: 23 } }

// call directly
console.log(merge(a, b));  // { person: { name: 'John', age: 23 } }

// as an extension method
console.log(a.merge(b));
```

## `flatten(obj, separator = '.')`
Flattens `obj` properties and returns an object whose properties has only primitive values.

Example:
```javascript
const x = {
    name: 'John',
    address: {
        city: { id: 10, name: 'Tehran' },
        zip: '12345678'
    }
};

// call directly
console.log(flatten(x));
/*
{
    'name': 'John',
    'address.city.id': 10,
    'address.city.name': 'Tehran',
    'address.zip': '12345678',
}
*/

// as an extension method
console.log(x.flatten());
```

If value of a prop is array, its items are flattened.

Example:
```javascript
const x = {
	name: "John",
	info: {
		scores: [
		{ exam: { id: 100, name: "Mathematics I" }, score: "A" },
		{ exam: { id: 102, name: "Physics I" }, score: "B" },
		],
	},
};

console.log(flatten(x));
/*
{
	name: 'John',
	'info.scores': [
		{ 'exam.id': 100, 'exam.name': 'Mathematics I', score: 'A' },
		{ 'exam.id': 102, 'exam.name': 'Physics I', score: 'B' }
	]
}
*/
```

## `unflatten(obj, separator = '.')`
Unflattens a flattened `obj`. See `flatten` method.

Example:
```javascript
const x = {
    name: 'John',
    address: {
        city: { id: 10, name: 'Tehran' },
        zip: '12345678'
    }
};

let y, z;
// call directly
y = flatten(x);
z = unflatten(y);

// as an extension method
y = x.flatten();
z = y.unflatten();

console.log(y1);
console.log(y2);
/*
{
    name: 'John',
    address: {
        city: { id: 10, name: 'Tehran' },
        zip: '12345678'
    }
}
*/
```

## `query(obj: any, path: string): any`
This function reads a value from an object based on the given `path`.

```javascript
const obj = {
    name: 'ali',
    address: {
        id: 123,
        city: {
            name: 'tehran',
            phone: '22334455'
        }
    },
    marks: [19.5, 18.25, 15],
    locations: [
        { x: 34.5, y: 32.26, name: 'home' },
        { x: 20.1, y: 30.78, name: 'work' },
        { x: 18.7, y: 29.01, name: 'parents' },
    ],
    points: {
        likes: [
            {
                source: {
                    page: {
                        id: 8001,
                        tags: ['earth', 'mars', 'venus']
                    }
                }
            }
        ]
    },
    data: [
        [
            ['code', '1234'],
            ['active', true],
        ],
        [100, 101, 102, 103],
        [
            [
                { page: 324, from: 200, to: 300 }
            ],
            {
                form: 'frm-filter',
                checks: [11, 15, 8]
            }
        ]
    ]
}

query(obj, 'name')    // ali
query(obj, 'address.id')    // 123
query(obj, 'address.city.name')    // tehran
query(obj, 'marks[2]')    // 15
query(obj, 'locations[1].name')    // work
query(obj, 'points.likes[0].source.page.tags[1]')    // mars
query(obj, 'data[0][1][0]')    // active
query(obj, 'data[1][12]')    // undefined
query(obj, 'data[1][2]')    // 102
query(obj, 'data[2][0][0].page')    // 324
query(obj, 'data[2][1].checks[1]')    // 15
```

## `set(obj: any, path: string, value: any): object`
This function sets a value on an object based on a given `path`. The source object is affected.

```javascript
let obj = { }

set(obj, 'a', 10)    // { a: 10 }
set(obj, 'a.b', true)    // { a: { b: true } }
set(obj, 'a[1]', 'ali')    // { a: [null, 'ali'] }
set(obj, 'a[1][2]', 'ali')    // { a: [null, [null, null, 'ali']] }
set(obj, 'a[1][2].name', 'ali')    // { a: [null, [null, null, { name: 'ali' }]] }
set(obj, 'a[1][2].name.fn', 'ali')    // { a: [null, [null, null, { name: { fn: 'ali' } }]] }
set(obj, 'a[1].name', 'ali')    // { a: [null, { name: 'ali' }] }
set(obj, 'a[1].name[0]', 'ali')    // { a: [null, { name: ['ali'] }] }

obj = [];

set(obj, '[1]', 'ali')    // [null, 'ali']
set(obj, '[1][2]', 'ali')    // [null, [null, null, 'ali']]
set(obj, '[1].name', 'ali')    // [null, { name: 'ali' }]
```

## `foreach(x: any, callback: function): array`
Iterates over `x` and calls `callback` on each iteration. `x` could be an `array` or an object. If `x` is object, `foreach` iterates over its properties. At the end, it returns an array of `callback`'s return value.

The `callback` function has a single parameter with the following structure:

```javascript
{
    source: any,            // main object
    index: number,          // iteration number
    key: string | number    // in objects: current prop name; in arrays:, current index
    value: any,             // current value
    count: number           // in objects: number of props; in arrays: array length
}
```

Example 1: iterate an object
```javascript
const obj = { name: 'ali', age: 23, sex: true }

foreach(obj, ({ index, key, value }) => console.log(`${index}: ${key} = ${value}`));

/*
0: name = ali
1: age = 23
2: sex = true
*/
```

`query()`, `set` and `foreach` are defined in [@locustjs/base](https://github.com/ironcodev/locustjs-base.git) package. For more examples, refer to that package.

## `clean(obj, filter = 'empty')`
Removes empty props (`null`, `undefined`, `NaN`, zero-length strings) from an object.

```javascript
const x = { a: 10, b: null, c: undefined };
const y = x.clean();

console.log(y);	// { a: 10 }
```

The second argument `filter` can be used to customize how clean works or what type of values are removed.
For example we can ask to remove only props with `undefined` values.

```javascript
const x = { a: 10, b: null, c: undefined };
const y = x.clean('undefined');

console.log(y);	// { a: 10, b: null }
```

We can specify a comma-separated list of types for `flter` argument. Possible values are:

- `null`
- `undefined`
- `zero`: (zero numbers)
- `object`: empty objects ( `{}`)
- `array`: empty arrays (`[]`)
- `string`: zero-length strings
- `nan`: NaN
- `whitespace`: whitespace-only strings
- `empty`: `null`, `undefined`, `NaN`, zero-length strings
- `all`: anything that can be assuemd as an empty value.

Default value for `filter` is `empty`.

```javascript
const x = {
	a: 10,
	b: null,
	c: undefined,
	d: [],
	e: {},
	f: 0,
	g: "",
	h: "   ",
};
const y = x.clean("all");

console.log(y);	// { a: 10 }
```

It is important to note that `clean` performs recursively.

```javascript
const x = {
	a: 10,
	b: { x: null },
	c: [{ n: 0 }, { n: 10, m: '' }, null, {}],
	d: { m: { p: '   ' } }
};
const y = x.clean("all");

console.log(y);	// { a: 10, c: [ { n: 10 } ] }
```

## `toArray(obj, type)`
Converts an object to an array. The result depends on `type`. Possible values are:

- `key-value`, `key/value` or `keyvalue`: returns an array of key/value items where each key/value is an array with 2 items, the first is key (prop name), the second is value (prop value).
- `values`: retuns only values of properties as an array.
- `keys` or `schema`: returns only property names as an array.

`toArray` is similar to the native `Object.entries()` function. It performs a recursive/nested invokation on object property values whereas `Object.entries()` only acts on the first-level of properties.

Example:
```javascript
const x = {
    name: 'John',
    address: {
        city: { id: 10, name: 'Tehran' },
        zip: '12345678'
    },
    age: 23
};

// ==== type: key-value =====
// call directly
console.log(toArray(x, `key-value`));

// as an extension method
console.log(x.toArray('key-value'));
/*
[
	["name", "John"],
	[
		"address",
		[
			[
				"city",
				[
					["id", 10],
					["name", "Tehran"]
				]
			],
			["zip", "12345678"]
		]
	],
	["age", 23]
]
*/

// ==== type: values =====
// call directly
console.log(toArray(x, `values`));

// as an extension method
console.log(x.toArray('values'));
/*
[
	"ali",
	[
		[10, "Tehran"],
		"123456789"
	],
	23
]
*/

// ==== type: keys =====
// call directly
console.log(toArray(x, 'keys'));

// as an extension method
console.log(x.toArray('keys'));
/*
[
	"name",
	[
		"address",
		[
			[
				"city",
				[
					"id",
					"name"
				]
			],
			"zip"
		]
	],
	"age"
]
*/
```

`toArray` function is best used in sending array of objects in the form of array of arrays and minimizing the length of json serialization result. It does this by factorizing prop names, producing a result whose size is 30% less.

```javascript
const data = [
	{ id: 1, name: "John", age: 34 },
	{ id: 2, name: "Jade", age: 33 },
	{ id: 3, name: "Joe", age: 28 },
	{ id: 4, name: "Jane", age: 31 },
	{ id: 5, name: "Jake", age: 29 },
]

const schema = data[0].toArray("schema");
const items = data.map(x => x.toArray("values"));
const newData = { schema, items }

const json1 = JSON.stringify(data);
const json2 = JSON.stringify(newData);

console.log(`Serialization size:`)
console.log(`	Normal way: ${json1.length}`)
console.log(`	toArray(): ${json2.length}`)
console.log(`	Improvement: ${Math.round((json1.length - json2.length) / json1.length * 100, 2)}%`)

/* Output:
Serialization size:
	Normal way: 160
	toArray(): 109
	Improvement: 32%
*/
```

 The reverse of `toArray` is a method named `toObject()` that is defined in [`@locustjs/extensions-array`](https://github.com/ironcodev/locustjs-extensions-array).

We can utilize `toObject` to restore back all objects from array format.

```javascript
// Sender:
const originalData = [
	{ id: 1, name: "John", age: 34 },
	{ id: 2, name: "Jade", age: 33 },
	{ id: 3, name: "Joe", age: 28 },
	{ id: 4, name: "Jane", age: 31 },
	{ id: 5, name: "Jake", age: 29 },
]

const schema = originalData[0].toArray("schema");
const items = originalData.map(x => x.toArray("values"));
const sendData = { schema, items }

// we now send data over network to another party

// Receiver:
// the other party can restore back all objects.
const restoredData = sendData.items.map(x => x.toObject('values', sendData.schema))

// to testify that restoredData is the same shape as the original data,
// we can serialize them to json. they will both produce the same json.

const json1 = JSON.stringify(originalData);
const json2 = JSON.stringify(restoredData);

console.log(json1 == json2);	// true
```

## `keys(obj, separator)`
If configured using `configureObjectExtensions()`, it extends `Object.keys()` functionality by accepting a custom separator.

```javascript
import { configureObjectExtensions } from "@locustjs/extensions-object";

configureObjectExtensions("keys");	// only configure 'keys'

const x = { name: "john", age: 23, city: "London" }

console.log(Object.keys(x, "."));	// name.age.city
```
