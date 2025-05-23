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

app.get('/fskill', async (req, res) => {
    try {
        const result = await pool.query('select * from freelancer_skills');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
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
//  List Freelancers with Skills
app.get('/fskills', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.full_name AS freelancer_name, s.name AS skills 
            FROM users u 
            JOIN freelancer_skills fs ON u.user_id = fs.user_id 
            JOIN skills s ON fs.skill_id = s.skill_id 
            WHERE u.user_type = 'freelancer' 
            ORDER BY u.full_name
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
// List Projects with Client Name and Category
app.get('/pclient&cat', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.title, p.description, c.name AS category, u.full_name AS client_name, p.budget
            FROM projects p
            JOIN categories c ON p.category_id = c.category_id
            JOIN users u ON p.client_id = u.user_id
            ORDER BY p.project_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Proposals per Project
// app.get('/proposals/projectId', async (req, res) => {
//     const { projectId } = req.params;
//     try {
//         const result = await pool.query(`
//             SELECT u.full_name AS freelancer, p.bid_amount, p.message
//             FROM proposals p
//             JOIN users u ON p.freelancer_id = u.user_id
//             WHERE p.project_id = $1
//         `, [projectId]);
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Completed Contracts with Freelancer & Client Info
app.get('/contracts/completed', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.contract_id, f.full_name AS freelancer, cl.full_name AS client, c.start_date, c.end_date
            FROM contracts c
            JOIN projects p ON c.project_id = p.project_id
            JOIN users f ON c.freelancer_id = f.user_id
            JOIN users cl ON p.client_id = cl.user_id
            WHERE c.status = 'completed'
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Reviews with Ratings for Freelancers
app.get('/reviewswitrating', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.full_name AS freelancer, r.rating, r.comment
            FROM reviews r
            JOIN contracts c ON r.contract_id = c.contract_id
            JOIN users u ON c.freelancer_id = u.user_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Messages Exchanged Between Two Users
app.get('/messages/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const result = await pool.query(`
            SELECT m.sender_id, s.full_name AS sender, r.full_name AS receiver, m.content, m.sent_at
            FROM messages m
            JOIN users s ON m.sender_id = s.user_id
            JOIN users r ON m.receiver_id = r.user_id
            WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
            ORDER BY m.sent_at
        `, [user1, user2]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get top-rated freelancers by average review rating
app.get('/freelancers/top-rated', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.full_name AS freelancer, AVG(r.rating) AS average_rating, COUNT(r.rating) AS total_reviews
            FROM reviews r
            JOIN contracts c ON r.contract_id = c.contract_id
            JOIN users u ON c.freelancer_id = u.user_id
            GROUP BY u.user_id
            HAVING COUNT(r.rating) >= 1
            ORDER BY average_rating DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get freelancers by specific skill (use query ?skill=React)
app.get('/freelancers/by-skill', async (req, res) => {
    const { skill } = req.query;
    try {
        const result = await pool.query(`
            SELECT u.full_name AS freelancer_name, s.name AS skill
            FROM users u
            JOIN freelancer_skills fs ON u.user_id = fs.user_id
            JOIN skills s ON fs.skill_id = s.skill_id
            WHERE u.user_type = 'freelancer' AND s.name ILIKE $1
        `, [skill]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List open projects that have received no proposals yet
app.get('/projects/no-proposals', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.project_id, p.title, p.description
            FROM projects p
            LEFT JOIN proposals pr ON p.project_id = pr.project_id
            WHERE pr.project_id IS NULL
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get clients with how many projects they've posted
app.get('/clients/project-count', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.full_name AS client, COUNT(p.project_id) AS total_projects
            FROM users u
            JOIN projects p ON u.user_id = p.client_id
            WHERE u.user_type = 'client'
            GROUP BY u.user_id
            ORDER BY total_projects DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Total earnings per freelancer from completed contracts
app.get('/freelancers/earnings', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.full_name AS freelancer, SUM(c.payment_amount) AS total_earned
            FROM contracts c
            JOIN users u ON c.freelancer_id = u.user_id
            WHERE c.status = 'completed'
            GROUP BY u.user_id
            ORDER BY total_earned DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
// PUT /users/:id
// Update user details by user_id
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, full_name, user_type } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1,
           email = $2,
           password = $3,
           full_name = $4,
           user_type = $5
       WHERE user_id = $6
       RETURNING *`,
      [username, email, password, full_name, user_type, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user: result.rows[0] });
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
// PUT /categories/:id
// Update category details by category_id
app.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE categories
       SET name = $1,
           description = $2
       WHERE category_id = $3
       RETURNING *`,
      [name, description, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category updated successfully', category: result.rows[0] });
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
// PUT /skills/:id
// Update skill name by skill_id
app.put('/skills/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = await pool.query(
      `UPDATE skills
       SET name = $1
       WHERE skill_id = $2
       RETURNING *`,
      [name, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Skill not found' });

    res.json({ message: 'Skill updated successfully', skill: result.rows[0] });
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
// PUT /freelancer_skills/:id
// Update freelancer skill by freelancer_skill_id (if exists) or use user_id and skill_id in body
// Assuming you have freelancer_skill_id as PK for simplicity
app.put('/freelancer_skills/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, skill_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE freelancer_skills
       SET user_id = $1,
           skill_id = $2
       WHERE freelancer_skill_id = $3
       RETURNING *`,
      [user_id, skill_id, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Freelancer skill not found' });

    res.json({ message: 'Freelancer skill updated successfully', freelancer_skill: result.rows[0] });
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
// PUT /projects/:id
// Update project details by project_id
app.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { client_id, title, description, category_id, budget } = req.body;

  try {
    const result = await pool.query(
      `UPDATE projects
       SET client_id = $1,
           title = $2,
           description = $3,
           category_id = $4,
           budget = $5
       WHERE project_id = $6
       RETURNING *`,
      [client_id, title, description, category_id, budget, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });

    res.json({ message: 'Project updated successfully', project: result.rows[0] });
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
// PUT /proposals/:id
// Update proposal details by proposal_id
app.put('/proposals/:id', async (req, res) => {
  const { id } = req.params;
  const { project_id, freelancer_id, bid_amount, message } = req.body;

  try {
    const result = await pool.query(
      `UPDATE proposals
       SET project_id = $1,
           freelancer_id = $2,
           bid_amount = $3,
           message = $4
       WHERE proposal_id = $5
       RETURNING *`,
      [project_id, freelancer_id, bid_amount, message, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Proposal not found' });

    res.json({ message: 'Proposal updated successfully', proposal: result.rows[0] });
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

// PUT /contracts/:id
// Update contract details by contract_id
app.put('/contracts/:id', async (req, res) => {
  const { id } = req.params;
  const { project_id, freelancer_id, start_date, end_date, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE contracts
       SET project_id = $1,
           freelancer_id = $2,
           start_date = $3,
           end_date = $4,
           status = $5
       WHERE contract_id = $6
       RETURNING *`,
      [project_id, freelancer_id, start_date, end_date, status, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Contract not found' });

    res.json({ message: 'Contract updated successfully', contract: result.rows[0] });
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
// for updating review by id
app.put('/rev/:id', async (req, res) => {
  const { id } = req.params; // review_id from URL
  const { contract_id, rating, comment, review_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reviews
       SET contract_id = $1,
           rating = $2,
           comment = $3,
           review_date = $4
       WHERE review_id = $5
       RETURNING *`,
      [contract_id, rating, comment, review_date, id]
    );

    if (result.rows.length === 0) {
      // No row found with this review_id
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review updated successfully', review: result.rows[0] });
  } catch (err) {
    console.error('Error updating review:', err);
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
// PUT /payments/:id
// Update payment details by payment_id
app.put('/payments/:id', async (req, res) => {
  const { id } = req.params;
  const { contract_id, amount, paid_on } = req.body;

  try {
    const result = await pool.query(
      `UPDATE payments
       SET contract_id = $1,
           amount = $2,
           paid_on = $3
       WHERE payment_id = $4
       RETURNING *`,
      [contract_id, amount, paid_on, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Payment not found' });

    res.json({ message: 'Payment updated successfully', payment: result.rows[0] });
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
// PUT /messages/:id
// Update message content by message_id
app.put('/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { sender_id, receiver_id, content } = req.body;

  try {
    const result = await pool.query(
      `UPDATE messages
       SET sender_id = $1,
           receiver_id = $2,
           content = $3
       WHERE message_id = $4
       RETURNING *`,
      [sender_id, receiver_id, content, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Message not found' });

    res.json({ message: 'Message updated successfully', messageData: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


 
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Connect successfully...on PORT ${PORT}`);
});
