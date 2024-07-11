import express from "express";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 5000;

const apiLimiter = rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100,
})

//Middlewares
app.use(express.json());
app.use(apiLimiter);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})