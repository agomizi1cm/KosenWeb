const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello from Windows & Node.js!</h1><p>Webアプリが動いています。</p>');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});