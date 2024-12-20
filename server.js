const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Expense = require('./models/Expense');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expense-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// JWT Secret
const JWT_SECRET = 'your_jwt_secret';

// Register route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to authenticate requests using JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).send('Access denied');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
};

// Expense routes
app.post('/api/expenses', authenticateJWT, async (req, res) => {
    const { category, amount, comments } = req.body;
    const userId = req.user.userId;

    const expense = new Expense({
        user_id: userId,
        category,
        amount,
        comments,
        created_at: new Date(),
        updated_at: new Date(),
    });

    try {
        await expense.save();
        res.status(201).send('Expense added');
    } catch (error) {
        res.status(400).send('Error adding expense');
    }
});

app.get('/api/expenses', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;
    try {
        const expenses = await Expense.find({ user_id: userId }).sort({ created_at: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(400).send('Error fetching expenses');
    }
});

app.put('/api/expenses/:id', authenticateJWT, async (req, res) => {
    const { category, amount, comments } = req.body;
    const userId = req.user.userId;

    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user_id: userId },
            { category, amount, comments, updated_at: new Date() },
            { new: true }
        );
        res.json(expense);
    } catch (error) {
        res.status(400).send('Error updating expense');
    }
});

app.delete('/api/expenses/:id', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;

    try {
        await Expense.findOneAndDelete({ _id: req.params.id, user_id: userId });
        res.status(200).send('Expense deleted');
    } catch (error) {
        res.status(400).send('Error deleting expense');
    }
});

app.get('/api/expenses/distribution', authenticateJWT, async (req, res) => {
    const userId = req.user.userId;

    try {
        const expenses = await Expense.find({ user_id: userId });
        const distribution = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        res.json(distribution);
    } catch (error) {
        res.status(400).send('Error calculating distribution');
    }
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
