const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth-routes');
const cookieParser = require('cookie-parser');
const PassportConfig = require('./config/passport-config'); 

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})