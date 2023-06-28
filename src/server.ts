import 'express-async-errors'
import express from "express";
import { errorMiddleware } from "@middlewares/ErrorMiddleware";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname + '/views'));

require("@routes/index")(app);

app.use(errorMiddleware);

app.listen(port, () => console.log(`Application running on port ${port}.`));
