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

 
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Connect successfully...on PORT ${PORT}`);
});
