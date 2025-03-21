import { RunSeeders } from '../seeders/main.js';
import { run } from '../server.js';
import { getParams } from './getParams.js'

let params = getParams();
run(params.host, params.port);

// RUN ONCE
if (params.isSeed) {
    RunSeeders();
}

