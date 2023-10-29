require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3001;
const client = new MongoClient(process.env.DB_URI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await client.connect();
    const usersCollection = client.db("engiconnect").collection("users");
    const user = await usersCollection.findOne({ email, password });
    if (user) {
      console.log("Login successful.");
      res.status(200).json({ message: "Login successful." });
    } else {
      console.log("Wrong username and password, please try again.");
      res.status(401).json({ message: "Wrong username and password, please try again." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    console.log("Internal server error, please try again.");
    res.status(500).json({ message: "Internal server error, please try again." });
  } finally {
    await client.close();
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    await client.connect();
    const usersCollection = client.db('engiconnect').collection('users');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailPattern)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name cannot be empty.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    const newUser = {
      email,
      firstName,
      lastName,
      password,
    };
    const result = await usersCollection.insertOne(newUser);
    if (result.insertedId) {
      res.status(200).json({ message: 'User registered successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to register user, please try again.' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});