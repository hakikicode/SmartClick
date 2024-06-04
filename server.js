const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let userData = {};

app.post('/api/update-score', (req, res) => {
    const { userId, taps, score, level } = req.body;
    if (!userData[userId]) {
        userData[userId] = { taps: 0, score: 0, level: 1 };
    }
    userData[userId].taps = taps;
    userData[userId].score = score;
    userData[userId].level = level;

    res.json({ success: true, user: userData[userId] });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
