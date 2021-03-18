-- Init schema
CREATE SCHEMA mydb;

-- Create tables
-- Customers
CREATE TABLE mydb.customers(
  id SERIAL NOT NULL PRIMARY KEY,
  firstname VARCHAR (1024) NOT NULL,
  lastname VARCHAR (1024) NOT NULL,
  company VARCHAR (1024),
  email VARCHAR (1024) NOT NULL
);

-- Invoices
CREATE TYPE mydb.invoice_status AS ENUM
  ('created', 'complete', 'failed');
CREATE TABLE mydb.invoices(
  id SERIAL NOT NULL PRIMARY KEY,
  invoice_data JSON NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status mydb.invoice_status DEFAULT 'created'
);
