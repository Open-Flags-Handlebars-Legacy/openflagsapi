var fs = require("fs");
var express = require("express");
var app = express();
var PORT = process.env.port || 4443;
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
const { v4: uuidv4 } = require("uuid");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
// mongo-----------------------------------------------------------------------------------------------------
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();
const donus = process.env.MONGO_THING;
const mongoDB = donus;
var NewFlag = new Schema({
  link: String,
  // region:String
});
var NewFAQ = new Schema({
  person: String,
  message: String,
  type: String,
  vote: Number,
});
// var FlagModel = mongoose.model("NewPost", NewFlag);
var FAQsModel = mongoose.model("NewFAQPost", NewFAQ);

// mongo-----------------------------------------------------------------------------------------------------

// routes--------------------------------------------------------------------------------------------------
var home = require("./routes/home");
const { all } = require("./routes/home");
app.use(express.static(__dirname + "./public/"));
app.use("/docs", express.static("public"));
// coooooooooooooooooorrrrrrrrrrrrrrrrrrrrrrrrrssssssssssssssssssssssssssssss

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// coooooooooooooooooorrrrrrrrrrrrrrrrrrrrrrrrrssssssssssssssssssssssssssssss





app.get("/docs", (request, response) => {
  response.render(`docs`);
});
app.get("/faqs", (request, response) => {
  const ipp =
    request.header("x-forwarded-for") || request.connection.remoteAddress;
  const ip = ipp.slice(7);
  console.log("ip1:" + ip);
  const faqs = () => {
    MongoClient.connect(
      mongoDB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("Flags");
        var mysort = { vote: -1 };
        dbo
          .collection("faqs")
          .find({})
          .sort(mysort)
          .toArray(function (err, result) {
            if (err) throw err;
            const results = result.map((fakews) => {
              return fakews;
            });
            const faq = results;
            console.log(faq);
            db.close();
            response.render(`faqs`, {
              faq: faq,
            });
          });
      }
    );
  };
  faqs();
});

let allFlags;
let flagInfoArr;
let links = [];

const getAll = () => {
  MongoClient.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("Flags");
      var mysort = { region: 1 };
      dbo
        .collection("flag")
        .find({})
        .sort(mysort)
        .toArray(function (err, result) {
          if (err) throw err;
          // for (let i = 0; i < result.length; i++) {
          //   const all = result[i];
          // console.log("\x1b[35m", element.name);
          // var getAl = all.name
          // console.log(getAl)
          const results = result.map((wall) => {
            return wall;
          });
          allFlags = results;
          // for (let i = 0; i < flagInfo.length; i++) {
          //   const element = JSON.stringify(flagInfo[i].comment);
          //   console.log(element)
          // }

          // }
          for (let i = 0; i < 300; i++) {
          let dinus = Math.floor(Math.random() * allFlags.length);
          // console.log(dinus)
          let link = allFlags[dinus].directLink;
          // console.log(randoLink)
          links.push(link);
       
      };
          db.close();
        });
        console.log('flags loaded')
    }
  );
};
getAll();
// console.log(allFlags)
app.get("/", (request, response) => {
  const ipp =
    request.header("x-forwarded-for") || request.connection.remoteAddress;
  const ip = ipp.slice(7);
  console.log("ip1:" + ip);
  response.render(`home`, {
    flagInfo: allFlags,
  });
});

app.get("/all", (request, response) => {
  const ipp =
    request.header("x-forwarded-for") || request.connection.remoteAddress;
    // console.log(allFlags)
  const ip = ipp.slice(7);
  console.log("ip1:" + ip);
  response.json({allFlags});
});
// const gertAll = async () => {

  
          
//     }
  // );
// };

const fillRando = ()=> {
  for (let i = 0; i < 300; i++) {
  let dinus = Math.floor(Math.random() * allFlags.length);
  // console.log(dinus)
  let link = allFlags[dinus].directLink;
  // console.log(randoLink)
  links.push(link);
};}

const buildCache = () => {
  if (links.length < 200) {
    links.pop();
    console.log("low on rando");
    fillRando()
  }
};
app.get("/rando", (request, response) => {
  topRando = links.pop();
  // console.log(links)
  buildCache();
  response.json(topRando);
  // console.log(ok)
});

app.post("/newfaq", (request, response) => {
  // console.log(request.body)
  const person = request.body.person;
  const type = request.body.type;
  const message = request.body.message;
  const vote = 0;
  const mongoModle = new FAQsModel({
    person: person,
    message: message,
    type: type,
    vote: vote,
  });

  MongoClient.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("Flags");
      dbo.collection("faqs").insertOne(mongoModle, function (err, res) {
        if (err) throw err;
        console.log("\x1b[36m", "faq posted");
        db.close();
      });
    }
  );
  setTimeout(() => {
    response.redirect(`/faqs`);
  }, 100);
});

// app.post('/rename', (request,response)=> {
//   MongoClient.connect(
//     mongoDB,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     function (err, db) {
//       if (err) throw err;
//       var dbo = db.db("Flags");
//       // var myobj = mongoModle;
//       dbo.collection("flag").updateMany({}, {$rename:{'ISO3166-2':'ISO3166'}})
//     }
//     )
//     console.log('changed')
//     response.send('all done')
// })

// let countryPosting = 'russia'
// let postCountryCode = 'RU-'

// app.post("/postflags", (request, response) => {
//   var regionName = [];

//   var arrayOfFiles = fs.readdirSync(`./public/${countryPosting}/region`);
//   // var regionName =JSON.stringify(arrayOfFiles)
//   const thing = arrayOfFiles.map((links) => {
//     let region = links.slice(0, -4);
//     let country = countryPosting;
//     let ISO3166 = postCountryCode;

//     let directLink =
//       "https://openflags.net/" + country + "/region/" + region + ".svg";
//     const quickLink = region + ".svg";
//     // const ID = uuidv4()
//     return { directLink, quickLink, region, country, ISO3166 };
//   });

//   console.log(thing)
//   MongoClient.connect(
//     mongoDB,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     function (err, db) {
//       if (err) throw err;
//       var dbo = db.db("Flags");
//       // var myobj = mongoModle;
//       dbo.collection("flag").insertMany(thing, function (err, res) {
//         if (err) throw err;
//         console.log("\x1b[36m", "flags posted!");
//         db.close();
//       });
//     }
//   );
//   setTimeout(() => {
//     response.redirect(`/`);
//   }, 300);
// });

// routes--------------------------------------------------------------------------------------------------

//get route for country and region
app.get("/api/json/flagInfo/:country/:region?", function (request, response) {
  let keyParam = request.params.region;
  let flagInfo = allFlags.find((record) => record.region === keyParam);
  response.json({ flagInfo });
});


//get route for region code search
app.get("/api/json/ISO3166/:regionCode?", (request, response) => {
  let regionCode = request.params.regionCode;
  console.log(regionCode)
  // console.log(allFlags)
 const ISO = allFlags.filter((record) => record.ISO3166 === regionCode)

 console.log(ISO)
  response.json({ flagInfo:ISO });
})

//route to list flags availible regions in country

app.get("/api/list/country/:country", function (request, response) {
  let country = request.params.country;
  console.log(country)
  // console.log(allFlags)
 const countryList = allFlags.filter((record) => record.country === country)

 console.log(countryList)
  response.json({ flagInfo:countryList });
});



// dns call to server
require("dns").lookup(require("os").hostname(), function (err, add, fam) {
  console.log("addr: " + add);
});
//   express app listen and console log on post started
app.listen(PORT);
console.log("server started on " + PORT);
