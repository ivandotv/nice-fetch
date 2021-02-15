# Simple wrapper for fetch function

![Unit tests](https://github.com/ivandotv/ffetch/workflows/Unit%20tests/badge.svg)
![Codecov](https://img.shields.io/codecov/c/github/ivandotv/ffetch)
![NPM](https://img.shields.io/npm/l/radio-browser-api)
[![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Installation:

```sh
npm install ffetch
```

## Table of Contents

- [What is it](#what-is-it)
- [Motivation](#motivation)
- [Usage](#usage)

## What is it

A very simple function (330 bytes gzipped ) that simplifies working with the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Motivation

After writing fetch code hundreds of times, I've decided to simplyfy the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) function so instead of this:

```js
try {
  const response = await fetch('https://example.com')
  if (response.ok) {
    const data = await response.json()
  } else {
    throw response
  }
} catch (e) {
  console.log(e)
}
```

I can do this:

```js
try {
  const [data, response] = await ffetch('https://example.com')
} catch (e) {
  console.log(e)
}
```

A small improvement I know, but it adds up over time :)

## Usage

`ffetch` (not a typo 😁 ) accepts the same arguments as regular [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with one additional argument which is the `type` of the body from the response that you expect to be returned, the default value is `json`. This determines how the response body content should be handled.

```js
// if (response.ok)
const data = await response.json() // <- json is the default
// } else {
```

Other parameters are all available methods on the [Body mixin](https://developer.mozilla.org/en-US/docs/Web/API/Body)

for example:

```js
// data is JSON (default)
const [data, response] = await ffetch('https://example.com')

// data is JSON
const [data, response] = await ffetch(
  'https://example.com',
  { method: 'GET' },
  'json' // <- explicit
)

// data is Blob
const [data, response] = await ffetch(
  'https://example.com',
  { method: 'GET' },
  'blob'
)

// data is string
const [data, response] = await ffetch(
  'https://example.com',
  undefined // <-- pass undefined for RequestInit
  'text'
)
```

## Return values

`ffetch` returns a tuple of `data`, which is already handled response content (no need for `response.json()` call) and the original [`response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

## Error handling

When you write code like this, all errors can be handled in the `catch` block.

```js
try {
  const [data, response] = await ffetch('https://example.com')
} catch (e) {
  console.log(e)
}
```

In case that the `response.ok` is not true (status is **not** in the range 200–299) `ffetch` will throw with the full [`Response` object](https://developer.mozilla.org/en-US/docs/Web/API/Response)

In case that the response body content can't be properly handled e.g. invalid json, `ffetch` will rethrow that error.

In case there is an error from the `fetch` call itself ( Network request failed, timeout) `ffetch` will also rethrow that error.
