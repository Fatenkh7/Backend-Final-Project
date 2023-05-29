import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Contact = sequelize.define('contact', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    
  },
}, {
  tableName: 'contact',
  timestamps: true,
});

export default Contact;
