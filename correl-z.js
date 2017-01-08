const rndZ = require('random-z')

module.exports = correlZ

/**
 * Returns a random number generator for correlated variables
 *
 * @param {Array} iidWeights - factors for a linear combination of iid random normal variables
 * @returns {Function} - simulator
 */
function correlZ(iidWeights) {
	const intW = getInternalWeight(iidWeights)
	if (Number.isNaN(intW)) throw Error('sum of the iid factors squares must be less than 1')

	return function random(iidZs, selfZ) {
		let res = (selfZ === undefined ? rndZ() : selfZ) * intW
		for (let i=0; i<iidWeights.length; ++i) {
			if (iidWeights[i] !== 0) res += iidZs[i] * iidWeights[i]
		}
		if (isNaN(res)) throw Error('invalid risk weights or seed values')
		return res
	}
}
function getInternalWeight(extW) {
	let t = 1
	for (let i=0; i<extW.length; ++i) {
		if (extW[i] !==0 ) t -= extW[i] * extW[i]
	}
	// recover from float point error if very near 0
	if (t > 0) return Math.sqrt(t)
	if (t > -(Number.EPSILON || 2.22045E-16)) return 0
	return NaN
}
