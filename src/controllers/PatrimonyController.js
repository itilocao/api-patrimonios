import User from "../models/User";
import Patrimony from "../models/Patrimony";

class PatrimonyController {
  async store(req, res) {
    try {
      const user = await User.findByPk(req.userId);
      const { name } = user;
      const patrimony = req.body;
      patrimony["owner"] = name;

      const response = await user.createPatrimony(patrimony);
      return res.status(200).json(response);
    } catch (err) {
      return res
        .status(400)
        .json({ errors: err.errors.map((er) => er.message) });
    }
  }

  async index(req, res) {
    const { userId } = req.query;

    if (userId) {
      try {
        const response = await Patrimony.findAll({
          attributes: [
            "id",
            "name",
            "cod",
            "note",
            "details",
            "owner",
            "userId",
            "url",
            "filename",
          ],
          order: [["id", "DESC"]],
          where: {
            userId,
          },
        });
        return res.json(response);
      } catch (err) {
        return res.status(400).json(null);
      }
    }

    try {
      const response = await Patrimony.findAll({
        attributes: [
          "id",
          "name",
          "cod",
          "note",
          "details",
          "owner",
          "userId",
          "url",
          "filename",
        ],
        order: [["id", "DESC"]],
      });
      return res.json(response);
    } catch (err) {
      return res.status(400).json(null);
    }
  }

  async show(req, res) {
    try {
      const response = await Patrimony.findByPk(req.params.id, {
        attributes: [
          "id",
          "name",
          "cod",
          "note",
          "details",
          "owner",
          "userId",
          "url",
          "filename",
        ],
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

      const patrimony = await Patrimony.findByPk(req.params.id);

      if (!patrimony) {
        return res.status(400).json({
          errors: ["Patrimony not found"],
        });
      }

      const { userId } = patrimony;
      if (req.userIsAdmin || userId == req.userId) {
        await patrimony.update(req.body);
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

      const patrimony = await Patrimony.findByPk(req.params.id);

      if (!patrimony) {
        return res.status(400).json({
          errors: ["Patrimony not found"],
        });
      }

      const { userId } = patrimony;
      if (req.userIsAdmin || userId == req.userId) {
        await patrimony.destroy();
        return res.status(200).json({ success: ["Patrimony deleted"] });
      }
      return res.status(401).json({
        errors: ["Permission required"],
      });
    } catch (err) {
      return res.status(400).json({ errors: "Failed to delete" });
    }
  }
}

export default new PatrimonyController();
