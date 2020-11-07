require('dotenv').config();
module.exports = {
  MONGODB: `mongodb+srv://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASS)}@cluster0.6aab1.mongodb.net/mong?retryWrites=true&w=majority`,
};
