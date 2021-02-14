import express from "express";
import { Pool, QueryResult } from "pg";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export const usersRouter = express.Router().use(express.json());

usersRouter.get("/api/users", async (req, res) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<User>;
  try {
    await client.query("BEGIN");
    response = await client.query(`select * from users order by created desc`);
    await client.query("COMMIT");
    return res.send(JSON.stringify(response.rows || []));
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    return res.status(500).send({
      message: "Something went wrong",
    });
  } finally {
    client.release();
  }
});

usersRouter.get("/api/users/:userId", async (req, res) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<User>;
  try {
    await client.query("BEGIN");
    response = await client.query(`select * from users where id = ${req.params.userId}`);
    await client.query("COMMIT");
    return res.send(JSON.stringify(response.rows[0] || []));
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    return res.status(500).send({
      message: "Something went wrong",
    });
  } finally {
    client.release();
  }
});

usersRouter.post("/api/users", async (req, res) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<User>;
  try {
    await client.query("BEGIN");
    response = await client.query(
      `insert into users (name, email) values ('${req.body.name}', '${req.body.email}') returning *`
    );
    await client.query("COMMIT");
    return res.send(JSON.stringify(response.rows[0]));
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    return res.status(500).send({
      message: "Something went wrong",
    });
  } finally {
    client.release();
  }
});

usersRouter.put("/api/users/:userId", async (req, res) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<User>;
  try {
    await client.query("BEGIN");
    response = await client.query(
      `update users set name = '${req.body.name}', email = '${req.body.email}' where id = ${req.params.userId} returning *`
    );
    await client.query("COMMIT");
    return res.send(JSON.stringify(response.rows[0]));
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    return res.status(500).send({
      message: "Something went wrong",
    });
  } finally {
    client.release();
  }
});
