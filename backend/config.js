require('dotenv').config();
module.exports = {
  MONGODB: `mongodb+srv://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
};
