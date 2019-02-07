const express = require('express');
const request = require('request-promise');
const router = express.Router();


router.get('/', async (req, res, next) => {
    try {
        const customers = await request({
            uri: 'http://www.mocky.io/v2/5c015e253500006c00ad098f',
            method: 'GET',
            json: true
        });

        const { firstname, lastname, city } = req.query;
        let filteredList = customers;
        if (firstname) {
            filteredList = customers.filter(c => c.firstname === firstname);
        }

        if (lastname) {
            filteredList = customers.filter(c => c.lastname === lastname);
        }

        if (city) {
            filteredList = customers.filter(c => c.city === city);
        }

        res.send(filteredList);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res) => {
    try {
        // Vérifier que il y a un firstname, lastname, city, reference
        const body = req.body;
        if (body.firstname && body.lastname && body.city && body.reference) {
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
