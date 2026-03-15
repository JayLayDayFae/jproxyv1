const fetch = require('node-fetch');
const HttpProxyAgent = require('https-proxy-agent');

export default async function handler(req, res) {
    const { url } = req.query;
    
    // Using your specific IP: 43.246.227.57
    const proxyUrl = 'http://43.246.227.57:8080'; 
    const agent = new HttpProxyAgent(proxyUrl);

    try {
        const response = await fetch(url, { agent });
        const body = await response.text();
        
        // Add headers so your browser doesn't block the result
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(body);
    } catch (err) {
        res.status(500).json({ error: "Proxy connection failed." });
    }
}
