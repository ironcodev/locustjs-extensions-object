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
## `isSubClassOf(parentClass)`
Checks whether a Class is a sub-class of `parentClass` or not and returns `true` | `false`.

Example:
```javascript
class Foo { }
class Bar extends Foo { }
class Buz { }

Bar.isSubClassOf(Foo);  // true
Buz.isSubClassOf(Foo);  // false
```

## `toJson(obj, replacer, space, filter)`
Serializes `obj` into json format using `JSON.stringify` function.

Example 1: 
```javascript
const x = { name: 'John Doe', age: 23 };

// call directly
console.log(toJson(x));  // { "name": "John Doe", "age": 23 }

// as an extension method
console.log(x.toJson());  // { "name": "John Doe", "age": 23 }
```

It also supports cleaning the object before serialization (the cleaning is not applied to source object).

Example 2: 
```javascript
const x = { name: 'John Doe', address: null, scores:[], zip: "", age: 0, parent: {} };

console.log(toJson(x, "all"));
// { "name": "John Doe" }
// all props with null, undefined, 0, empty array, empty object values are filtered or ignored
```

## `merge(obj, obj1, obj2, ...)`
While `Object.assign()` and `destructure ... operator` perform shallow merge, the `merge` function provides deep merging.
It should be noted that The source object is affected.

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

## `query(obj, path)`
Queries `obj` based on given `path`.

Example:
```javascript
const x = {
    name: 'John',
    address: {
        city: { id: 10, name: 'Tehran' },
        zip: '12345678'
    }
};

console.log(query(x, 'name'));	// John
console.log(query(x, 'address.city'));	//	{ id: 10, name: 'Tehran' }
console.log(query(x, 'address.city.id'));	// 10
console.log(query(x, 'address.city.name.length'));	// 6
console.log(query(x, 'address.city.state.code'));	// undefined
console.log(query(x, 'address.city.code'));	// undefined
console.log(query(x, 'age'));	// undefined
```

## `toArray(obj, type)`
Converts an object to an array. The result depends on `type`. Possible values are as follows:

- `key-value` or `key/value` or `keyvalue`: returns an array of key/value items where each key/value is an array with 2 items, the first item is key, the second is value.
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

`toArray` function is best used in sending array of objects in the form of array of arrays and minimizing the length of json serialization result. It does this by factorizing prop names, producing a result whose size 30% less.

```javascript
const data = [
	{ id: 1, name: "John", age: 34 },
	{ id: 2, name: "Jade", age: 33 },
	{ id: 3, name: "Joe", age: 28 },
	{ id: 4, name: "Jane", age: 31 },
	{ id: 5, name: "Jake", age: 29 },
]

const schema = toArray(data[0], "schema");
const items = data.map(x => toArray(x, "values"));
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

 `toArray` carries out reverse of a method named `toObject()` that is an extension method defined in [`@locustjs/extensions-array`](https://github.com/ironcodev/locustjs-extensions-array).

We can utilize `toObject` to restore back all objects from array format.

```javascript
// Sender:
const data = [
	{ id: 1, name: "John", age: 34 },
	{ id: 2, name: "Jade", age: 33 },
	{ id: 3, name: "Joe", age: 28 },
	{ id: 4, name: "Jane", age: 31 },
	{ id: 5, name: "Jake", age: 29 },
]

const schema = toArray(data[0], "schema");
const items = data.map(x => toArray(x, "values"));
const newData = { schema, items }

// we now send newData over network to another party

// Receiver:
// the other party can restore back all objects.
const restoredData = newData.items.map(x => toObject(x, 'values', newData.schema))

// to testify that restoredData is the same shape as the original 'data',
// we can serialize them to json. they will both produce the same json.

const json1 = JSON.stringify(data);
const json2 = JSON.stringify(restoredData);

console.log(json1 == json2);	// true
```
