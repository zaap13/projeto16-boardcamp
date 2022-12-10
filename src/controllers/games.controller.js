import { connection } from "../database/db.js";

export async function postGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  try {
    const result = await connection.query(
      `INSERT INTO games 
      (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES 
      ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getGames(req, res) {
  const name = req.query.name;

  console.log(name);

  try {
    if (!name) {
      const games = await connection.query(
        `SELECT games.name, games.image, categories.name AS "categoryName", games."pricePerDay" FROM games JOIN categories ON games."categoryId"=categories.id`
      );
      res.send(games.rows);
    } else {
      const games = await connection.query(
        `SELECT games.name, games.image, categories.name AS "categoryName", games."pricePerDay" FROM games JOIN categories ON games."categoryId"=categories.id WHERE LOWER(games.name) LIKE LOWER('${name}%')`
      );
      console.log(games.rows);
      res.send(games.rows);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getGame(req, res) {
  try {
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
