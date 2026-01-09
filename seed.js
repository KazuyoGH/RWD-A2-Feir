const { MongoClient } = require('mongodb');

const connectionString = 'mongodb://localhost:27017';
const client = new MongoClient(connectionString);

async function seed() {
    try {
        await client.connect();

        const database = client.db('teacherPortal');
        const users = database.collection('users');

        await users.deleteMany({});

        const defaultUsers = [
            {
                username: "adamp",
                password: "password123",
                fname: "Adam",
                classes: [
                    { name: "Trigonometry", deadline: "Final Exams", submitters: "2/10" },
                    { name: "General Math", deadline: "Group Project", submitters: "9/12" }
                ],
                events: [
                    { date: "January 9", title: "Final Exams" },
                    { date: "January 25", title: "Study Sessions for Trigonometry" }
                ],
            },


            {
                username: "maryd",
                password: "123password",
                fname: "Mary",
                classes: [
                    { name: "Modular Physics", deadline: "Experiments", submitters: "5/5" },
                    { name: "Earth Science", deadline: "Peer Reviews", submitters: "2/15" },
                    { name: "Kinetic Energy 101", deadline: "Final Exams", submitters: "0/8" }
                ],
                events: [
                    { date: "February 18", title: "Experiment Grading" },
                    { date: "March 30", title: "Reelection of Student Officers" },
                    { date: "April 7", title: "Peer Review Grade Release" },
                    { date: "April 11", title: "Earth Science New Lecture" }
                ],
            },
        ]
        await users.insertMany(defaultUsers);

    } finally {
        await client.close();
        process.exit();
    }
}
seed();