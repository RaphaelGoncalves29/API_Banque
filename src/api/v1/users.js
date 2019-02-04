const express = require('express');
const request = require('request-promise');
const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
		const users = await request({
			uri: 'http://www.mocky.io/v2/5c015e253500006c00ad098f',
			method: 'GET',
			json: true
		});

		const {country, company} = req.query;
		let filteredList = users;
		if (country) {
		  filteredList = users.filter(u => u.country === country);
    }
		if (company) {
			filteredList = users.filter(u => u.company === company);
		}

		res.send(filteredList);
  } catch(err) {
    next(err);
  }
});

router.post('/', async(req, res) => {
	try {
		// Vérifier que il y a un username, fullname, country
		const body = req.body;
		if (body.username && body.fullname && body.country) {
			// Insert dans la bdd
			const {Users} = req.db;
			const user = await Users.create(body);
			return res.status(201).send(user);
		}
		else {
			return res.status(400).send({message: 'Missing data'});
		}	
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			return res.status(409).send({message: 'User exists déjà'})
		}
	}
	
});

router.get('/:username', async (req, res) => {
	const username = req.params.username;
	const {Users} = req.db;
	const user = await Users.findOne({ where: {username: username} });
	if (user) {
		return res.status(200).send(user);
	} else {
		return res.status(404)
			.send({message: `Username ${username} not found`});
	}
})
module.exports = router;