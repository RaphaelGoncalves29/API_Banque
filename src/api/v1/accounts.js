const express = require('express');
const request = require('request-promise');
const router = express.Router();


router.get('/', async (req, res) => {
	const {type, reference} = req.query;
	const filter = {
		where: {}
	};
	if (type) filter.where.type = type;
	if (reference) filter.where.reference = reference;

	const {Accounts} = req.db;
	const accounts = await Accounts.findAll(filter);

	if (accounts.length > 0){
		res.send(accounts);
	} else {
		return res.status(404).send({ message: `Il n'y a encore aucun compte enregistré` });
	}
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

router.get('/:number', async (req, res) => {
	const number = req.params.number;
	const {Accounts} = req.db;
	const account = await Accounts.findOne({ where: {number: number} });
	if (account) {
		return res.status(200).send(account);
	} else {
		return res.status(404)
			.send({message: `Number ${number} not found`});
	}
})

router.put('/:number', async (req, res) => {
    const number = req.params.number;
    const body = req.body;
    const {Accounts} = req.db;
    const account = await Accounts.findOne({ where: {number: number} });
    if (body.reference) {
        return res.status(400)
            .send({message: `Reference can not be updated`});
    }
    if (account) {
        account.update(body);
        return res.send({
            number: number
        });
    } else {
        return res.status(404)
            .send({message: `Number ${number} not found`});
    }
 });

router.delete('/:number', async (req, res) => {
    const number = req.params.number;
    const { Accounts } = req.db;
    const account = await Accounts.findOne({ where: { number: number } });
    if (account) {
        account.destroy().then((destoryedCount) => {
            if (destoryedCount == 0) {
                res.status(404).send({ message: "Account with number : " + number + " could not be deleted." });
            } else {
                res.status(204).send({
                    success: destoryedCount,
                    description: "Accounts with number " + number + " is deleted."
                });
            }
        });
    } else {
        res.status(404).send({ message: "The account with number " + number + " could not be deleted. " });
    }
  });

module.exports = router;
