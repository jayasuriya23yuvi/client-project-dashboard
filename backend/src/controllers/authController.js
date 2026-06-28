const pool = require('../config/db');

const bcrypt = require('bcrypt');

const jwt=require('jsonwebtoken');

const registerUser = async(req, res) => {
    const { name, email, password,role} = req.body;
    if (!name || !email || !password || !role) {
   return res.status(400).json({
      message: "All fields are required"
   });
}
const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
);

if (existingUser.rows.length > 0) {
    return res.status(400).json({
        message: 'Email already exists'
    });
}
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, hashedPassword, role]);
    console.log(name);
    console.log(email);
    console.log(role);
   res.json({ message: 'User registered successfully' });
   
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
        { id: user.rows[0].id,
          role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token, user:{
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
    }});
};
module.exports = { registerUser, loginUser  }; 