export function getParams() {
    const args = process.argv.slice(2);
    const params = {
        host: args[0] || 'localhost',
        port: args[1] || '5000',
        isSeed: false
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--host' || args[i] === '-H') {
            if (i + 1 < args.length) params.host = args[i + 1];
        } else if (args[i] === '--port' || args[i] === '-p') {
            if (i + 1 < args.length) params.port = args[i + 1];
        }
    }
    if (args.includes('--seed') || args.includes('-s')) {
        params.isSeed = true;
    }


    const validHostRegex = /^(localhost|127\.0\.0\.1|(\d{1,3}\.){3}\d{1,3}|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)$/;
    if (params.host && !validHostRegex.test(params.host)) throw (new Error("Invalid host"));


    const validPortRegex = /^\d{1,5}$/;
    if (params.port && validPortRegex.test(params.port)) {
        const portNum = parseInt(params.port, 10);
        if (portNum < 0 || portNum > 65535) {
            throw (new Error("Invalid port value"));
        }
    } else if (params.port) {
        throw (new Error("Invalid port format"));
    }

    return params;
}
