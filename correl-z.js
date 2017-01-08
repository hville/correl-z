const rndZ = require('random-z')

module.exports = correlZ

/**
 * Returns a random number generator for correlated variables
 *
 * @param {Array} iidWeights - factors for a linear combination of iid random normal variables
 * @returns {Function} - simulator
 */
function correlZ(iidWeights) {
	const iids = keyVal(iidWeights),
				intW = getInternalWeight(iids)
	if (Number.isNaN(intW)) throw Error('sum of the iid factors squares must be less than 1')

	return function random(iidZs, selfZ) {
		let res = (selfZ === undefined ? rndZ() : selfZ) * intW
		for (let i=0; i<iids.length; ++i) res += iidZs[iids[i][0]] * iids[i][1]
		if (isNaN(res)) throw Error('invalid risk weights or seed values')
		return res
	}
}
function getInternalWeight(iids) {
	let t = 1
	for (let i=0; i<iids.length; ++i) t -= iids[i][1] * iids[i][1]
	// recover from float point error if very near 0
	if (t > 0) return Math.sqrt(t)
	if (t > -(Number.EPSILON || 2.22045E-16)) return 0
	return NaN
}
function keyVal(obj) {
	const ks = Object.keys(obj),
				res = []
	for (let i=0; i<ks.length; ++i) if (obj[ks[i]] !== 0) res.push([ks[i], obj[ks[i]]])
	return res
}
