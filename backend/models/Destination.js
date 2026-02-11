// models/Destination.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // make sure your DB connection is set up

const Destination = sequelize.define('Destination', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING },
  avg_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
}, {
  tableName: 'destinations',
  timestamps: false,
});

module.exports = Destination;
