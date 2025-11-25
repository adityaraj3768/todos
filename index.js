const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
    res.send('Hello, World!\n');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});



