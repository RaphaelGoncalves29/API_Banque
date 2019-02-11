'use strict';

const Customers = (sequelize, DataTypes) => {
	return sequelize.define('Customers', {
		reference: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing reference'}},
			primaryKey: true
		},
		firstname: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing firstname'}},
			allowNull: false

		},
		lastname: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing lastname'}},
			allowNull: false
		},
		city: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing city'}},
			allowNull: false
        }
	});
};

module.exports = Customers;