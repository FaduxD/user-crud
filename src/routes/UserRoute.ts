import express from "express";
import { UserController } from "@controllers/UserController";

const userController = new UserController();

module.exports = (app: ReturnType<typeof express>) => {
    app.get("/", userController.render);
    app.get("/usuarios", userController.render);
    app.get("/user/:id", userController.getById);
    app.get("/users", userController.getAll);
    app.post("/user", userController.create);
    app.put("/user/:id", userController.update);
    app.delete("/user/:id", userController.remove);
}
