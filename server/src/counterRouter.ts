import express from "express";
import { Pool, QueryResult } from "pg";

type Counter = {
  id: string;
  value: number;
  created: Date;
  updated: Date;
};

export const counterRouter = express.Router().use(express.json());

counterRouter.get("/api/counter", async (req, res) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Counter>;
  try {
    await client.query("BEGIN");
    response = await client.query(`select * from counter`);
    await client.query("COMMIT");
    if (!response.rows[0] || !response.rows[0].value) {
      return res.status(201).send();
    }
    return res.send(response.rows[0].value);
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

counterRouter.patch("/api/counter", async (req, res) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Counter>;
  try {
    await client.query("BEGIN");
    response = await client.query(`update counter set value = (value + ${req.body.value}) returning *`);
    await client.query("COMMIT");
    if (!response.rows[0] || !response.rows[0].value) {
      return res.status(201).send();
    }
    return res.send(response.rows[0] && response.rows[0].value);
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
