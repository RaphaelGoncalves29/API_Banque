// 'use strict';

// const {expect} = require('chai');
// const request = require('supertest');
// const createServer = require('../../app');
// const database = require('../../src/database');
// const fixtures = require('../fixtures/customers');

// const server = request(createServer());

// describe('User api', function() {
//     before(async function() {
//         await database.sequelize.query('DELETE from CUSTOMERS');
//         const {Customers} = database;
//         await Customers.create(fixtures);
//     });

// 	describe('GET /api/v1/customers', function() {
// 		it('Recover all customers', async () => {
// 			const {body: customers} = await server
// 				.get('/api/v1/customers')
// 				.set('Accept', 'application/json')
// 				.expect(200);
// 			expect(customers).to.be.an('array');
// 			expect(customers.length).to.equal(3);
// 		});

// 		it('Filtering flights', async () => {
// 			const {body: flights} = await server
// 				.get('/api/v1/flights')
// 				.query({
// 					company: 'Lufthansa',
// 					origin: 'CDG',
// 					destination: 'BOG'
// 				})
// 				.set('Accept', 'application/json')
// 				.expect(200);

// 			expect(flights).to.be.an('array');
// 			expect(flights.length).to.equal(1);
// 			expect(flights[0].reference).to.equal('LH-123')
// 		});
// 	});

// 	describe('POST /api/v1/users', function () {
// 		it("La requete envoie tous les données d'un user, l'user est crée et on reçoit un 200", async () => {
// 			await server.post('/api/v1/users')
// 				.send({
// 					username: 'lea',
// 					fullname: 'lea',
// 					country: 'FR'
// 				})
// 				.expect(201);
// 		});

// 		it("La requete envoie n'evoie pas tous les données d'un user, on reçoit un 400", async () => {
// 			await server.post('/api/v1/users')
// 				.send({
// 					username: 'lea'
// 				})
// 				.expect(400);
// 		});

// 		it("La requete envoie un utilisateur qui existe déjà, on reçoit un 409", async () => {
// 			await server.post('/api/v1/users')
// 				.send({
// 					username: 'joan',
// 					fullname: 'joan',
// 					country: 'CO'
// 				})
// 				.expect(409);
// 		});
//     });
    
//     describe.only('GET /api/v1/users/:username', function() {
//         it("La reference donnée n'existe pas alors j'ai un 404", async () => {
//             await server.get('/api/v1/users/blabla')
//                 .expect(404);
//         });

//         it("La reference donne existe donc j'ai un 200 avec un user", async () => {
//             const {body: user} = await server.get('/api/v1/users/joan')
//                 .expect(200);
                
//             expect(user.username).to.equal('joan')

//         })
//     })
// });