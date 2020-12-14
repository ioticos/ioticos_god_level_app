const fetch = require("node-fetch");


async function test(){
    console.log("-----------------------");

    const url = "https://api.github.com/users/ioticos";

    const response = await fetch(url);

    const json = await response.json();

    console.log(json.avatar_url);
    
    console.log("-----------------------");
}

test();
console.log("END")














function getName(username) {
  const url = "https://api.github.com/users/" + username;
  fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log(json.name + " --- " + json.avatar_url);
    });

  //const url = "https://api.github.com/users/ioticos";
  //fetch(url)
  //.then(response => response.json())
  //.then(json => {
  //    console.log(json.name + " --- " + json.avatar_url)
  //})
}


 /*  
 
 const url = "https://api.github.com/users/ioticos";
  
  const res = fetch(url);

  console.log(res);
  */
//getName("ioticos");
//getName("microsoft")
