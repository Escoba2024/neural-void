export default async function handler(req, res) {
    const { q, cat } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query is required" });
    }

    const activeInstance = "https://searx.be/search"; 
    const targetUrl = `${activeInstance}?q=${encodeURIComponent(q)}&categories=${cat}&format=json&safesearch=0&language=de-DE`;

    try {
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            throw new Error(`SearX API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Backend Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch from the Void." });
    }
}
