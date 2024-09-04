import express from "express";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use("/api/v1/auth", authRoutes);

app.listen(5001, ()=>{
    console.log('Server started at http://localhost:5001');
})