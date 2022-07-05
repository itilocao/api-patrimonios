import multer from "multer";
import multerConfig from "../config/multerConfig";
import Patrimony from "../models/Patrimony";

const upload = multer(multerConfig).single("photo");

class PhotoController {
  async update(req, res) {
    if (!req.params.id) {
      return res.status(400).json({
        errors: ["Missing id"],
      });
    }

    const patri = await Patrimony.findByPk(req.params.id);

    if (!patri) {
      return res.status(400).json({
        errors: ["Patrimony not found"],
      });
    }

    if (req.userIsAdmin || patri.userId == req.userId) {
      return upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            errors: [err],
          });
        }

        const { filename } = req.file;
        try {
          await patri.update({ filename });
          return res.status(200).json({ success: ["Photo send"] });
        } catch (e) {
          return res.status(400).json({ errors: ["Fail to save"] });
        }
      });
    }
    return res.status(401).json({
      errors: ["Permission required"],
    });
  }
}

export default new PhotoController();
