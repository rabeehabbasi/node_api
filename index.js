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
mongoose.connect(process.env.MONGODB_URI, {dbName: 'persons'})
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
        .catch(err => {
            res.json(err);
        });
})

app.get('/persons/:id', (req, res) => {
    const id = req.params.id;
    PersonModel.find({"id": id}).lean()
        .then((data) => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        });
})

app.post('/persons/update', (req, res) => {
    PersonModel.findOne({id: req.body.id})
        .then((data) => {
            data.name = req.body.name;
            data.age = req.body.age;
            data.save();
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        });
})

app.post('/persons', (req, res) => {
    const person = new PersonModel(req.body);
    person.save()
        .then((data) => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        });
})
