const express = require('express');

const app = express();
const PORT = 3000;

const events = require('./data/year.json');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { title: '高専生活特化アプリ' });
});

app.get('/year', (req, res) => {
   res.render('year', { title: '年間予定表' });
});

app.get('/week', (req, res) => {
   res.render('week', { title: '授業時間割' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});