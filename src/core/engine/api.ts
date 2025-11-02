import express from 'express';
import { register } from './metric';
import { getPrice, getPriceBySymbol } from './priceStore';

const app = express();
const PORT = process.env.PORT || 4000;

// metric endpoint
app.get('/metric', async(req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('health/live',(req, res) => res.status);
app.get('health/ready',(req, res) => {
    //pub sub logic that check rediness
    res.status(200).send('OK');
});

//public read interface
app.get('internal/price', (req, res) => {
    res.json(getPrice());
});

app.get('internal/price/:symbol',(req, res) => {
    const price = getPriceBySymbol(req.params.symbol.toUpperCase());
    if (price) {
        res.json(price)
    }else {
        res.status(404).json({erro: 'Symbol are not defined'});
    }
});

export function startApiServer(): void {
    app.listen(PORT,() => {
        console.log(`[Engine] API server listening on ${PORT}`);
    });
}
