import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Command } from 'commander';
import { fork } from 'child_process';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();
program
    .option('-e, --env <environment>', 'Entorno de ejecución', "dev")
    .parse(process.argv);

const { env } = program.opts();
const envName = env;

const allowedEnvs = ['local', 'dev', 'prod', 'qa'];
if (!allowedEnvs.includes(envName)) {
    console.error(`Error: El entorno "${envName}" no es válido. Los entornos permitidos son: ${allowedEnvs.join(' | ')}`);
    process.exit(1);
}

const envFilePath = `.env.${envName}`;

if (!fs.existsSync(envFilePath)) {
    console.error(`Error: El archivo de configuración "${envFilePath}" no existe.`);
    process.exit(1);
}

dotenv.config({ path: envFilePath });

const app = express();
const rawPORT = process.env.PORT;
const PORT = rawPORT ? Number(rawPORT) : 3000;
const SECRETO = process.env.SECRET || "Secreto";


if (Number.isNaN(PORT)) {
    console.error(`Error: El valor de PORT en ${envFilePath} no es un número válido; "${rawPORT}"`);
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello by Node!!")
})

app.get('/secreto', (req, res) => {
    res.send(`Mi secreto es: "${SECRETO}"`)
})

/**
 * ruta que ejecuta un proceso hijo.
 * usa fork() crea otro proceso de node y ejecuta child.js
 */
app.get('/child', (req, res) => {
    const childPath = resolve(__dirname, './child.js')
    const child = fork(childPath);
    child.on('message', (msj) => {
        res.send(`Mensaje del proceso hijo: "${msj}"`)
    })
    child.on('error', (error) => {
        console.error(`Mensaje de error del proceso hijo: ${error}`);
        res.status(500).send("Error ejecutando el proceso hijo!")
    });
    child.on('exit', (code) => {
        console.log(childPath);
        console.log(`Proceso hijo termino con codigo ${code}`);
    });
})

app.listen(PORT, () => { console.log(`Servidor escuchando en http://localhost:${PORT}`) });

