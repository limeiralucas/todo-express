const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const TodoModel = require("../../model/todo.model");

const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
const invalidTodoId = "60da1581117306418c532c00";

let firstTodo;
let createdTodo;
let baseTodo;

describe("/todos/", () => {
    beforeAll(async () => {
        baseTodo = await TodoModel.create({title: "Test todo", done: false});
    });

    afterAll(async () => {
        mongoose.connection.close();
    });
    
    it("GET /todos/", async () => {
        const response = await request(app).get(endpointUrl);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();

        firstTodo = response.body[0];
    });

    it("GET /todos/:todoId", async () => {
        const response = await request(app).get(`${endpointUrl}/${firstTodo._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });

    it("GET /todos/:todoId doesn't exist", async () => {
        const response = await request(app).get(`${endpointUrl}/${invalidTodoId}`);

        expect(response.statusCode).toBe(404);
    });

    it("POST /todos/", async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo);

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        
        createdTodo = response.body;
    });

    it("should return error 500 on malformed date with POST /todos/", async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({title: "Missing done property"});

        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message: "Todo validation failed: done: Path `done` is required."
        });
    });

    it("PUT /todos/:todoId", async () => {
        const updatedTodo = {title: "Updated title", done: true};
        const response = await request(app)
            .put(`${endpointUrl}/${createdTodo._id}`)
            .send(updatedTodo);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(createdTodo._id);
        expect(response.body.title).toBe(updatedTodo.title);
        expect(response.body.done).toBe(updatedTodo.done);
    });

    it("PUT /todos/:todoId doesn't exist", async () => {
        const response = await request(app)
            .put(`${endpointUrl}/${invalidTodoId}`);

        expect(response.statusCode).toBe(404);
    });

    it("DELETE /todos/:todoId", async () => {
        const response = await request(app)
            .delete(`${endpointUrl}/${baseTodo._id}`);
        
        expect(response.statusCode).toBe(204);
    });

    it("DELETE /todos/:todoId doesn't exist", async () => {
        const response = await request(app)
            .delete(`${endpointUrl}/${invalidTodoId}`);
        
        expect(response.statusCode).toBe(404);
    });
});