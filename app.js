import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Command } from 'commander';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();
program
    .option('-e, --env <environment>', 'Entorno de ejecución')
    .parse(process.argv);

const options = program.opts();
const envName = options.env || 'dev';

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

if (Number.isNaN(PORT)) {
    console.error(`Error: El valor de PORT en ${envFilePath} no es un número válido; "${rawPORT}"`);
}

app.use(express.json());

app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

