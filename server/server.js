const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todos')
const { User } = require('./models/user')

const app = express();

app.use(bodyParser.json());
// POST TODOS
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});
// GET ALL TODOS
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});
// GET ONE TODO
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: 'Id not Valid',
            status: 404
        });
    }
    Todo.findById(id).then((todos) => {
        if (!todos) {
            res.status(400).send({
                message: 'Id not Found',
                status: 400
            });
        }
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};
