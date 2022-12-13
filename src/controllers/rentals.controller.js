import dayjs from "dayjs";
import { connection } from "../database/db.js";

export async function postRent(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const customer = await connection.query(
      `SELECT * FROM customers WHERE customers.id = '${customerId}'`
    );
    if (!customer.rows[0]) {
      return res.status(400).send("Usuário não encontrado");
    }

    const game = await connection.query(
      `SELECT * FROM games WHERE games.id = '${gameId}'`
    );
    if (!game.rows[0]) {
      return res.status(400).send("Jogo não encontrado");
    }

    const gameRentals = await connection.query(
      `SELECT * FROM rentals WHERE (rentals."gameId" = '${gameId}' AND rentals."returnDate" is null)`
    );

    if (gameRentals.rows.length >= game.rows[0].stockTotal) {
      return res.status(400).send("Não temos este jogo em estoque no momento");
    }

    const rentDate = dayjs(Date.now()).format("YYYY-MM-DD");

    const returnDate = null;
    const delayFee = null;

    const pricePerDay = game.rows[0].pricePerDay;
    const originalPrice = pricePerDay * daysRented;

    const result = await connection.query(
      `INSERT INTO rentals 
       ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
      VALUES 
       ($1, $2, $3, $4, $5, $6, $7)`,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

  console.log(customerId, gameId);

  try {
    if (customerId) {
      const rentals = await connection.query(
        `SELECT rentals.*, 
        JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, 
        JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
        FROM
        rentals
        JOIN
        customers
        ON
        rentals."customerId"=customers.id
        JOIN
        games
        ON
        rentals."gameId" = games.id
        JOIN
        categories
        ON
        games."categoryId" = categories.id
        WHERE customers.id = '${customerId}'
        ORDER BY rentals.id

     `
      );
      return res.send(rentals.rows);
    } else if (gameId) {
      const rentals = await connection.query(
        `SELECT rentals.*, 
        JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, 
        JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
        FROM
        rentals
        JOIN
        customers
        ON
        rentals."customerId"=customers.id
        JOIN
        games
        ON
        rentals."gameId" = games.id
        JOIN
        categories
        ON
        games."categoryId" = categories.id
        WHERE
        games.id='${gameId}' 
        ORDER BY rentals.id

     `
      );
      return res.send(rentals.rows);
    }

    const rentals = await connection.query(
      `SELECT rentals.*, 
      JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, 
      JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
      FROM
      rentals
      JOIN
      customers
      ON
      rentals."customerId"=customers.id
      JOIN
      games
      ON
      rentals."gameId" = games.id
      JOIN
      categories
      ON
      games."categoryId" = categories.id
      ORDER BY rentals.id 
   `
    );
    res.send(rentals.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
