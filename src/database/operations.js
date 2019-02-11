'use strict';

const Operations = (sequelize, DataTypes) => {
	return sequelize.define('Operations', {
		reference: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {notEmpty: {msg: '-> Missing firstname'}}
		},
		emetteur: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing lastname'}},
			allowNull: false
		},
		beneficiaire: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing city'}},
			allowNull: false
        },
        montant: {
			type: DataTypes.INTEGER,
			validate: {notEmpty: {msg: '-> Missing reference'}},
			allowNull: false
        },
        type: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing city'}},
			allowNull: false
        }
	});
};

module.exports = Operations;