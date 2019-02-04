const {verify} = require('jsonwebtoken');
const {Unauthorized, Forbidden} = require('http-errors');

module.exports = () => async (req, res, next) => {
	const jwtToken = req.get('authorization');
	console.log('----->', jwtToken);

	if (!jwtToken) {
		return next(new Unauthorized('missing JWT, set it on authorization header'));
	}

	try {
		const result = await verify(jwtToken, 'MY_SECRET');
		console.log(result);
		next();
	} catch (e) {
		console.log(e);
		return next(new Forbidden());
	}
};