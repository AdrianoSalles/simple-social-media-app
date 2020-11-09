require('dotenv').config();
module.exports = {
  MONGODB: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  SECRET_KEY: process.env.SECRET_KEY,
};
