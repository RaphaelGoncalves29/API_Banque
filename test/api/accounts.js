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

	describe.only('GET /api/v1/accounts', function() {
		it('Recover all accounts', async () => {
			const {body: accounts} = await server
				.get('/api/v1/accounts')
				.set('Accept', 'application/json')
				.expect(200);
			expect(accounts).to.be.an('array');
			expect(accounts.length).to.equal(3);
		});

		it('Filtering accounts', async () => {
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

		it('Filtering accounts2', async () => {
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

	describe.only('POST /api/v1/accounts', function() {
		it('should create an account', async () => {
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

		it('should return an 400 error if given body has not all the mandatory data', async () => {
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

		it("La requete envoie un utilisateur qui existe déjà, on reçoit un 409", async () => {
			await server.post('/api/v1/accounts')
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
		it("La reference donnée n'existe pas alors j'ai un 404", async () => {
			await server.get('/api/v1/accounts/je-n-existe-pas')
				.expect(404);
		});

		it("La reference donnée existe donc j'ai un 200 avec un vol", async () => {
			const {body: account} = await server.get('/api/v1/accounts/ACC_1')
				.expect(200);

			expect(account.number).to.equal('ACC_1');
			expect(account.reference).to.equal('JS_1234562');
		});
	});

	describe('PUT /api/v1/accounts', function() {
		it("Le nombre donné n'existe pas alors j'ai un 404", async () => {
			await server.put('/api/v1/accounts/je-n-existe-pas')
				.expect(404);
		});

		it('should update an account', async () => {
			const {body: account} = await server.put('/api/v1/accounts/ACC_1')
				.set('Accept', 'application/json')
				.send({
					amount: 5555555
				})
				.expect(200);

			expect(account.number).to.equal('ACC_0123');
		});

		it('shouldnt update an account', async () => {
			await server.put('/api/v1/accounts/ACC_1')
				.set('Accept', 'application/json')
				.send({
					amount: ''
				})
				.expect(400);

				expect(account.number).to.equal('ACC_1');
			});
		});

	describe.only('DELETE /api/v1/accounts', function() {
		it("Le nombre donné n'existe pas alors j'ai un 404", async () => {
			await server.delete('/api/v1/accounts/je-n-existe-pas')
				.expect(404);
		});
		it('should delete an account', async () => {
			await server.delete('/api/v1/accounts/ACC_1')
				.set('Accept', 'application/json')
				.expect(204);
		});
	});
});