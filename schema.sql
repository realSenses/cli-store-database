DROP DATABASE IF EXISTS storeDB;

CREATE database storeDB;

USE storeDB;

CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30),
  price INTEGER(10),
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

SELECT * FROM products;
