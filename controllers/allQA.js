import AllQA from "../models/AllQA.js";

export async function getAll(req, res, next) {
  try {
    const allQA = await AllQA.findAll();
    res.status(200).json({ success: true, data: allQA });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const allQA = await AllQA.findByPk(id);
    if (!allQA) {
      return res
        .status(404)
        .send({ success: false, message: "This QA is not found" });
    }
    res.status(200).send({ success: true, allQA });
  } catch (error) {
    next(error);
  }
}

export async function addQA(req, res, next) {
  try {
    const { predifiend_qa_id, chat_id } = req.body;

    const newQA = new AllQA({
      predifiend_qa_id,
      chat_id,
    });

    await newQA.save();

    res
      .status(201)
      .json({ message: "This QA has been created successfully", newQA });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteQAById(req, res, next) {
  try {
    const qaId = req.params.id;
    const QA = await AllQA.findByPk(qaId);

    if (!QA) {
      return res.status(404).json({ message: "This QA is not found" });
    }
    await QA.destroy({ where: { id: qaId } });
    res.status(200).json({ message: "This QA has been deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

const controller = { getAll, getById, addQA, deleteQAById };
export default controller;