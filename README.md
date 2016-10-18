# decode-js

Make working with JSON in your application more reliable and explicit. Strongly inspired by Elm's [JSON Decoding library](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode).

# Install

```
npm install --save decode-js
```

# Example

Given the following JSON:

```js
{
  name_one: 'Jack',
  name_two: 'Franklin',
  age: 24,
  favourites: {
    color: 'red',
  },
  likes_javascript: true
}
```

We want to not only check that the types are as expected, but do some tidying of the data:

- `name_one` and `name_two` should become `firstName` and `lastName`
- `favourites.color` needs to be `favourites.colour`, we're not animals!
- `likes_javascript` should be `likesJS`

We can type check and rename easily with decode-js:

```js
import {
  createDecoder,
  object,
  boolean,
  string,
  number,
  rename
} from 'decode-js';

const decoder = createDecoder({
  firstName: rename('name_one', string),
  lastName: rename('name_two', string),
  age: number,
  favourites: object({
    colour: rename('colour', string),
  }),
  likesJS: rename('likes_javascript', boolean),
});
```

We can then parse some JSON:

```js
// input here is the JSON from above
import { decode } from 'decode-js';

const result = decode(input, decoder);
```

Any errors will be under `result.errors`, and `result.data` will have the fully type checked and manipulated data.

In lieu of more documentation currently, the tests demonstrate all the functionality.
