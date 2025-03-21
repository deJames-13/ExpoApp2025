export function getParams() {
    const args = process.argv.slice(2);
    const params = {
        host: args[0] || 'localhost',
        port: args[1] || '5000',
        isSeed: false,
        isTunnel: false,
        ngrokOptions: {
            subdomain: null,
            domain: null,
            authtoken: null
        }
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
    if (args.includes('--tunnel') || args.includes('-t')) {
        params.isTunnel = true;
    }

    // Add ngrok custom domain/subdomain options
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--subdomain') {
            if (i + 1 < args.length) params.ngrokOptions.subdomain = args[i + 1];
        } else if (args[i] === '--domain') {
            if (i + 1 < args.length) params.ngrokOptions.domain = args[i + 1];
        } else if (args[i] === '--ngrok-token') {
            if (i + 1 < args.length) params.ngrokOptions.authtoken = args[i + 1];
        }
    }

    const validHostRegex = /^(localhost|127\.0\.0\.1|(\d{1,3}\.){3}\d{1,3}|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)$/;
    if (params.host && !validHostRegex.test(params.host)) {
        params.host = undefined
        console.error("Invalid host value.")
    };

    const validPortRegex = /^\d{1,5}$/;
    if (params.port && validPortRegex.test(params.port)) {
        const portNum = parseInt(params.port, 10);
        if (portNum < 0 || portNum > 65535) {
            params.port = undefined
            console.error("Invalid port value.")
        }
    } else if (params.port) {
        params.port = undefined
        console.error("Invalid port format")
    }

    return params;
}
