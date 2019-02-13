'use strict';

const {expect} = require('chai');
const request = require('supertest');
const createServer = require('../../app');
const database = require('../../src/database');
const fixtures = require('../fixtures/operations')

const server = request(createServer());

describe('Operation api', function() {
	before(async function() {
		await database.sequelize.query('DELETE from OPERATIONS');
		const {Operations} = database;
		const promises = fixtures.map(operation => Operations.create(operation));
		await Promise.all(promises);
    });
    
    describe('GET /api/v1/operations', function() {
		it('Return all operations', async () => {
			const {body: operations} = await server
				.get('/api/v1/operations')
				.set('Accept', 'application/json')
				.expect(200);
			expect(operations).to.be.an('array');
			expect(operations.length).to.equal(4);
		});

		it("Type given doesn't exists, then error 404", async () => {
			await server
				.get('/api/v1/operations')
				.query({
					type: 'pret',
				})
				.set('Accept', 'application/json')
				.expect(404);
		});


		it('Filtering operations with type', async () => {
			const {body: operations} = await server
				.get('/api/v1/operations')
				.query({
					type: 'virement',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(operations).to.be.an('array');
			expect(operations.length).to.equal(2);
			expect(operations[0].reference).to.equal('OP_1');
			expect(operations[1].reference).to.equal('OP_4');
		});

        it('Filtering operations with emetteur', async () => {
			const {body: operations} = await server
				.get('/api/v1/operations')
				.query({
					emetteur: 'RG_29',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(operations).to.be.an('array');
			expect(operations.length).to.equal(1);
			expect(operations[0].reference).to.equal('OP_3');
		});

        it('Filtering customers with beneficiaire', async () => {
			const {body: operations} = await server
				.get('/api/v1/operations')
				.query({
					beneficiaire: 'JS_456',
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(operations).to.be.an('array');
			expect(operations.length).to.equal(2);
			expect(operations[0].reference).to.equal('OP_1');
			expect(operations[1].reference).to.equal('OP_2');
		});

	});

	describe('POST /api/v1/operations', function() {
		it('Should create an operation', async () => {
			const {body: operation} = await server
				.post('/api/v1/operations')
				.set('Accept', 'application/json')
				.send({
                    reference: 'OP_456',
                    emetteur: 'RG_789',
                    beneficiaire: 'WX_5666',
                    montant: 250,
                    type: "retrait"
				})
				.expect(201);

			expect(operation).to.be.an('object');
			expect(operation.reference).to.equal('OP_456');
		});

		it('Should return an 400 error if given body has not all the mandatory data', async () => {
			await server
				.post('/api/v1/operations')
				.set('Accept', 'application/json')
				.send({
                    reference: 'OP_456',
                    emetteur: '',
                    beneficiaire: '',
                    montant: 250,
                    type: "retrait"
				})
				.expect(400);
		});

		it('Should return an 409 error if the operation already exists', async () => {
			await server
				.post('/api/v1/operations')
				.send({
                    reference: 'OP_456',
                    emetteur: 'RG_789',
                    beneficiaire: 'WX_5666',
                    montant: 250,
                    type: "retrait"
				})
				.expect(409);
			});
		});

	describe('GET /api/v1/operations/:reference', function() {
		it("Reference given doesn't exists, then error 404", async () => {
			await server
				.get('/api/v1/operations/je-n-existe-pas')
				.expect(404);
		});

		it("Reference given exists, return 200 ", async () => {
			const {body: operation} = await server
				.get('/api/v1/operations/OP_1')
				.expect(200);

            expect(operation.emetteur).to.equal('JS_123');
            expect(operation.beneficiaire).to.equal('JS_456');
            expect(operation.montant).to.equal(1500);
            expect(operation.type).to.equal('virement');
			expect(operation.reference).to.equal('OP_1');
		});
	});

    });

