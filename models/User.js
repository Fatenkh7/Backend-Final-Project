import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('user', {
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
    type: DataTypes.STRING(23),
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
}, {
  tableName: 'user',
  timestamps: false,
});

export default User;
