import express from "express";
const UserRoute = require("@routes/UserRoute");

module.exports = (app: ReturnType<typeof express>) => {
    UserRoute(app);
}
