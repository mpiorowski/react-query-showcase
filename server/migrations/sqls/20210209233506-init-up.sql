CREATE TABLE users (
  id serial,
  name varchar(255),
  email varchar(255),
  created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);