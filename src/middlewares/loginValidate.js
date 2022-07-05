import jwt from "jsonwebtoken";
import User from "../models/User";

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ["Login required"],
    });
  }

  const [, token] = authorization.split(" ");

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email, is_admin } = dados;
    if (id != req.body.id) {
      return res.status(401).json({
        errors: ["Token expired or invalid"],
      });
    }
    if (is_admin != req.body.is_admin) {
      return res.status(401).json({
        errors: ["Token expired or invalid"],
      });
    }
    const user = await User.findOne({
      where: {
        id,
        email,
        is_admin,
      },
    });

    if (!user) {
      return res.status(401).json({
        errors: ["Token expired or invalid"],
      });
    }

    req.userId = id;
    req.userEmail = email;
    req.userIsAdmin = is_admin;
    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ["Token expired or invalid"],
    });
  }
};
