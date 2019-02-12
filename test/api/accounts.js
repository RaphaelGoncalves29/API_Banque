'use strict';

const {expect} = require('chai');
const request = require('supertest');
const createServer = require('../../app');
const database = require('../../src/database');
const fixtures = require('../fixtures/accounts')

const server = request(createServer());

describe.only('Account api', function() {
	before(async function() {
		await database.sequelize.query('DELETE from ACCOUNTS');
		const {Accounts} = database;
		const promises = fixtures.map(account => Accounts.create(account));
		await Promise.all(promises);
	});

	describe('GET /api/v1/accounts', function() {
		it('Return all accounts', async () => {
			const {body: accounts} = await server
				.get('/api/v1/accounts')
				.set('Accept', 'application/json')
				.expect(200);
			expect(accounts).to.be.an('array');
			expect(accounts.length).to.equal(3);
		});

		it('Filtering accounts with type', async () => {
			const {body: accounts} = await server
				.get('/api/v1/accounts')
				.query({
					type: 'Livret AB',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(accounts).to.be.an('array');
			expect(accounts.length).to.equal(2);
			expect(accounts[0].reference).to.equal('JS_1234562');
			expect(accounts[1].reference).to.equal('JS_12');
		});

		it('Filtering accounts with type and reference', async () => {
			const {body: accounts} = await server
				.get('/api/v1/accounts')
				.query({
					type: 'Livret AB',
					reference: 'JS_1234562'
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(accounts).to.be.an('array');
			expect(accounts.length).to.equal(1);
			expect(accounts[0].reference).to.equal('JS_1234562');
		});
	});

	describe('POST /api/v1/accounts', function() {
		it('Should create an account', async () => {
			const {body: account} = await server
				.post('/api/v1/accounts')
				.set('Accept', 'application/json')
				.send({
					number: 'ACC_4',
					reference: 'MJ_1',
					type: 'Livret A',
					amount: 2000
				})
				.expect(201);

			expect(account).to.be.an('object');
			expect(account.reference).to.equal('MJ_1');
		});

		it('Should return an 400 error if given body has not all the mandatory data', async () => {
			await server
				.post('/api/v1/accounts')
				.set('Accept', 'application/json')
				.send({
					number: '',
					reference: '',
					type: 'Livret A',
					amount: 2000
				})
				.expect(400);
		});

		it('Should return an 409 error if the customer already exists', async () => {
			await server
				.post('/api/v1/accounts')
				.send({
					number: 'ACC_4',
					reference: 'MJ_1',
					type: 'Livret A',
					amount: 2000
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