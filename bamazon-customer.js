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

// Connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // Display welcome message then start the interaction with the user.
    console.log("\n====================\nWelcome to Bamazon!\n====================\n");
    start();
});

function start() {
    inquirer
        .prompt({
            name: "showProducts",
            type: "list",
            message: "Would you like to see a list of available items?",
            choices: ["YES", "NO"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.showProducts === "YES") {
                showProducts();
            }
            else if (answer.showProducts === "NO") {
                console.log("\n=====================================\nThank You for Shopping with Bamazon!\n=====================================\n")
                connection.end();
            }
        });
}

//Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function showProducts() {
    // query the database for all products available
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push("Item ID: " + results[i].item_id + " Item Name: " + results[i].product_name + " Price: " + results[i].price)
        };

        console.log(choiceArray);
        buyProduct();
    });

};

//The app should then prompt users with two messages
function buyProduct() {
    inquirer
        .prompt([
            //The first should ask them the ID of the product they would like to buy.
            {
                type: "input",
                name: "buyThisID",
                message: "Please provide the ID of the item you would like to purchase."
            },
            //The second message should ask how many units of the product they would like to buy.
            {
                type: "input",
                name: "buyThisQuantity",
                message: "How many would you like to purchase?"
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE item_id = ?", [answer.buyThisID], function (err, results) {
                var itemQuant = results[0].stock_quantity;
                var itemPrice = results[0].price;
                if (err) throw err;
                //Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
                else if (answer.buyThisQuantity > itemQuant) {
                    console.log("Insufficient quantity!");
                    connection.end();
                }
                //If your store does have enough of the product, you should fulfill the customer's order.
                else if (answer.buyThisQuantity <= itemQuant && itemQuant != 0) {
                    //This means updating the SQL database to reflect the remaining quantity.
                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [itemQuant - answer.buyThisQuantity, answer.buyThisID], function (err, results) {
                       //Once the update goes through, show the customer the total cost of their purchase.
                        console.log("\n==========================================\nThank you for your purchase with Bamazon!\n==========================================\n");
                        console.log("Your total today is: $" + [answer.buyThisQuantity * itemPrice]);
                    })
                    connection.end();
                }
                else {
                    console.log("\n==============================================================================================\nBamazon is currently experiencing some technical difficulties. Please try your order again. Thank you!\n==============================================================================================\n");
                    connection.end();
                }
            });
            // console.log(answer.buyThisID);
            // console.log(answer.buyThisQuantity);
        });
};
