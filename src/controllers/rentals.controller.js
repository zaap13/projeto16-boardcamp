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

export async function returnRent(req, res) {
  const { id } = req.params;

  try {
    const rental = await connection.query(
      `SELECT * FROM rentals WHERE (rentals.id = '${id}')`
    );
    if (!rental.rows[0]) {
      return res.sendStatus(404);
    } else if (rental.rows[0].returnDate !== null) {
      return res.status(400).send("Aluguel já finalizado");
    }
    let returnDate = new Date();

    returnDate.setDate(
      rental.rows[0].rentDate.getDate() + rental.rows[0].daysRented
    );

    const date = new Date(Date.now());
    const late = returnDate.getDate() > date.getDate();

    if (late) {
      const delay = returnDate.getDate() - date.getDate();
      const delayFee =
        delay * (rental.rows[0].originalPrice / rental.rows[0].daysRented);
      await connection.query(
        `UPDATE rentals 
            SET
            "returnDate"='${dayjs(Date.now()).format("YYYY-MM-DD")}',
            "delayFee"='${delayFee}'
            WHERE
            id = ${id}
            `
      );
      return res.sendStatus(200);
    }
    await connection.query(
      `UPDATE rentals 
          SET
          "returnDate"='${dayjs(Date.now()).format("YYYY-MM-DD")}'
          WHERE
          id = ${id}
          `
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export async function deleteRent(req, res) {
  const { id } = req.params;

  try {
    const rental = await connection.query(
      `SELECT * FROM rentals WHERE (rentals.id = '${id}')`
    );
    if (!rental.rows[0]) {
      return res.sendStatus(404);
    } else if (rental.rows[0].returnDate === null) {
      return res.status(400).send("Aluguel ainda não finalizado");
    }

    await connection.query(`DELETE FROM rentals WHERE id = '${id}'`);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}
