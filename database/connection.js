const { sleep } = require("./helper");
const database = require('.');
const md5 = require("md5");

// Import models
const Paciente = require('../models/paciente');
const Atendimento = require('../models/atendimento');
const Prontuario = require('../models/prontuario');
const Usuario = require("../models/usuario");
const dummyData = require("./dummydata");
const keys = require("./keys");
const env = require("./env");

// Constants
const RETRY_CONNECTION_TIMER = 10 * 1e3;
const MAX_CONNECTION_RETRY_COUNT = 100;

let isConnected = false;

async function isDatabaseConnected() {
    try {
        await database.authenticate();
        isConnected = true;
    }
    catch {
        isConnected = false;
    }
    return isConnected;
}

async function createRootUser() {
    console.log(env.ROOT_USERNAME);
    const userInDatabase = await Usuario.findOne({
        where: {
            username: env.ROOT_USERNAME,
        }
    });

    if (Boolean(userInDatabase)) return;

    const rootUser = await Usuario.create({
        username: env.ROOT_USERNAME,
        password: md5(env.ROOT_PASSWORD),
    });
}

async function createDummyEntry(_paciente, _prontuario, _atendimento) {
    const paciente = await Paciente.create({
        idade: _paciente.idade,
        genero: _paciente.genero,
        multiplicidade: _paciente.multiplicidade
    });

    const prontuario = await Prontuario.create({
        paciente_id: paciente.id,
        sintomas: _prontuario.sintomas,
        veioAObito: _prontuario.veioAObito,
        transferencia: _prontuario.transferencia,
        gravidade: _prontuario.gravidade,
        vacinadoCovid: _prontuario.vacinadoCovid,
        possuiComorbidades: _prontuario.possuiComorbidades
    });

    const atendimento = Atendimento.create({
        horaEntrada: _atendimento.horaEntrada.replace("T", " "),
        horaSaida: _atendimento.horaSaida.replace("T", " "),
        paciente_id: paciente.id,
        prontuario_id: prontuario.id
    });
}

async function createDummyData() {
    dummyData.forEach(async (registro, index) => {
        console.log(`[DB] Creating dummy entry ${index + 1}/${dummyData.length}`);
        await createDummyEntry(registro.paciente, registro.prontuario, registro.atendimento);
    });
}

// Connection to database
async function trySyncDatabase() {
    try {
        // const resultado = await database.sync({ force: keys.isDebug });
        const resultado = await database.sync();
        console.log("[DB] Database synchronized!");
        console.log(resultado.models);
    } catch (err) {
        console.log(err);
    }
}

async function tryDatabaseConnection() {
    for (retryNumber = 0; retryNumber < MAX_CONNECTION_RETRY_COUNT; retryNumber++) {
        try {
            await database.authenticate();
            console.log("[DB] Connected to database!");
            await trySyncDatabase();
            isConnected = true;
            await createRootUser();

            // if (keys.isDebug) {
            //     console.log("[DB] Creating dummy data");
            //     await createDummyData();
            //     console.log("[DB] Finished creating dummy data");
            // }

            break;
        } catch (err) {
            if(process.env.NODE_ENV !== 'test') {
                console.log(`[DB] Retrying connection to database: ${retryNumber}/${MAX_CONNECTION_RETRY_COUNT}`);
                console.log(err.parent);
                await sleep(RETRY_CONNECTION_TIMER);
            }
        }
    }
}

module.exports = { isDatabaseConnected, tryDatabaseConnection, createDummyData };