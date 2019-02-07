const express = require('express');
const request = require('request-promise');
const router = express.Router();


router.get('/', async (req, res) => {
    const {type} = req.query;
	const filter = {
        where: {}
	};
	if (type) filter.where.type = type;
    
	const {Accounts} = req.db;
    console.log(Accounts+"test");
	const accounts = await Accounts.findAll(filter);

	res.send(accounts);
});

router.post('/', async (req, res) => {
    try {
        // Vérifier que il y a un firstname, lastname, city, reference
        const body = req.body;
        if (body.reference && body.number && body.type && body.amount) {
            // Insert dans la bdd
            const { Accounts } = req.db;
            const account = await Accounts.create(body);
            return res.status(201).send(account);
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

router.get('/:reference', async (req, res) => {
    const reference = req.params.reference;
    const { Customers } = req.db;
    const customer = await Customers.findOne({ where: { reference: reference } });
    if (customer) {
        return res.status(200).send(customer);
    } else {
        return res.status(404)
            .send({ message: `Reference ${reference} not found` });
    }
})
module.exports = router;
