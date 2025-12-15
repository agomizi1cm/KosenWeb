// app.js (または server.js)

const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes'); // 作成したルーターを読み込む

// EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');
app.set('views', './views'); // EJSファイルは views フォルダにあると仮定

// 【重要】ルーターをExpressアプリケーションで使用する
app.use('/', routes); 

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`テスト日程表のURL: http://localhost:${port}/schedule`);
});