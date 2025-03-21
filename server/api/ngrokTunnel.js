import ngrok from 'ngrok';

export const startTunnel = async (host, port, options = {}) => {
    try {
        const tunnelConfig = {
            addr: port,
            authtoken: options.authtoken ?? process.env.NGROK_TOKEN,
            session_metadata: 'EyeZone Tunnel',
        };

        if (options.subdomain) {
            console.log(`Attempting to use reserved subdomain: ${options.subdomain}`);
            tunnelConfig.subdomain = options.subdomain;
            delete tunnelConfig.domain;
        }

        if (options.domain) {
            console.log(`Attempting to use custom domain: ${options.domain}`);
            tunnelConfig.hostname = options.domain;
            delete tunnelConfig.domain;
        }

        if (options.region && options.region !== 'us') {
            console.log(`Setting region to: ${options.region}`);
            tunnelConfig.region = options.region;
            delete tunnelConfig.server_addr;
        }

        // Use authtoken if provided
        if (options.authtoken || process.env.NGROK_TOKEN) {
            tunnelConfig.authtoken = options.authtoken || process.env.NGROK_TOKEN;
        }

        // Connect using the original ngrok package
        const url = await ngrok.connect(tunnelConfig);

        console.log(`Tunnel created! Your server is accessible at: ${url}`);

        if (options.subdomain || options.domain) {
            console.log('Note: Custom subdomains and domains require a paid ngrok account');
        }

        return url;
    } catch (err) {
        console.error('Error creating ngrok tunnel:', err);
        if (err.message && err.message.includes('subdomain')) {
            console.log('Note: Custom subdomains require a paid ngrok account or the subdomain may be in use');
        }
        return null;
    }
};

export const stopTunnel = async () => {
    try {
        await ngrok.disconnect();
        console.log('Ngrok tunnel closed successfully');
    } catch (err) {
        console.error('Error closing ngrok tunnel:', err);
    }
};
