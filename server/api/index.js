import { RunSeeders } from '../seeders/main.js';
import { run } from '../server.js';
import { getParams } from './getParams.js';
import { startTunnel, stopTunnel } from './ngrokTunnel.js';

let params = getParams();
run(params.host, params.port);

if (params.isTunnel) {
    console.log('Starting ngrok tunnel...');
    startTunnel(params.host, params.port, params.ngrokOptions);

    process.on('SIGINT', async () => {
        console.log('Closing ngrok tunnel and shutting down server...');
        await stopTunnel();
        process.exit(0);
    });
}

// RUN ONCE
if (params.isSeed) {
    RunSeeders();
}

