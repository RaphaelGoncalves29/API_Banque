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
        const body = req.body;
        if (body.reference && body.number && body.type && body.amount) {
            const { Accounts } = req.db;
            const account = await Accounts.create(body);
            return res.status(201).send(account);
        }
        else {
            return res.status(400).send({ message: 'Missing data' });
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: 'Le compte existe déjà' })
        }
    }

});

router.get('/:reference', async (req, res) => {
    const reference = req.params.reference;
    const { Accounts } = req.db;
    const account = await Accounts.findOne({ where: { reference: reference } });
    if (account) {
        return res.status(200).send(account);
    } else {
        return res.status(404)
            .send({ message: `Reference ${reference} not found` });
    }
})
module.exports = router;
