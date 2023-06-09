import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Chat = sequelize.define(
  "chat",
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
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("stackOverflow", "wikipedia", "gpt-2", "chtag"),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "chat",
    timestamps: false,
  }
);
Chat.belongsTo(User, { foreignKey: "user_id" });

export default Chat;
