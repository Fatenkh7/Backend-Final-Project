import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const QuestionQA = sequelize.define(
  "question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "question",
    timestamps: false,
  }
);

export default QuestionQA;
