CREATE TABLE counter (
  id serial,
  value numeric,
  created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);