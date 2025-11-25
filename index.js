const express = require('express');
// initialize db first
require('./db');

const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_, res) => {
    res.send('Todo API. Visit /todos for endpoints.\n');
});

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});



