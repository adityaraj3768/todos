const express = require('express');
// initialize db first
require('./db');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_, res) => {
    res.send('Todo API with Authentication. Visit /auth/register or /auth/login to get started.\n');
});

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});



