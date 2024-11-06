import express from "express"
const router = express.Router();

//default use dummy data
let dataType = "dummy"

//sets dummy as data source
router.get("/dummy", (req, res) => {
  dataType = "dummy"
  res.json({
    dataType: dataType,
  });
})

//sets flight controller as data source
router.get("/real", (req, res) => {
  dataType = "real"
  res.json({
    dataType: dataType,
  });
})

export {router, dataType};
