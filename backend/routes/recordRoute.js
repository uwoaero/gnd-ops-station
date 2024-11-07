import express from "express"
const router = express.Router();

//determines if recording data or not
let isRunning = false;

//flight tag
let tag = 0;
let id = 0;

const getIsRunning  = () => {return isRunning}
const getId  = () => {return id}
const getTag  = () => {return tag}

//start recording data
router.get('/start', (req, res) => {

  //if already recording
  if (isRunning) {
    return res.status(400).json({
      message: 'already running',
    });
  }

  //if not, start recording and create id and tag
  isRunning = true;
  tag = new Date(Date.now() - (5 * 60 * 60 * 1000));
  id = Math.floor(Math.random() * 10000000000000001)

  res.json({
    message: 'started',
  });
});

//stop recording data
router.get('/stop', (req, res) => {

  //if not recording
  if (!isRunning) {
    return res.status(400).json({
      message: 'not running',
    });
  }

  //if recording, stop
  isRunning = false;

  res.json({
    message: 'stopped',
  });
});

//returns if data is being recorded
router.get('/status', (req, res) => {
  res.json({
    isRunning: isRunning,
  });
});

export {router, getIsRunning, getId, getTag};
