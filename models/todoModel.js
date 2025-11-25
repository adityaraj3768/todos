const db = require('../db');

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

const Todo = {
  getAll: (userId) => all('SELECT id, title, completed, created_at FROM todos WHERE user_id = ? ORDER BY id DESC', [userId]),

  getById: (id, userId) => get('SELECT id, title, completed, created_at FROM todos WHERE id = ? AND user_id = ?', [id, userId]),

  create: ({ title, completed = 0, userId }) =>
    run('INSERT INTO todos (title, completed, user_id) VALUES (?, ?, ?)', [title, completed ? 1 : 0, userId])
      .then((r) => ({ id: r.lastID, title, completed: completed ? 1 : 0 })),

  update: (id, fields, userId) => {
    const sets = [];
    const params = [];
    if (fields.title !== undefined) {
      sets.push('title = ?');
      params.push(fields.title);
    }
    if (fields.completed !== undefined) {
      sets.push('completed = ?');
      params.push(fields.completed ? 1 : 0);
    }
    if (sets.length === 0) return Promise.resolve({ changes: 0 });
    params.push(id, userId);
    const sql = `UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`;
    return run(sql, params);
  },

  delete: (id, userId) => run('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]),
};

module.exports = Todo;
