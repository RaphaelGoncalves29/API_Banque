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

// router.get('/:reference', async (req, res) => {
//     const reference = req.params.reference;
//     const { Accounts } = req.db;
//     const account = await Accounts.findAll({ where: { reference: reference } });
//     if (account) {
//         return res.status(200).send(account);
//     } else {
//         return res.status(404)
//             .send({ message: `Reference ${reference} not found` });
//     }
// })

// router.get('/:number', async (req, res) => {
//     const number = req.params.number;
//     const { Accounts } = req.db;
//     const account = await Accounts.findOne({ where: { number: number } });
//     if (account) {
//         return res.status(200).send(account);
//     } else {
//         return res.status(404)
//             .send({ message: `Reference ${number} not found` });
//     }
// })

router.get('/:reference/:number', async (req, res) => {
    const {reference} = req.query;
    const {number} = req.query;
    const filter = {
        where: {}
	};

	if (reference) filter.where.reference = reference;
	if (number) filter.where.number = number;

    const { Accounts } = req.db;
    const account = await Accounts.findAll(filter);
    if (account) {
        return res.status(200).send(account);
    } else {
        return res.status(404)
            .send({ message: `Reference ${number} not found` });
    }
})

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
