'use strict';

const {expect} = require('chai');
const request = require('supertest');
const createServer = require('../../app');
const database = require('../../src/database');
const fixtures = require('../fixtures/customers')

const server = request(createServer());

describe('Customer api', function() {
	before(async function() {
		await database.sequelize.query('DELETE from CUSTOMERS');
		const {Customers} = database;
		const promises = fixtures.map(customer => Customers.create(customer));
		await Promise.all(promises);
	});

	describe('GET /api/v1/customers', function() {
		it('Return all customers', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.set('Accept', 'application/json')
				.expect(200);
			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(5);
		});

		it("City given doesn't exists, then error 404", async () => {
			await server
				.get('/api/v1/customers')
				.query({
					city: 'Barcelona',
				})
				.set('Accept', 'application/json')
				.expect(404);
		});


		it('Filtering customers with firstname', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.query({
					firstname: 'Johnny',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(2);
			expect(customers[0].reference).to.equal('JD_1');
			expect(customers[1].reference).to.equal('JS_2');
		});

        it('Filtering customers with lastname', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.query({
					lastname: 'Doe',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(1);
			expect(customers[0].reference).to.equal('JD_1');
		});

        it('Filtering customers with city', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.query({
					city: 'Montréal',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(2);
			expect(customers[0].reference).to.equal('JS_2');
			expect(customers[1].reference).to.equal('TK_5');
		});

		it('Filtering customers with firstname and lastname', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.query({
					firstname: 'Johnny',
					lastname: 'Smith'
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(1);
			expect(customers[0].reference).to.equal('JS_2');
		});
	});

	describe('POST /api/v1/customers', function() {
		it('Should create an customer', async () => {
			const {body: customer} = await server
				.post('/api/v1/customers')
				.set('Accept', 'application/json')
				.send({
                    firstname: 'Sam',
                    lastname: 'Captain',
                    city: 'Los Angeles',
                    reference: 'SC_123'
				})
				.expect(201);

			expect(customer).to.be.an('object');
			expect(customer.reference).to.equal('SC_123');
		});

		it('Should return an 400 error if given body has not all the mandatory data', async () => {
			await server
				.post('/api/v1/customers')
				.set('Accept', 'application/json')
				.send({
                    firstname: '',
                    lastname: '',
                    city:'Los Angeles',
                    reference: 'SC_123'
				})
				.expect(400);
		});

		it('Should return an 409 error if the customer already exists', async () => {
			await server
				.post('/api/v1/customers')
				.send({
                    firstname: 'Sam',
                    lastname: 'Captain',
                    city: 'Los Angeles',
                    reference: 'SC_123'
				})
				.expect(409);
			});
		});

	describe('GET /api/v1/customers/:reference', function() {
		it("Reference given doesn't exists, then error 404", async () => {
			await server
				.get('/api/v1/customers/je-n-existe-pas')
				.expect(404);
		});

		it("Reference given exists, return 200 ", async () => {
			const {body: customer} = await server
				.get('/api/v1/customers/JD_1')
				.expect(200);

			expect(customer.firstname).to.equal('Johnny');
			expect(customer.reference).to.equal('JD_1');
		});
	});

	describe('PUT /api/v1/customers/:reference', function() {
		it("Reference given doesn't exists, then error 404", async () => {
			await server
				.put('/api/v1/customers/je-n-existe-pas')
				.expect(404);
		});

		it('Should update a customer', async () => {
			const {body: customer} = await server.put('/api/v1/customers/SC_123')
				.set('Accept', 'application/json')
				.send({
					city: 'Shanghai'
				})
				.expect(200);

			expect(customer.reference).to.equal('SC_123');
		});

		it('Should return an 400 error if user try to update the reference', async () => {
			await server.put('/api/v1/customers/SC_123')
				.set('Accept', 'application/json')
				.send({
					reference: 'MS_125'
				})
				.expect(400);
		});
	});

	describe('DELETE /api/v1/customers', function() {
		it("Reference given doesn't exists, then error 404", async () => {
			await server
				.delete('/api/v1/customers/je-n-existe-pas')
				.expect(404);
		});
		it('Should delete an customer', async () => {
			await server
				.delete('/api/v1/customers/SC_123')
				.set('Accept', 'application/json')
				.expect(204);
		});
	});
});
