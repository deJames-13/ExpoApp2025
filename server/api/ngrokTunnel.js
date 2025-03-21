import ngrok from 'ngrok';

export const startTunnel = async (port, options = {}) => {
    try {
        const tunnelConfig = {
            addr: port,
            region: options.region || 'us',
        };

        // Add permanent URL configuration if provided
        if (options.subdomain) {
            console.log(`Attempting to use reserved subdomain: ${options.subdomain}`);
            tunnelConfig.subdomain = options.subdomain;
        }

        if (options.domain) {
            console.log(`Attempting to use custom domain: ${options.domain}`);
            tunnelConfig.domain = options.domain;
        }

        if (options.authtoken) {
            tunnelConfig.authtoken = options.authtoken;
        }

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
        await ngrok.kill();
        console.log('Ngrok tunnel closed successfully');
    } catch (err) {
        console.error('Error closing ngrok tunnel:', err);
    }
};
