const express = require("express");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");
const {config} = require('./config') 
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

client.setConfig({
  apiKey : config.apiKey,
  server:config.server,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var emailId = req.body.emailId;
  console.log("input leliya");
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: emailId,
  };

  // const listid = 'bf41b6f6d4'
  const run = async () => {
    const response = await client.lists.batchListMembers(
      "bf41b6f6d4",
      {
        members: [
          {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName,
            },
          },
        ],
      }
    );

    console.log("success");
    
  }
  run().then(()=>{
    res.sendFile(__dirname + "/success.html");
  }).catch((err)=>{
    res.sendFile(__dirname + "/failure.html");
    console.log("Not added to subscribe list")
    console.log(err.response.body.title);
  })
});


app.post("/failure", (req,res)=>{
    res.redirect('/')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//api key
//9c99cc8aa480e3627c0b3398ca707689-us21
