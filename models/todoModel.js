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
  getAll: () => all('SELECT id, title, completed, created_at FROM todos ORDER BY id DESC'),

  getById: (id) => get('SELECT id, title, completed, created_at FROM todos WHERE id = ?', [id]),

  create: ({ title, completed = 0 }) =>
    run('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, completed ? 1 : 0])
      .then((r) => ({ id: r.lastID, title, completed: completed ? 1 : 0 })),

  update: (id, fields) => {
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
    params.push(id);
    const sql = `UPDATE todos SET ${sets.join(', ')} WHERE id = ?`;
    return run(sql, params);
  },

  delete: (id) => run('DELETE FROM todos WHERE id = ?', [id]),
};

module.exports = Todo;
