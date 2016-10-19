/*eslint-env node, es6*/
'use strict'
var ct = require('cotest'),
		LS = require('lazy-stats'),
		CZ = require('./correl-z'),
		rndZ = require('random-z'),
		cho = require('cholesky')

var N = 5000

function mapFcn(f) { return f(this) } /*eslint no-invalid-this: 0*/

ct('mutually independent', () => {
	var rnds = [ CZ([1,0]), CZ([0,1]) ],
			stats = LS(rnds.length)
	for (var i=0; i<N; ++i) {
		var zs = rnds.map(mapFcn, rnds.map(rndZ))
		stats.push(zs)
	}
	ct('<', Math.abs(stats.ave(0)), 0.05)
	ct('<', Math.abs(stats.var(0)-1), 0.05)
	ct('<', Math.abs(stats.cor(0, 1)), 0.05)
})
ct('mutually dependent', () => {
	var rnds = [ CZ([0.8,0.6]), CZ([0.8,0.6]) ],
			stats = LS(rnds.length)

	for (var i=0; i<N; ++i) {
		var zs = rnds.map(mapFcn, rnds.map(rndZ))
		stats.push(zs)
	}

	ct('<', Math.abs(stats.ave(0)), 0.05)
	ct('<', Math.abs(stats.var(0)-1), 0.05)
	ct('<', Math.abs(stats.cor(0, 1)-1), 0.05)
})
ct('target correlation', () => {
	var rho = 0.5,
			rnds = [ CZ([1]), CZ(cho([[1, rho],[rho,1]])[1]) ],
			stats = LS(rnds.length)

	for (var i=0; i<N; ++i) {
		var zs = rnds.map(mapFcn, rnds.map(rndZ))
		stats.push(zs)
	}

	ct('<', Math.abs(stats.ave(0)), 0.05)
	ct('<', Math.abs(stats.var(0)-1), 0.05)
	ct('<', Math.abs(stats.cor(0, 1)-rho), 0.05)
})
//console.log('test self correlation...')
//console.log('test cross correlation...')
//closeTo(stats.cor(1,2), r1*r2, 0.05, 'should be near the target correlation')
//console.log('test cross correlation with multiple factors...')
//console.log('testing cross correlation with multiple negative factors...')
