const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todos');
const { User } = require('./../server/models/user');

 Todo.remove({}).then((result) => {
    console.log(result);
 });

 //Todo.findOneAndRemove();

 //Todo.findByIdAndRemove();

// Todo.findOneAndRemove({ _id: '5b5212ec33a40cd5d52a3ed2'}).then((todo) => {

// });

 Todo.findByIdAndRemove('5b5212ec33a40cd5d52a3ed2').then((todo) => {
    console.log(todo);
});
