require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth-routes');
// eslint-disable-next-line no-unused-vars
const PassportConfig = require('./config/passport-config');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
