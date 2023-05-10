import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PredifiendQA = sequelize.define('predifiend_qa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      create_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    }, {
      tableName: 'predifiend_qa',
      timestamps: false
    });

export default PredifiendQA;
