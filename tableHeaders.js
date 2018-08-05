var clc = require('cli-color');

module.exports = function(title) { 

  var gray = clc.xterm(8);
  var logo1 = clc.xterm(226); // yellow
  var logo2 = clc.xterm(27); // blue
  console.log(gray("┌──────────────────────────────────────────────────┐"));

  if (title) {
    var spaces = (50-title.length)/2
    console.log(gray("│"+" ".repeat((Math.floor(spaces)))+logo2(title)+" ".repeat((Math.ceil(spaces)))+"|"));
  } else {
    console.log(gray("│  "+logo1(" ____       _         ")+logo2(" __  __            _   ")+"   │"));
    console.log(gray("│  "+logo1("|  _ \\ ___ | | _____  ")+logo2("|  \\/  | __ _ _ __| |_ ")+"   │"));
    console.log(gray("│  "+logo1("| |_) / _ \\| |/ / _ \\ ")+logo2("| |\\/| |/ _` | '__| __|")+"   │"));
    console.log(gray("│  "+logo1("|  __/ (_) |   <  __/ ")+logo2("| |  | | (_| | |  | |_ ")+"   │"));
    console.log(gray("│  "+logo1("|_|   \\___/|_|\\_\\___| ")+logo2("|_|  |_|\\__,_|_|   \\__|")+"   │"));
  }

};                                                                     


                                             