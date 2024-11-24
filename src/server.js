const app = require('./app');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;

dotenv.config();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
