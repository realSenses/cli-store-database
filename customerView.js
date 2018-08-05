var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var clear = require('clear');
var clc = require('cli-color');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "storeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  displayItems();
});

var items = [];

var displayItems = function() {

  var gray = clc.xterm(8);
  var logo1 = clc.xterm(226);
  var logo2 = clc.xterm(27);
  console.log(gray("┌──────────────────────────────────────────────────┐"));
  console.log(gray("│  "+logo1(" ____       _         ")+logo2(" __  __            _   ")+"   │"));
  console.log(gray("│  "+logo1("|  _ \\ ___ | | _____  ")+logo2("|  \\/  | __ _ _ __| |_ ")+"   │"));
  console.log(gray("│  "+logo1("| |_) / _ \\| |/ / _ \\ ")+logo2("| |\\/| |/ _` | '__| __|")+"   │"));
  console.log(gray("│  "+logo1("|  __/ (_) |   <  __/ ")+logo2("| |  | | (_| | |  | |_ ")+"   │"));
  console.log(gray("│  "+logo1("|_|   \\___/|_|\\_\\___| ")+logo2("|_|  |_|\\__,_|_|   \\__|")+"   │"));


  // create table
  var table = new Table({
      head: ['ID', 'Item', 'Department', 'Price', 'QTY'], 
      colWidths: [4, 15, 15, 7, 5],
      // chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
      chars: { 'top-left': '├' , 'top-right': '┤'}
  });
   
  connection.query("SELECT * FROM products", function(err, res) {
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

    console.log(table.toString());
    //call;
    //resolve();
    customerPrompt();
  });

}


function color(department, text) {
  var msg;//  = clc.xterm(202).bgXterm(236);
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


function customerPrompt() {
  inquirer.prompt([{
    type: "list",
    name: "id",
    message: "What item would you like to buy?",
    choices: items,
  },{      
    type: "text",
    name: "qty",
    message: "Quantity?"
  }])
  .then(function(resp) {
    checkStock(resp.id, resp.qty);
  });
}

function checkStock(id, qty) {
  connection.query("SELECT * FROM products WHERE ?", {item_id: id}, function(err, res) {
    if (err) throw err;
      if(qty > res[0].stock_quantity){ // insufficient qty
        console.log("You want "+qty+" "+res[0].product_name+" when only "+res[0].stock_quantity+" are avaliable!");
      } else {

        updateStock(id, res[0].stock_quantity-qty);

        var receipt = new Table({
            head: ['Item', 'Price', 'QTY', 'Total'], 
            colWidths: [15, 7, 5, 7]
        });
        receipt.push([res[0].product_name, res[0].price, qty, res[0].price*qty]);
        console.log(receipt.toString());

      }

    //connection.end();
  });

}

function updateStock(id, newQty) {

    connection.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQty
      },{
        item_id: id
      }
    ],
    function(err, res) {
      // console.log("inventory updated!\n");
      console.log("Have a nice day!\n");   
  });

}

function displayCost(id, qty) {


}