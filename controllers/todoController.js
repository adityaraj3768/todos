const Todo = require('../models/todoModel');

const getAll = async (req, res) => {
  try {
    const rows = await Todo.getAll(req.userId);
    res.json(rows.map(r => ({ ...r, completed: !!r.completed })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await Todo.getById(id, req.userId);
    if (!row) return res.status(404).json({ error: 'Todo not found' });
    res.json({ ...row, completed: !!row.completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

const create = async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required' });
    }
    const created = await Todo.create({ title: title.trim(), completed: completed ? 1 : 0, userId: req.userId });
    res.status(201).json({ id: created.id, title: created.title, completed: !!created.completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, completed } = req.body;
    const result = await Todo.update(id, { title, completed }, req.userId);
    if (result.changes === 0) return res.status(404).json({ error: 'Todo not found or nothing to update' });
    const updated = await Todo.getById(id, req.userId);
    res.json({ ...updated, completed: !!updated.completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await Todo.delete(id, req.userId);
    if (result.changes === 0) return res.status(404).json({ error: 'Todo not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

module.exports = { getAll, getById, create, update, remove };
