'use strict';

const Accounts = (sequelize, DataTypes) => {
	return sequelize.define('Accounts', {
		reference: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {notEmpty: {msg: '-> Missing reference'}}
		},
		number: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing number'}},
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing city'}},
			allowNull: false
        },
        amount: {
			type: DataTypes.INTEGER,
			validate: {notEmpty: {msg: '-> Missing amount'}},
			allowNull: false
		}
	});
};

module.exports = Accounts;