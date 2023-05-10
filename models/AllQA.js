import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import PredefinedQA from "./PredifiendQA.js";
import Chat from "./Chat.js";

const AllQA = sequelize.define(
  "all_qa",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    predifiend_qa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PredefinedQA,
        key: "id",
      },
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chat,
        key: "id",
      },
    },
  },
  {
    tableName: "all_qa",
    timestamps: false,
  }
);

export default AllQA;
