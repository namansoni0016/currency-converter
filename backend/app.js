import express from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = process.env.EXCHANGE_RATE_API_KEY

const apiLimiter = rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100,
})

//Middlewares
app.use(express.json());
app.use(apiLimiter);

//Conversion
app.post('/api/convert', async(req, res) => {
    try {
        //get data
        const {from, to, amount}  = req.body;
        console.log({from, to, amount});
        const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`;
        const response = await axios.get(url);
        if(response.data && response.data.result === 'success'){
            res.json({
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                convertedAmount: response.data.conversion_result
            })
        } else {
            res.json({ message: "Error converting currency", details: response.data});
        }
    } catch (error) {
        res.json({ message: "Error converting currency", details: error.message});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})