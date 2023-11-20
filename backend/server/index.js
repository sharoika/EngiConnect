require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3001;
const client = new MongoClient(process.env.DB_URI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { Server } = require("socket.io");
const io = new Server({});

io.listen(3001);
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('message', (message) => {
    console.log('Received message:', message);
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await client.connect();
    const usersCollection = client.db("engiconnect").collection("users");
    const user = await usersCollection.findOne({ email, password });
    if (user) {
      console.log("Login successful.");
      res.status(200).json({ message: "Login successful.", userId: user._id, fullName: (user.firstName + " " + user.lastName) });
    } else {
      console.log("Wrong username and password, please try again.");
      res.status(401).json({ message: "Wrong username and password, please try again." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    console.log("Internal server error, please try again.");
    res.status(500).json({ message: "Internal server error, please try again." });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    await client.connect();
    const usersCollection = client.db('engiconnect').collection('users');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('User with this email already exists.');
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailPattern)) {
      console.log('Invalid email format.');
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!firstName || !lastName) {
      console.log('First name and last name cannot be empty.');
      return res.status(400).json({ message: 'First name and last name cannot be empty.' });
    }
    if (password.length < 8) {
      console.log('Password must be at least 8 characters.');
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
      console.log("User registered successfully.");
      res.status(200).json({ message: 'User registered successfully.' });
    } else {
      console.log("Failed to register user, please try again.");
      res.status(500).json({ message: 'Failed to register user, please try again.' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await client.connect();
    const usersCollection = client.db('engiconnect').collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.put('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    await client.connect();
    const usersCollection = client.db('engiconnect').collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const { _id, ...userDataWithoutId } = updatedUserData;
      const isDataUpdated = Object.keys(userDataWithoutId).every(
        key => {
          return key === 'isVerified' || user[key] === userDataWithoutId[key];
        }
      );
      if (!isDataUpdated) {
        userDataWithoutId.isVerified = false;
      }
      const isVerifiedUpdated = user.isVerified == userDataWithoutId.isVerified;
      if (isDataUpdated && isVerifiedUpdated) {
        res.status(200).json({ message: 'User data is already up to date' });
      } else {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: userDataWithoutId }
        );
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'User data updated successfully' });
        } else {
          res.status(500).json({ message: 'Failed to update user data' });
        }
      }
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.get('/issues', async (req, res) => {
  try {
    await client.connect();
    const issuesCollection = client.db('engiconnect').collection('issues');
    const query = {};
    const issues = await issuesCollection.find(query).sort({ createdDate: -1 }).toArray();
    res.status(200).json({ issues });
  } catch (error) {
    console.error('Error getting issues:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.get('/issue/:id', async (req, res) => {
  const issueId = req.params.id;
  try {
    await client.connect();
    const issuesCollection = client.db('engiconnect').collection('issues');
    const query = { _id: ObjectId(issueId) };
    const issue = await issuesCollection.findOne(query);
    if (issue) {
      res.status(200).json({ issue });
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    console.error('Error getting issue by ID:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.post('/issue', async (req, res) => {
  try {
    const { subjectText, bodyText, selectedSDGs, userId, fullName } = req.body;
    await client.connect();
    const issuesCollection = client.db('engiconnect').collection('issues');
    const createdDate = Date.now();
    var favouritedUsers = [];
    const newIssue = {
      subject: subjectText,
      body: bodyText,
      selectedSDGs,
      userId,
      fullName,
      createdDate,
      favouritedUsers,
    };
    const result = await issuesCollection.insertOne(newIssue);
    if (result.insertedId) {
      res.status(200).json({ message: `Created successfully`, _id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create issue' });
    }
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.post('/issue/:id', async (req, res) => {
  const issueId = req.params.id;
  const userId = req.body.userId;
  try {
    await client.connect();
    const issuesCollection = client.db('engiconnect').collection('issues');
    const query = { _id: ObjectId(issueId) };
    const issue = await issuesCollection.findOne(query);
    if (issue) {
      const isFavorited = issue.favouritedUsers.includes(userId);
      if (isFavorited) {
        await issuesCollection.updateOne(query, { $pull: { favouritedUsers: userId } });
      } else {
        await issuesCollection.updateOne(query, { $push: { favouritedUsers: userId } });
      }
      const updatedIssue = await issuesCollection.findOne(query);
      res.status(200).json({ issue: updatedIssue, isFavorited: !isFavorited });
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    console.error('Error updating favorited status:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.post('/reply', async (req, res) => {
  try {
    const { issueId, userId, fullName, replyText } = req.body;
    await client.connect();
    const repliesCollection = client.db('engiconnect').collection('replies');
    const newReply = {
      issueId,
      userId,
      fullName,
      replyText,
    };
    const result = await repliesCollection.insertOne(newReply);
    if (result.insertedId) {
      res.status(200).json({ message: 'Reply added successfully', _id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to add reply' });
    }
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.get('/replies/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params;
    await client.connect();
    const repliesCollection = client.db('engiconnect').collection('replies');
    const replies = await repliesCollection.find({ issueId: issueId }).toArray();
    res.status(200).json({ replies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.post('/interaction', async (req, res) => {
  try {
    var { userId, issueId, hasRead, hasLiked, hasDisliked } = req.body;
    hasRead = true;
    await client.connect();
    const interactionsCollection = client.db('engiconnect').collection('interactions');
    const existingInteraction = await interactionsCollection.findOne({ userId, issueId });
    if (hasLiked == null) {
      hasLiked = existingInteraction?.hasLiked ?? false;
    }
    if (hasDisliked == null) {
      hasDisliked = existingInteraction?.hasDisliked ?? false;
    }
    if (existingInteraction) {
      await interactionsCollection.updateOne(
        { userId, issueId },
        { $set: { hasRead, hasLiked, hasDisliked } }
      );
      const updatedInteraction = await interactionsCollection.findOne({ userId, issueId });
      res.status(200).json({ message: 'Interaction record updated successfully', interaction: updatedInteraction });
    } else {
      await interactionsCollection.insertOne({
        userId,
        issueId,
        hasRead,
        hasLiked,
        hasDisliked,
      });
      const insertedInteraction = await interactionsCollection.findOne({ userId, issueId });
      res.status(200).json({ message: 'Interaction record inserted successfully', interaction: insertedInteraction });
    }
  } catch (error) {
    console.error('Error updating/inserting interaction record:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.get('/interaction/count/:issueId', async (req, res) => {
  try {
    const issueId = req.params.issueId;
    await client.connect();
    const interactionsCollection = client.db('engiconnect').collection('interactions');
    const likeCount = await interactionsCollection.countDocuments({ issueId, hasLiked: true });
    const dislikeCount = await interactionsCollection.countDocuments({ issueId, hasDisliked: true });
    res.status(200).json({ likeCount, dislikeCount });
  } catch (error) {
    console.error('Error getting interaction counts:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});