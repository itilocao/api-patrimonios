const { DataTypes } = require(`sequelize`);
const sequelize = require(`../config/database`);
import appConfig from "../config/appConfig";

import User from "./User";

const Patrimony = sequelize.define("patrimonies", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    validate: {
      len: {
        args: [2, 255],
        msg: "Name field must be between 2 to 255 characters",
      },
    },
  },
  cod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    unique: true,
    unique: { msg: "Code already exists" },
    validate: {
      len: {
        args: [1, 10],
        msg: "Cod field must be between 1 to 10 characters",
      },
    },
  },

  note: {
    type: DataTypes.STRING(1234),
    allowNull: true,
    defaultValue: "",
    validate: {
      len: {
        args: [0, 1234],
        msg: "Note field must be between 0 to 1234 characters",
      },
    },
  },
  details: {
    type: DataTypes.STRING(1234),
    allowNull: true,
    defaultValue: "",
    validate: {
      len: {
        args: [0, 1234],
        msg: "Note field must be between 0 to 1234 characters",
      },
    },
  },
  filename: {
    type: DataTypes.STRING,
    defaultValue: "",
    allowNull: true,
  },
  url: {
    type: DataTypes.VIRTUAL,
    get() {
      try {
        return `${appConfig.url}/images/${
          this.getDataValue("filename")
            ? this.getDataValue("filename")
            : "not_found.jpg"
        }`;
      } catch (e) {
        return ``;
      }
    },
  },
  owner: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
});

User.hasMany(Patrimony, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Patrimony.belongsTo(User);

// update tables
// Patrimony.sync();

module.exports = Patrimony;
