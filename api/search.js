export default async function handler(req, res) {
    const { q, cat } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query is required" });
    }

    const instances = [
        "https://paulgo.io/search",
        "https://searx.be/search",
        "https://searx.work/search",
        "https://search.ononoki.org/search",
        "https://priv.au/search"
    ];

    for (let instance of instances) {
        const targetUrl = `${instance}?q=${encodeURIComponent(q)}&categories=${cat}&format=json&safesearch=0&language=de-DE`;

        try {
            // Hier ist der Trick: Wir tarnen die Anfrage als echten Browser!
            const response = await fetch(targetUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "application/json",
                    "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Referer": "https://www.google.com/"
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return res.status(200).json(data);
            }
            console.log(`${instance} blocked the request with status: ${response.status}`);
        } catch (error) {
            console.log(`Connection to ${instance} failed.`);
        }
    }

    return res.status(500).json({ error: "ALL_NODES_OFFLINE" });
}
