import ngrok from 'ngrok';

export const startTunnel = async (host, port, options = {}) => {
    try {
        const tunnelConfig = {
            addr: port,
            authtoken: options.authtoken ?? process.env.NGROK_TOKEN,
        };

        // Check for NGROK_DOMAIN environment variable first
        if (process.env.NGROK_DOMAIN) {
            console.log(`Using domain from environment: ${process.env.NGROK_DOMAIN}`);
            tunnelConfig.hostname = process.env.NGROK_DOMAIN;
        } else if (options.subdomain) {
            console.log(`Attempting to use reserved subdomain: ${options.subdomain}`);
            tunnelConfig.subdomain = options.subdomain;
        } else if (options.domain) {
            console.log(`Attempting to use custom domain: ${options.domain}`);
            tunnelConfig.hostname = options.domain;
        }

        if (options.region && options.region !== 'us') {
            console.log(`Setting region to: ${options.region}`);
            tunnelConfig.region = options.region;
        }

        // Use authtoken if provided
        if (options.authtoken || process.env.NGROK_AUTHTOKEN) {
            tunnelConfig.authtoken = options.authtoken || process.env.NGROK_TOKEN;
        }

        // Connect using the original ngrok package
        const url = await ngrok.connect(tunnelConfig);

        console.log(`Tunnel created! Your server is accessible at: ${url}`);

        if ((options.subdomain || options.domain || process.env.NGROK_DOMAIN) &&
            !tunnelConfig.authtoken) {
            console.log('Note: Custom domains require a paid ngrok account and an authtoken');
        }

        return url;
    } catch (err) {
        console.error('Error creating ngrok tunnel:', err);
        if (err.message && err.message.includes('domain')) {
            console.log('Note: Custom domains require a paid ngrok account or the domain may be in use');
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
