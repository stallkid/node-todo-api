require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose')

const { Todo } = require('./models/todos')
const { User } = require('./models/user')
var {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

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
            message: 'ID not Valid',
            status: 404
        });
    }
    Todo.findById(id).then((todos) => {
        if (!todos) {
            res.status(404).send({
                message: 'ID not Found',
                status: 404
            });
        }
        res.send({todos});
    }, (e) => {
        res.status(404).send(e);
    });
});
// DELETE TODO
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: 'ID not Valid',
            status: 404
        })
    }
    Todo.findByIdAndRemove(id).then((todos) => {
        if (!todos) {
            res.status(404).send({
                message: 'ID not Found',
                status: 404
            });
        }
        res.status(200).send({todos});
    }, (e) => {
        res.status(404).send(e);
    });
});
// UPDATE TODO
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: 'ID not Valid',
            status: 404
        })
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
});
// POST /users
app.post('/users', (req, res) => {
    var body= _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate,(req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
