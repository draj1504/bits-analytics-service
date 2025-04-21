const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 4003; // different from task & notification services

app.use(cors());
app.use(express.json());

const db = new Pool({ user: 'postgres', password: 'Lovealll@7', host: 'localhost', port: 5432, database: 'taskdb' });

// Test route
app.get('/', (req, res) => {
 res.send('Analytics Service is running');
});

app.get('/analytics/task-status', async (req, res) => {
 try {
  const result = await db.query(`
      SELECT status, COUNT(*) as count
      FROM tasks
      GROUP BY status
    `);
  res.json(result.rows);
 } catch (err) {
  console.error('Error fetching task status counts:', err);
  res.status(500).send('Internal Server Error');
 }
});

// In analytics-service (Express server)
app.get('/analytics/tasks-per-assignee', async (req, res) => {
 try {
  const result = await db.query(`
      SELECT assignee, COUNT(*) as count
      FROM tasks
      GROUP BY assignee
    `);
  res.json(result.rows);
 } catch (err) {
  console.error('Error fetching analytics:', err);
  res.status(500).json({ error: 'Internal server error' });
 }
});


app.listen(port, () => {
 console.log(`Analytics Service running on http://localhost:${port}`);
});

module.exports = { app, db };
