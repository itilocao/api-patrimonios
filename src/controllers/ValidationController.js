class ValidationController {
  async index(req, res) {
    return res.status(200).json({ success: ["Successfully"] });
  }
}

export default new ValidationController();
