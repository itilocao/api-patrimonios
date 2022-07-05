import jwt from "jsonwebtoken";

import User from "../models/User";

class TokenController {
  async store(req, res) {
    const { email = "", password = "" } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        errors: ["Invalid credentials"],
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        errors: ["User not found"],
      });
    }

    if (!(await user.passwordIsValid(password, user.password_hash))) {
      return res.status(400).json({
        errors: ["Invalid password"],
      });
    }

    const { id, is_admin } = user;
    const token = jwt.sign({ id, email, is_admin }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({ token, user: { name: user.name, id, is_admin } });
  }
}

export default new TokenController();
