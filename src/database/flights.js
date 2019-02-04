'use strict';

const Flights = (sequelize, DataTypes) => {
	return sequelize.define('Flights', {
		reference: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {notEmpty: {msg: '-> Missing reference'}}
		},
		origin: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing origin'}},
			allowNull: false
		},
		destination: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing destination'}},
			allowNull: false
		},
		placesLeft: {
			type: DataTypes.INTEGER,
			validate: {notEmpty: {msg: '-> Missing placesLeft'}},
			allowNull: false
		},
		company: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing company'}},
			allowNull: false
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			validate: {notEmpty: {msg: '-> Missing price'}},
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			validate: {notEmpty: {msg: '-> Missing date'}},
			allowNull: false
		}
	});
};

module.exports = Flights;
