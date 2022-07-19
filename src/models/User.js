const { DataTypes } = require(`sequelize`);
const sequelize = require(`../config/database`);
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "users",
  {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email",
        },
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    password: {
      type: DataTypes.VIRTUAL,
      defaultValue: "",
      validate: {
        len: {
          args: [6, 50],
          msg: "Password field must be between 6 to 50 characters",
        },
      },
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    hooks: {
      beforeSave: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(
            user.password.toString(),
            salt
          );
        }
      },
    },
  }
);

User.prototype.passwordIsValid = function (password, password_hash) {
  return bcrypt.compare(password.toString(), password_hash);
};
// update tables
User.sync();

module.exports = User;
