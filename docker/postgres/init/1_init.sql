-- Init schema
CREATE SCHEMA mydb;

CREATE TABLE mydb.customers(
   id SERIAL NOT NULL PRIMARY KEY,
   firstname VARCHAR (1024) NOT NULL,
   lastname VARCHAR (1024) NOT NULL,
   company VARCHAR (1024),
   email VARCHAR (1024) NOT NULL
);

CREATE TABLE mydb.invoices(
   ID SERIAL NOT NULL PRIMARY KEY
);
