var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var clc = require('cli-color');
var clear = require('clear');
var header = require('./tableHeaders.js');

var items = [];

var tableOptions = {
  head: ['ID', 'Item', 'Department', 'Price', 'QTY'], 
  colWidths: [4, 15, 15, 7, 5],
  chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '', 'top-left': '├' , 'top-right': '┤'}
}

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "storeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  viewProducts();

});

function managerPrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "Manager Options:",
      choices: [
        "View All Products",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Remove Product"
      ],
      name: "choice",
    }
  ]).then(function(res) {
    switch(res.choice) {
      case "View All Products":
        viewProducts();
        break;
      case "View Low Inventory":
        lowInventory();
        break;
      case "Add to Inventory":
        addInventory();
        break;
      case "Add New Product":
        newProduct();
        break;
      case "Remove Product":
        removeProduct();
        break;
      default:
        console.log("Option Not Defined");
    }
  });
} 


function viewProducts(){
  displayItems();
}

function lowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity < 5;", function(err, res) {
    console.log(generateTable(res, 'Low Inventory').table);
    managerPrompt();
  });
}


function addInventory(){   
  connection.query("SELECT * FROM products", function(err, res) {
    console.log(generateTable(res, 'Add Inventory').table);
    addInventoryPrompt();
  });
}  

function addInventoryPrompt() {
  inquirer.prompt([{
    type: "list",
    name: "id",
    message: "What item would you like to add stock to?",
    choices: items,
  },{      
    type: "text",
    name: "qty",
    message: "Quantity?"
  }])
  .then(function(resp) {
    console.log(resp.id + " " + resp.qty);
    var query = connection.query(
      "UPDATE products SET stock_quantity = (stock_quantity + ?) WHERE item_id = ?", [resp.qty, resp.id],
      function(err, res) {
        if(err) console.log(err);
        console.log(res.affectedRows + " product updated!\n");
        displayItems();
      }
    );
  });
}


function removeProduct(){

  inquirer.prompt([
      {
      type: "list",
      message: "Pick an item to remove:",
      name: "item",
      choices: items
    }
  ]).then(function(res) {

    connection.query(
      "DELETE FROM products WHERE ?",
      {
        item_id: res.item
      },
      function(err, res) {
        console.log(res.affectedRows + " products deleted!\n");
        displayItems();
      }
    );
  });
}

function newProduct(){
  inquirer.prompt([
    {
      type: "text",
      message: "Product name:",
      name: "name"
    },
    {
      type: "list",
      message: "Department:",
      choices: [
        "Pokeballs",
        "Potions",
        "Items",
        "Medicine",
        "Repellents"
      ],
      name: "dept",
    },
    {
      type: "text",
      message: "Price:",
      name: "price"
    },
    {
      type: "text",
      message: "Quantity:",
      name: "qty"
    }
  ]).then(function(res) {
    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('"+res.name+"', '"+res.dept+"', '"+res.price+"', '"+res.qty+"')", function(err, res) {
      displayItems();
    }); 
  });
}


function color(department, text) {
  var msg;
  switch(department) {
    case 'Pokeballs':
      msg = clc.xterm(32);
      break;
    case 'Potions':
      msg = clc.xterm(133);
      break;
    case 'Items':
      msg = clc.xterm(40);
      break; 
    case 'Medicine':
      msg = clc.xterm(220);
      break;  
    case 'Repellents':
      msg = clc.xterm(196);
      break;         
    default:
      msg = clc.xterm(231);
  }
  return msg(text);

}

var displayItems = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log(generateTable(res, "Inventory").table);
    managerPrompt();
  });
}


function generateTable(res, title) {
  // empty items array
  items = [];
  clear();
  header(title);

  var table = new Table(tableOptions);

  for (var i = 0; i < res.length; i++) {

    var item_id = res[i].item_id;
    var product = res[i].product_name;
    var department = res[i].department_name;
    var price = res[i].price; 
    var qty = res[i].stock_quantity;

    table.push([item_id, color(department, product), color(department, department), price, qty]);

    storeItem = {
      "name":color(department, product),
      "value":item_id
    }
    items.push(storeItem);
  }

  temp = {
    "table": table.toString(),
    "items": items
  }

  return temp;

}