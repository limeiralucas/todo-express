const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
    try {
        const createdModel = await TodoModel.create(req.body);
        res.status(201).json(createdModel);
    } catch (err) {
        next(err);
    }
};

exports.getTodos = async (req, res, next) => {
    try {
        const allTodos = await TodoModel.find({});
        res.status(200).json(allTodos);
    } catch (err) {
        res.status(500);
        next(err);
    }
};

exports.getTodoById = async (req, res, next) => {
    try {
        const todo = await TodoModel.findById(req.params.todoId);
        
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.updateTodo = async (req, res, next) => {
    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            req.params.todoId,
            req.body,
            { new: true, useFindAndModify: false }
        );

        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
        res.status(500).send();
    }
};

exports.deleteTodo = async (req, res, next) => {
    try {
        const removedTodo = await TodoModel.findByIdAndRemove(
            req.params.todoId,
            { useFindAndModify: false }
        );
        if (removedTodo) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
        res.status(500).send();
    }
};