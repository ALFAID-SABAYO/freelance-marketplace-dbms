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
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Connect successfully...on PORT ${PORT}`);
});
