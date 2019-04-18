//Required packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// The connection to the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the showProducts function after the connection is made to show the user available products.
    showProducts();
});

//Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function showProducts() {
    console.log("\n====================\nWelcome to Bamazon!\n====================\n" + "\nList of available products: \n");
    // query the database for all products available
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push("Item ID: " + results[i].item_id + " Item Name: " + results[i].product_name + " Price: " + results[i].price)
        };

        console.log(choiceArray);

    });

};

//The app should then prompt users with two messages
function buyProduct() {
    inquirer
        //The first should ask them the ID of the product they would like to buy.
        .prompt([
            {
                type: "input",
                name: "buyThisID",
                message: "Please provide the ID of the item you would like to purchase."
            }
        ])
        .then(function (answer) {
            console.log(answer.buyThisID);
        });
};
buyProduct();