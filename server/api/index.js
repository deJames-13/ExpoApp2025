import { RunSeeders } from '../seeders/main.js';
import { run } from '../server.js';

let HOST = process.argv[2] || 'localhost';
let PORT = process.argv[3] || 5000;
let isRunSeed = process.argv.includes('--seed');

run(HOST, PORT);
if (isRunSeed)
    RunSeeders();

