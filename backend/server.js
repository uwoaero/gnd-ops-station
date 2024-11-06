import express from "express"
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>SEVERRRRRRRRRRRr</h1>');
});

const port = 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import databaseRoutes from "./routes/databaseRoute.js"
app.use("/database", databaseRoutes)

import { router as recordRoutes, consume } from "./routes/recordRoute.js"
app.use("/record", recordRoutes)


import { router as sourceRoutes, dataType } from "./routes/sourceRoute.js"
app.use("/source", sourceRoutes)

consume().catch(console.error);

