import { connection } from "../database/db.js";

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customer = await connection.query(
      `SELECT * FROM customers WHERE customers.cpf LIKE '${cpf}%'`
    );
    if (customer.rows[0]) {
      return res.status(409).send("CPF já cadastrado");
    }

    const result = await connection.query(
      `INSERT INTO customers 
       (name, phone, cpf, birthday) 
      VALUES 
       ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function putCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;
  //UPDATE usuarios SET senha='010101', email='fulano3@gmail.com' WHERE id = 2;

  try {
    await connection.query(
      `UPDATE customers 
          SET
          name='${name}',
          phone='${phone}',
          cpf='${cpf}',
          birthday='${birthday}'
          WHERE
          id = ${id}
          `
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getCustomers(req, res) {
  try {
    const customers = await connection.query(`SELECT * FROM customers`);
    res.send(customers.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;
  try {
    const customers = await connection.query(
      `SELECT * FROM customers WHERE id = ${id}`
    );
    res.send(customers.rows[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
