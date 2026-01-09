const express = require('express');
const app = express();
const port = 3000;

const { MongoClient } = require('mongodb');
const connectionString = 'mongodb://localhost:27017';
const client = new MongoClient(connectionString)

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let currentUser = null;

app.post('/login', async (req, res) => {
    await client.connect();
    const database = client.db('teacherPortal');
    const users = database.collection('users');

    const loginUser = req.body.username
    const loginPass = req.body.password

    const user = await users.findOne({
        username: loginUser,
        password: loginPass,
    });

    if (user) {
        currentUser = user;
        res.redirect('/home.html');
    } else {
        res.status(401).send("Invalid username or password.");
    }

})

app.get('/api/user', (req, res) => {
    res.json(currentUser);
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
