const request = require("supertest");
const app = require("../../app");

const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";

describe("/todos/", () => {
    it("GET /todos/", async () => {
        const response = await request(app).get(endpointUrl);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
    });
    it("POST /todos/", async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo);

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
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
});