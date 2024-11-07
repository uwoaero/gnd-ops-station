import express from "express"
const router = express.Router();

//default use dummy data
let dataType = "test-telemetry"
const getDataType = () => { return dataType }

//sets dummy as data source
router.get("/test", (req, res) => {
  dataType = "test-telemetry"
  res.json({
    dataType: dataType,
  });
})

//sets flight controller as data source
router.get("/real", (req, res) => {
  dataType = "telemetry"
  res.json({
    dataType: dataType,
  });
})

export {router, getDataType};
