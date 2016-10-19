var rndZ = require('random-z')

module.exports = correlZ

/**
 * Returns a random number generator for correlated variables
 *
 * @param {Array} iidWeights - factors for a linear combination of iid random normal variables
 * @returns {Function} - simulator
 */
function correlZ(iidWeights) {
	if (!Array.isArray(iidWeights)) throw Error('iidWeights must be an Array of numbers')

	var intW = getInternalWeight(iidWeights)
	if (isNaN(intW)) throw Error('sum of the iid factors squares must be less than 1')

	return function random(iidZs, selfZ) {
		if (!Array.isArray(iidZs)) throw Error('iidZs must be an Array of numbers')
		if (iidZs.length < iidWeights.length) throw Error('missing seed values for the provided weights')

		var res = (selfZ === undefined ? rndZ() : selfZ) * intW
		for (var i=0; i<iidWeights.length; ++i) res += iidZs[i] * iidWeights[i]
		return res
	}
}
function getInternalWeight(extW) {
	for (var i=0, t=1; i<extW.length; ++i) t -= extW[i]*extW[i]
	// recover from float point error if very near 0
	if (t<0) t+= Number.EPSILON || 2.2204460492503130808472633361816E-16
	return Math.sqrt(t)
}
