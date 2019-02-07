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

router.post('/', async (req, res) => {
    try {
        // Vérifier que il y a un firstname, lastname, city, reference
        const body = req.body;
        if (body.reference && body.firstname && body.lastname && body.city) {
            // Insert dans la bdd
            const { Customers } = req.db;
            const customer = await Customers.create(body);
            return res.status(201).send(customer);
        }
        else {
            return res.status(400).send({ message: 'Missing data' });
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: 'Customer exists déjà' })
        }
    }

});

module.exports = router;