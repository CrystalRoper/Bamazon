-- File containing the code that was entered into mySQL Workbench to create the database.

-- Check for existing database with same name and drop if it exists
DROP DATABASE IF EXISTS bamazon;
-- If one does not exist, create it.
CREATE database bamazon;

USE bamazon;

-- Product table schema
CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10, 2) default 0,
    stock_quantity INT default 0,
    PRIMARY KEY(item_id)
);

-- Adding one item this way to demonstrate how to add items via code; however,
-- will upload an excel sheet of the remaining items via mySQL Workbench.
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stand Mixer", "Kitchen", 99.99, 15);
