const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

jest.mock("../../model/todo.model");

let todoId = "60da1452103a0d40ac5e3120";

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("TodoController.getTodos", () => {
    it("should have a getTodos function", () => {
        expect(typeof TodoController.getTodos).toBe("function");
    });
    it("should call TodoModel.find({})", async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    });
    it("should return response with status 200 and all todos", async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos)
    });

    it("should handle errors in getTodos", async () => {
        const errorMessage = { message: "An error has ocurred" }
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("TodoController.createTodo", () => {
    beforeEach(() => {
        req.body = newTodo;
    })
    it("should have a createTodo function", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });

    it("should call TodoModel.create", async () => {
        await TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });
    it("should return 201 response code", async () => {
        await TodoController.createTodo(req, res, next);

        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return json body in response", async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);

        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should handle errors in createTodo", async () => {
        const errorMessage = { message: "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);

        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("TodoController.getTodoById", () => {
    it("should have a getTodoById function", () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    });

    it("should call TodoModel.findById with path parameter", async () => {
        req.params.todoId = todoId;
        await TodoController.getTodoById(req, res, next);

        expect(TodoModel.findById).toBeCalledWith(todoId);
    });

    it("should return response with status 200 and the requested todo", async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle errors in getTodoById", async () => {
        const errorMessage = { message: "Error finding todo" };
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findById.mockReturnValue(rejectedPromise);
        await TodoController.getTodoById(req, res, next);

        expect(next).toBeCalledWith(errorMessage);
    });

    it("should return status code 404 when item doesn't exists", async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("TodoController.updateTodo", () => {
    it("should have a updateTodo function", () => {
        expect(typeof TodoController.updateTodo).toBe("function");
    });

    it("should update with TodoModel.findByIdAndUpdate", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next);

        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
            todoId,
            newTodo, 
            { new: true, useFindAndModify: false }
        );
    });

    it("should return a response with the json data and status code 200", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should handle errors in updateTodo", async () => {
        const errorMessage = { message: "Error updating todo"};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await TodoController.updateTodo(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res._isEndCalled()).toBeTruthy();
        expect(next).toBeCalledWith(errorMessage);
    });

    it("should return 404 when item doesn't exist", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);

        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(404);
    });
});

describe("TodoController.deleteTodo", () => {
    it("should have deleteTodo function", () => {
        expect(typeof TodoController.deleteTodo).toBe("function");
    });

    it("should call TodoModel.findByIdAndRemove with todoId and parameters", async () => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next);

        expect(TodoModel.findByIdAndRemove).toBeCalledWith(
            todoId, 
            { useFindAndModify: false }
        );
    });

    it("should return response with status 204", async () => {
        TodoModel.findByIdAndRemove.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);

        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(204);
    });

    it("should handle errors", async () => {
        const errorMessage = { message: "Error on delete Todo" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndRemove.mockReturnValue(rejectedPromise);

        await TodoController.deleteTodo(req, res, next);

        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(500);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it("should return response status 404 when todo doesn't exist", async () => {
        TodoModel.findByIdAndRemove.mockReturnValue(null);

        await TodoController.deleteTodo(req, res, next);

        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(404);
    });
});