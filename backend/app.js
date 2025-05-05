const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from Express! PM2 is running this app.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});