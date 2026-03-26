import express from 'express';
import dotenv from 'dotenv';
import { generateFakerUser as fkuser } from './services/use.service.js';

dotenv.config();

const app = express();
const rawPORT = process.env.PORT;
const PORT = rawPORT ? Number(rawPORT) : 3000;

if (Number.isNaN(PORT)) {
    console.error(`Error: El valor de PORT en el archivo .env no es un número válido; "${rawPORT}"`);
}

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Servidor funcionando correctamente",
        pid: process.pid,
    })
})

app.get(`/users`, (req, res) => {
    try{
        const count = Number(process.env.USER_COUNT || 5);
        const users = fkuser(count);
        res.status(200).json({
            message: "usuarios generados con faker",
            users: users,
        })
    }catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
})


app.listen(PORT, () => { console.log(`Servidor escuchando en http://localhost:${PORT}`) });

