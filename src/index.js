const express = require('express');
const app = express();
const cors = require('cors')
const axios = require('axios'); // If you want to call internal APIs


require('dotenv').config();
const PORT = process.env.PORT || 3000;
const allroutes = require('./routes/index');

const sequelize = require('./database/index');
const cron = require('node-cron');

const Board = require('./models/boardmodel'); 
app.use(cors()) // Allow all origins (for development)


app.use(express.json());  
app.use("/", allroutes);


app.get('/checking-server', (req, res) => {
    res.send('Hello, World!');
});
cron.schedule('*/10 * * * *', async () => {
    console.log('🕒 Cron job running every 10 minutes');

    // Optional: trigger your own API if needed
    try {
        const response = await axios.get(`https://nodetask-backend.onrender.com/checking-server`);
        console.log('Cron called /checking-server →', response.data);
    } catch (err) {
        console.error('Error in cron job:', err.message);
    }
});

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
