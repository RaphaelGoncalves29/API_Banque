'use strict';

const Customers = (sequelize, DataTypes) => {
	return sequelize.define('Customers', {
		firstname: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {notEmpty: {msg: '-> Missing firstname'}}
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
        },
        reference: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing reference'}},
			allowNull: false
		}
	});
};

module.exports = Customers;