const express = require('express');
const bodyParser = require('body-parser');
const { setMailRoutes } = require('./routes/mailRoutes');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setMailRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});