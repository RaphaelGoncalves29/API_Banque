const express = require('express');
const {BadRequest} = require('http-errors');
const router = express.Router();

router.get('/:reference', async (req, res) => {
	const reference = req.params.reference;
	const {Operations} = req.db;
	const operation = await Operations.findOne({ where: {reference: reference} });
	if (operation) {
		return res.status(200).send(operation);
	} else {
		return res.status(404)
			.send({message: `Reference ${reference} not found`});
	}
});

router.get('/', async (req, res) => {
	const {type, emetteur, beneficiaire} = req.query;
	const filter = {
		where: {}
	};
	if (type) filter.where.type = type;
	if (emetteur) filter.where.emetteur = emetteur;
	if (beneficiaire) filter.where.beneficiaire = beneficiaire;

	const {Operations} = req.db;
	const operations = await Operations.findAll(filter);

	if (operations.length > 0){
		res.send(operations);
	} else {
		return res.status(404).send({ message: 'Operation not found' });
	}

	
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
        }
        else {
            return res.status(400).send({ message: 'Missing data' });
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: 'Operation exists déjà' })
        }
    }

});




module.exports = router;



