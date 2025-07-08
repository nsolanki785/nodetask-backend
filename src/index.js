const express = require('express');
const app = express();
const cors = require('cors')

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const allroutes = require('./routes/index');

const sequelize = require('./database/index');
const Board = require('./models/boardmodel'); 
app.use(cors()) // Allow all origins (for development)


app.use(express.json());  
app.use("/", allroutes);

app.get('/checking-server', (req, res) => {
    res.send('Hello, World!');
});
console.log("dbname",process.env.DB_NAME);


// Function to create default board if none exists
async function initializeDefaultBoard() {
  const count = await Board.count();
  if (count === 0) {
    await Board.create({ title: 'Default Board' });
    console.log('Default board created');
  }
}

sequelize.sync()
  .then(async () => {
    console.log('✅ Database synced');
    await initializeDefaultBoard();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB sync error:', err);
  });
