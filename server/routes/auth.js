const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Mock authentication
    if (email === 'admin24@gmail.com' && password === 'admin24#') {
        res.json({ message: 'Login successful', token: 'mock-token' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;