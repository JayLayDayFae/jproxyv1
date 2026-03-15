const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).send("No URL provided");

    try {
        // 1. Fetch a fresh list from your ProxyScrape link
        const proxyRes = await fetch('https://api.proxyscrape.com/v4/free-proxy-list/get?protocol=http&timeout=5000&country=all&request=displayproxies&proxy_format=ipport&format=text');
        const proxyText = await proxyRes.text();
        const proxies = proxyText.split('\n').filter(p => p.trim());

        // 2. Pick a random proxy from the list
        const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
        const agent = new HttpsProxyAgent(`http://${randomProxy}`);

        // 3. Attempt to fetch the target site
        const response = await fetch(url, { agent, timeout: 5000 });
        const body = await response.text();

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(body);
    } catch (err) {
        res.status(500).json({ error: "Proxy connection failed. Try refreshing!", details: err.message });
    }
}
