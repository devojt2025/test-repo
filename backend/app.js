const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process')
const app = express();
const crypto = require('crypto')
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from Express! PM2 is running this app.');
});
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json()); // Keep for other routes
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const secret = 'D3vOjt2025';
    const signature = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(req.body).digest('hex');

    if (signature !== digest) {
        console.log('Invalid signature');
        return res.sendStatus(401);
    }

    const payload = JSON.parse(req.body);
    const repoName = payload.repository?.name;
    console.log(`Received push event for: ${repoName}`)
    exec(`
        cd C:/path/to/your/myProject &&
        git pull &&
        cd frontend && npm install && npm run build &&
        cd ../backend && npm install && pm2 restart app.js
    `, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${stderr}`);
            return res.sendStatus(500);
        }
        console.log(`Deploy script output:\n${stdout}`);
        res.sendStatus(200);
    });
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});