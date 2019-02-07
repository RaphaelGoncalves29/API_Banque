const express = require('express');
const {BadRequest} = require('http-errors');
const router = express.Router();

router.get('/:reference', async (req, res) => {
	const reference = req.params.reference;
	const {Customers} = req.db;
	const customer = await Customers.findOne({ where: {reference: reference} });
	if (customer) {
		return res.status(200).send(customer);
	} else {
		return res.status(404)
			.send({message: `Reference ${reference} not found`});
	}
});

router.get('/', async (req, res) => {
    console.log(req);
	const {firstname, lastname, city} = req.query;
	const filter = {
		where: {}
	};
	if (firstname) filter.where.lastname = firstname;
	if (lastname) filter.where.firstname = lastname;
	if (city) filter.where.city = city;

	const {Customers} = req.db;
	const customers = await Customers.findAll(filter);

	res.send(customers);
});

router.post('/', async (req, res, next) => {
	try {
		const {body: givenCustomer} = req;
		const {Customers} = req.db;
		const customer = await Customers.create(givenCustomer);
		res.status(201).send(customer);
	} catch(err) {
		if (err.name === 'SequelizeValidationError') {
			return next(new BadRequest(err));
		}
		next(err);
	}
});

module.exports = router;