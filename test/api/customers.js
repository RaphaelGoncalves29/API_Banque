'use strict';

const {expect} = require('chai');
const request = require('supertest');
const createServer = require('../../app');
const database = require('../../src/database');
const fixtures = require('../fixtures/customers')

const server = request(createServer());

describe.only('Customer api', function() {
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
			expect(customers.length).to.equal(3);
		});

		it('Filtering customers with firstname', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.query({
					firstname: 'John',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(2);
			expect(customers[0].reference).to.equal('JD_123');
			expect(accounts[1].reference).to.equal('JS_456');
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
			expect(customers[0].reference).to.equal('JD_123');
		});

        it('Filtering customers with city', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.query({
					city: 'London',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(1);
			expect(customers[0].reference).to.equal('JD_123');
		});

		it('Filtering customers with firstname and lastname', async () => {
			const {body: customers} = await server
				.get('/api/v1/customers')
				.query({
					firstname: 'John',
					lastname: 'Doe'
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(customers).to.be.an('array');
			expect(customers.length).to.equal(1);
			expect(customers[0].reference).to.equal('JD_123');
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
                    reference: 'CS_123'
				})
				.expect(201);

			expect(customer).to.be.an('object');
			expect(customer.reference).to.equal('CS_123');
		});

		it('Should return an 400 error if given body has not all the mandatory data', async () => {
			await server
				.post('/api/v1/customers')
				.set('Accept', 'application/json')
				.send({
                    firstname: '',
                    lastname: '',
                    city:'Los Angeles',
                    reference: 'CS_123'
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
                    reference: 'CS_123'
				})
				.expect(409);
			});
		});

	describe('GET /api/v1/accounts/:number', function() {
		it("Number given doesn't exists, then error 404", async () => {
			await server
				.get('/api/v1/accounts/je-n-existe-pas')
				.expect(404);
		});

		it("Number given exists, return 200 ", async () => {
			const {body: account} = await server
				.get('/api/v1/accounts/ACC_1')
				.expect(200);

			expect(account.number).to.equal('ACC_1');
			expect(account.reference).to.equal('JS_1234562');
		});
	});

	describe('PUT /api/v1/accounts/:number', function() {
		it("Number given doesn't exists, then error 404", async () => {
			await server
				.put('/api/v1/accounts/je-n-existe-pas')
				.expect(404);
		});

		it('Should update an account', async () => {
			const {body: account} = await server.put('/api/v1/accounts/ACC_1')
				.set('Accept', 'application/json')
				.send({
					amount: 5555555
				})
				.expect(200);

			expect(account.number).to.equal('ACC_1');
		});
		// it('Should return an 400 error if given body has not all the mandatory data', async () => {
		// 	await server.put('/api/v1/accounts/')
		// 		.set('Accept', 'application/json')
		// 		.expect(400);

		// 		expect(account.number).to.equal('');
		// 	});
	});

	describe('DELETE /api/v1/accounts', function() {
		it("Number given doesn't exists, then error 404", async () => {
			await server
				.delete('/api/v1/accounts/je-n-existe-pas')
				.expect(404);
		});
		it('Should delete an account', async () => {
			await server
				.delete('/api/v1/accounts/ACC_1')
				.set('Accept', 'application/json')
				.expect(204);
		});
	});
});