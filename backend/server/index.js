require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

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
    //await client.close();
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
    //await client.close();
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
    //await client.close();
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
        key => user[key] === userDataWithoutId[key]
      );

      if (isDataUpdated) {
        res.status(200).json({ message: 'User data is already up to date' });
      } else {
        userDataWithoutId.isVerified = false;
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: userDataWithoutId }
        );

        //await client.close();

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
    //await client.close();

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
    //await client.close();

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
    const { subjectText, bodyText, type, selectedSDGs, userId, fullName } = req.body;

    await client.connect();
    const issuesCollection = client.db('engiconnect').collection('issues');

    const createdDate = Date.now();
    const likes = 0;
    const dislikes = 0

    const newIssue = {
      subject: subjectText,
      body: bodyText,
      type,
      selectedSDGs,
      userId,
      fullName,
      createdDate,
      likes,
      dislikes
    };

    const result = await issuesCollection.insertOne(newIssue);
    //await client.close();

    if (result.insertedId) {
      res.status(200).json({ message: `${type} created successfully`, _id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create issue' });
    }
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ message: 'Internal server error, please try again' });
  }
});

// app.put('/issue/:id', async (req, res) => {
//   try {
//     const issueId = req.params.id;
//     const { subjectText, bodyText, type, selectedSDGs } = req.body; 

//     await client.connect();
//     const issuesCollection = client.db('engiconnect').collection('issues');

//     const existingIssue = await issuesCollection.findOne({ _id: new ObjectId(issueId) });

//     if (!existingIssue) {
//       res.status(404).json({ message: 'Issue not found' });
//     } else {
//       const updatedIssue = {
//         subject: subjectText,
//         body: bodyText,
//         type,
//         selectedSDGs,
//       };

//       const result = await issuesCollection.updateOne(
//         { _id: new ObjectId(issueId) },
//         { $set: updatedIssue }
//       );

//       if (result.modifiedCount === 1) {
//         res.status(200).json({ message: `${type} updated successfully` });
//       } else {
//         res.status(500).json({ message: 'Failed to update issue' });
//       }
//     }
//   } catch (error) {
//     console.error('Error updating issue:', error);
//     res.status(500).json({ message: 'Internal server error, please try again' });
//   } finally {
//     //await client.close();
//   }
// });

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
    //await client.close();

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


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});