# About
This library contains extension methods for `Object`.

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

# function methods
## `isSubClassOf(obj, classType)`
Checks whether `obj` is a sub-class of `classType` or not and returns `true` | `false`.

Example:
```javascript
class Foo { }
class Bar extends Foo { }
class Buz { }

const x = new Bar();

// call directly
console.log(isSubClassOf(x, Bar));  // true
console.log(isSubClassOf(x, Foo));  // true
console.log(isSubClassOf(x, Buz));  // false

// as an extension method
console.log(x.isSubClassOf(Bar));  // true
console.log(x.isSubClassOf(Foo));  // true
console.log(x.isSubClassOf(Buz));  // false
```

## `toJson(obj, replacer, space)`
Serializes `obj` into json format using `JSON.stringify` function.

Example:
```javascript
const x = { name: 'John Doe', age: 23 };

// call directly
console.log(toJson(x));  // { "name": "John Doe", "age": 23 }

// as an extension method
console.log(x.toJson());  // { "name": "John Doe", "age": 23 }
```

## `merge(obj, obj1, obj2, ...)`
Performs a deep merge on `obj` by given objects. `obj` will be affected.

Example:
```javascript
const x = { name: 'John' };
const a = { a: 10 }
const b = { b: 'test' }

// call directly
console.log(merge(x, a, b));  // { name: 'John', a: 10, b: 'test' }

// as an extension method
console.log(x.merge(a, b));  // { name: 'John', a: 10, b: 'test' }
```

## `flatten(obj, separator)`
Flattens `obj` properties and returns an object whose properties has only primitive values. The default separator in separating property names is dot character.

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

## `unflatten(obj, separator)`
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

// call directly
const f1 = flatten(x);
const y1 = f1.unflatten();

// as an extension method
const f2 = x.flatten();
const y2 = f2.unflatten();

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

## `toArray(obj, type)`
Converts an object to an array. The result depends on `type`. Possible values are as follows:

- `key-value`: returns an array of key/value items where each key/value is an array with 2 items, the first item is key, the second is value.
- `values`: retuns only values of properties as an array.
- `keys` or `schema`: returns only property names as an array.

`toArray` is similar to `Object.entries()`. It performs a recursive/nested invokation on object property values whereas `Object.entries()` only acts on the first-level of properties.

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

This function carries out reverse of `toObject()` extension method in [`@locustjs/extensions-array`](https://github.com/ironcodev/locustjs-extensions-array).
