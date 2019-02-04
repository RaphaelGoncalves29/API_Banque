const express = require('express');
const {BadRequest} = require('http-errors');
const router = express.Router();

router.get('/:reference', async (req, res) => {
	const reference = req.params.reference;
	const {Flights} = req.db;
	const flight = await Flights.findOne({ where: {reference: reference} });
	if (flight) {
		return res.status(200).send(flight);
	} else {
		return res.status(404)
			.send({message: `Reference ${reference} not found`});
	}
});

router.get('/', async (req, res) => {
	const {origin, destination, company} = req.query;
	const filter = {
		where: {}
	};
	if (origin) filter.where.origin = origin;
	if (destination) filter.where.destination = destination;
	if (company) filter.where.company = company;

	const {Flights} = req.db;
	const flights = await Flights.findAll(filter);

	res.send(flights);
});

router.post('/', async (req, res, next) => {
	try {
		const {body: givenFlight} = req;
		const {Flights} = req.db;
		const flight = await Flights.create(givenFlight);
		res.status(201).send(flight);
	} catch(err) {
		if (err.name === 'SequelizeValidationError') {
			return next(new BadRequest(err));
		}
		next(err);
	}
});

module.exports = router;