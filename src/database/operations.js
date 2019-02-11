'use strict';

const Operations = (sequelize, DataTypes) => {
	return sequelize.define('Operations', {
		reference: {
			type: DataTypes.STRING,
            validate: {notEmpty: {msg: '-> Missing reference'}},
            primaryKey: true
		},
		emetteur: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing emetteur'}},
			allowNull: false
		},
		beneficiaire: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing beneficiaire'}},
			allowNull: false
        },
        montant: {
			type: DataTypes.INTEGER,
			validate: {notEmpty: {msg: '-> Missing montant'}},
			allowNull: false
        },
        type: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: '-> Missing type'}},
			allowNull: false
        }
	});
};

module.exports = Operations;