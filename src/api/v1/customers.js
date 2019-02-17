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
	const {firstname, lastname, city} = req.query;
	const filter = {
		where: {}
	};
	if (firstname) filter.where.firstname = firstname;
	if (lastname) filter.where.lastname = lastname;
	if (city) filter.where.city = city;

	const {Customers} = req.db;
	const customers = await Customers.findAll(filter);

	if (customers.length > 0){
		res.send(customers);
	} else {
		return res.status(404).send({ message: 'Customer not found' });
	}
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

router.put('/:reference', async (req, res) => {
    const reference = req.params.reference;
    const body = req.body;
    const {Customers} = req.db;
    const customer = await Customers.findOne({ where: {reference: reference} });
	if (body.reference) {
        return res.status(400)
            .send({message: `Reference can not be updated`});
    }
    if (customer) {
        customer.update(body);
        return res.send({
            reference: reference
        });
    } else {
        return res.status(404)
            .send({message: `Customers ${reference} not found`});
    }
 });



 router.delete('/:reference', async (req, res) => {
	const reference = req.params.reference;
	const { Customers } = req.db;
	const customer = await Customers.findOne({ where: { reference: reference } });
	if (customer) {
		customer.destroy().then((destoryedCount) => {
			if (destoryedCount == 0) {
				res.status(404).send({ message: "Customer with reference : " + reference + " could not be deleted." });
			} else {
				res.status(204).send({
					success: destoryedCount,
					description: "Customer with reference " + reference + " is deleted."
				});
			}
		});
	} else {
		res.status(404).send({ message: "The Customer with reference " + reference + " could not be deleted. " });
	}
  });
module.exports = router;



