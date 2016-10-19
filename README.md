<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 MD036 -->
# correl-z

*correlated standard normal distribution **Z** random number generator*

• [Example](#example) • [API](#api) • [License](#license)

# Example

```javascript
var correlZ = require('correlZ'),
    randomZ = require('random-z'), // unit normal distribution random number generator
    cholesky = require('cholesky') // cholesky decomposition

var correlMatrix = [[1], [0.2, 1], [0.2, 0.2, 1]] // lower triangle is enough
    correlWeights = cholesky(correlMatrix),
    correlSeeders = correlWeights.map(correlZ) // array of random number generators

var iids = correlWeights.map(randomZ) // shared identically distributed variables

// all 3 results below are different but correlated, E=0, V=1, Cor(i,j) = 0.2
var x0 = correlSeeder[0](iids),
    x1 = correlSeeder[1](iids),
    x2 = correlSeeder[2](iids)
```

# API

The module exports a single function that takes an array of linear factors to be applied to shared *standard normal*
*[Independent and identically distributed random_variables](https://en.wikipedia.org/wiki/Independent_and_identically_distributed_random_variables)*
(iids) and returns a *standard normal* correlated random number generator.

* `correlZ(arrayOfLinearWeights) => randomNumberGenerator`
* `arrayOfLinearWeights`: array linear factor for each iid
* `randomNumberGenerator(iids[, zSeed]) => randomNumber`
* `iids`: array of iid values
* `zSeed`: optional *standard normal* seed for testing. Normally generated internally

Note that the linear iid weights can obtained from the correlation matrix with the
[cholesky](https://www.npmjs.com/package/cholesky) module.

# License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
