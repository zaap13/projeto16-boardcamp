import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categories.routes.js";
import gamesRouter from "./routes/games.routes.js";
import customersRouter from "./routes/customers.routes.js";
import rentalsRouter from "./routes/rentals.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running in port: ${port}`);
});
