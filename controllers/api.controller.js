const endpoints = require("../endpoints.json");

exports.getAllApi = (req, res) => {
  res.send(endpoints);
};

// exports.getApi = (req, res) => {
//   fs.readFile("./endpoints.json", "utf8", (err, apisString) => {
//     if (err) console.log(err);
//     else {
//       const parsedApis = JSON.parse(apisString);
//       res.status(200).send({ apis: parsedApis });
//     }
//   });
// };
