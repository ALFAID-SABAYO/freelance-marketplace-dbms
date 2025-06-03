const express = require('express');

const cors = require('cors');

const pool = require('./db')

require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        res.json('WELCOME TO FREELANCER_MARKETPLACE_PLATFORM');
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/cat', async (req, res) => {
    try {
        const result = await pool.query('select * from categories');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/con', async (req, res) => {
    try {
        const result = await pool.query('select * from contracts');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get("/fskill", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM freelancer_skills");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/mess', async (req, res) => {
    try {
        const result = await pool.query('select * from messages');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/pay', async (req, res) => {
    try {
        const result = await pool.query('select * from payments');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/pro', async (req, res) => {
    try {
        const result = await pool.query('select * from projects');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/prop', async (req, res) => {
    try {
        const result = await pool.query('select * from proposals');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/rev', async (req, res) => {
    try {
        const result = await pool.query('select * from reviews');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/ski', async (req, res) => {
    try {
        const result = await pool.query('select * from skills');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/user', async (req, res) => {
    try {
        const result = await pool.query('select * from users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

//post api
// POST /users - Add a new user
app.post('/users', async (req, res) => {
    const { username, email, password, full_name, user_type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password, full_name, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, email, password, full_name, user_type]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /categories
app.post('/categories', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST /skills
app.post('/skills', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO skills (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /freelancer_skills
app.post('/freelancer_skills', async (req, res) => {
  const { user_id, skill_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO freelancer_skills (user_id, skill_id) VALUES ($1, $2) RETURNING *',
      [user_id, skill_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /projects
app.post('/projects', async (req, res) => {
    const { client_id, title, description, category_id, budget } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO projects (client_id, title, description, category_id, budget) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [client_id, title, description, category_id, budget]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /proposals
app.post('/proposals', async (req, res) => {
    const { project_id, freelancer_id, bid_amount, message } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO proposals (project_id, freelancer_id, bid_amount, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [project_id, freelancer_id, bid_amount, message]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /contracts
app.post('/contracts', async (req, res) => {
    const { project_id, freelancer_id, start_date, end_date, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO contracts (project_id, freelancer_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [project_id, freelancer_id, start_date, end_date, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /reviews
app.post('/reviews', async (req, res) => {
    const { contract_id, rating, comment } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO reviews (contract_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
            [contract_id, rating, comment]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /payments
app.post('/payments', async (req, res) => {
    const { contract_id, amount, paid_on } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO payments (contract_id, amount, paid_on) VALUES ($1, $2, $3) RETURNING *',
            [contract_id, amount, paid_on]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /messages
app.post('/messages', async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
            [sender_id, receiver_id, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
});
 
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Connect successfully...on PORT ${PORT}`);
});
