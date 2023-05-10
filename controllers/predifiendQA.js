import PreQA from "../models/PredifiendQA.js";

export async function getAll(req, res, next) {
  try {
    const preQA = await PreQA.findAll();
    res.status(200).json({ success: true, data: preQA });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const preQA = await PreQA.findByPk(id);
    if (!preQA) {
      return res
        .status(404)
        .send({ success: false, message: "This pre-QA is not found" });
    }
    res.status(200).send({ success: true, preQA });
  } catch (error) {
    next(error);
  }
}

export async function addPreQA(req, res, next) {
  try {
    const { question, answer } = req.body;

    const preQA = new PreQA({
      question,
      answer,
    });

    await preQA.save();

    res.status(201).json({ message: "The Pre-QA created successfully", preQA });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function editPreQAById(req, res) {
  try {
    const preId = req.params.id;
    const { question, answer } = req.body;

    const preQA = await PreQA.findByPk(preId);

    if (!preQA) {
      return res.status(404).json({ message: "This Pre-QA not found" });
    }

    const updatedPreQa = await preQA.update({
      question,
      answer,
    });

    res.status(200).json({ message: "Update successful", data: updatedPreQa });
  } catch (err) {
    res.status(404).json({ message: err });
  }
}

export async function deletePreQAById(req, res, next) {
  try {
    const preId = req.params.id;
    const preQa = await PreQA.findByPk(preId);

    if (!preQa) {
      return res.status(404).json({ message: "This Pre-QA is not found" });
    }
    await PreQA.destroy({ where: { id: preId } });
    res.status(200).json({ message: "This Pre-QA is deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

const controller = {
  getAll,
  getById,
  addPreQA,
  editPreQAById,
  deletePreQAById,
};
export default controller;
