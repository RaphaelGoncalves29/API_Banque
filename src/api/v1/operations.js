const express = require('express');
const {BadRequest} = require('http-errors');
const router = express.Router();



router.get('/', async (req, res) => {
    console.log(req);
	const {type} = req.query;
	const filter = {
		where: {}
	};
	if (type) filter.where.type = type;

	const {Operations} = req.db;
	const operations = await Operations.findAll(filter);

	res.send(operations);
});

router.post('/', async (req, res) => {
    try {
        // Vérifier que il y a un firstname, lastname, city, reference
        const body = req.body;
        
        if (body.reference && body.emetteur && body.beneficiaire && body.montant && body.type) {
            // Insert dans la bdd
            const { Operations } = req.db;
            const operation = await Operations.create(body);
            return res.status(201).send(operation);
        } else {
            return res.status(400).send({ message: 'Missing data' });
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: 'Operation exists déjà' })
        }
    }

});

module.exports = router;