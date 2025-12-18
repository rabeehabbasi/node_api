const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
let PersonModel
const PersonSchema = new mongoose.Schema({
    id: Number,
    name: String,
    age: Number
});
mongoose.connect(process.env.MONGODB_URI+process.env.MONGO_DB)
    .then((result) => {
        console.log('connected to Mongodb: ');
        PersonModel = mongoose.model('person', PersonSchema, 'persons');
        // console.log(PersonModel.schema)
        app.listen(8080, () => { console.log("backend server is running!!!"); });
    }).catch((err) => {
        console.error(err);
    });



app.get('/', (req, res) => {
    PersonModel.find({}).lean()
        .then((data) => {
            res.json(data);
        })
})

app.get('/persons/:id', (req, res) => {
    const id = req.params.id;
    PersonModel.find({"id": id})
        .then((data) => {
            res.json(data);
        })
})

app.post('/persons', (req, res) => {
    const person = new PersonModel(req.body);
    person.save()
        .then((data) => {
            res.send(data);
        })
        .catch(err => {
            res.send(err);
        });
})

app.post('/persons/update', (req, res) => {
    const person_body = req.body;
    PersonModel.findOne({id: person_body.id})
        .then((data) => {
            data.name = person_body.name;
            data.age = person_body.age;
            data.save().then(doc => console.log(doc));
            res.send(data);
        })
        .catch(err => {
            res.send(err);
        });
})
