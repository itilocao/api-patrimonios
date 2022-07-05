import User from "../models/User";
import Patrimony from "../models/Patrimony";

class UserController {
  async store(req, res) {
    try {
      await User.create(req.body);
      return res.status(200).json({ success: ["Successfully created"] });
    } catch (err) {
      return res
        .status(400)
        .json({ errors: err.errors.map((er) => er.message) });
    }
  }

  async index(req, res) {
    try {
      const response = await User.findAll({
        attributes: ["id", "name", "email", "is_admin"],
        order: [
          ["id", "DESC"],
          [Patrimony, "id", "DESC"],
        ],
        include: {
          model: Patrimony,
          attributes: [
            "id",
            "name",
            "cod",
            "note",
            "details",
            "filename",
            "url",
          ],
        },
      });
      return res.json(response);
    } catch (err) {
      return res.status(400).json(null);
    }
  }

  async show(req, res) {
    try {
      const response = await User.findByPk(req.params.id, {
        attributes: ["id", "name", "email", "is_admin"],
        order: [[Patrimony, "id", "DESC"]],
        include: {
          model: Patrimony,
          attributes: [
            "id",
            "name",
            "cod",
            "note",
            "details",
            "filename",
            "url",
          ],
        },
      });
      return res.json(response);
    } catch (err) {
      return res.status(400).json(null);
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ["Missing id"],
        });
      }
      if (req.userIsAdmin || req.params.id == req.userId) {
        const user = await User.findByPk(req.params.id);

        if (!user) {
          return res.status(400).json({
            errors: ["User not found"],
          });
        }

        await user.update(req.body);
        await Patrimony.update(
          { owner: req.body.name },
          {
            where: {
              userId: req.params.id,
            },
          }
        );
        return res.status(200).json({ success: ["Successfully updated"] });
      }
      return res.status(401).json({
        errors: ["Permission required"],
      });
    } catch (err) {
      return res
        .status(400)
        .json({ errors: err.errors.map((er) => er.message) });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ["Missing id"],
        });
      }
      /*if (req.userIsAdmin && req.params.id == req.userId) {
        return res.status(401).json({
          errors: ["Admins cannot delete themselves"],
        });
      }*/
      if (req.userIsAdmin || req.params.id == req.userId) {
        const user = await User.findByPk(req.params.id);

        if (!user) {
          return res.status(400).json({
            errors: ["User not found"],
          });
        }
        await user.destroy();
        return res.status(200).json({ success: ["User deleted"] });
      }
      return res.status(401).json({
        errors: ["Permission required"],
      });
    } catch (err) {
      return res.status(400).json({ errors: "Failed to delete" });
    }
  }
}

export default new UserController();
