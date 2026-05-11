export default async function handler(req, res) {
    const { q, cat } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query is required" });
    }

    // Wir nutzen die offizielle, offene DuckDuckGo Instant Answer API
    const targetUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "NeuralVoid-Terminal/1.0"
            }
        });
        
        if (!response.ok) {
            throw new Error(`DDG API responded with ${response.status}`);
        }

        const data = await response.json();
        const results = [];
        
        // Die DDG API liefert die Ergebnisse oft im Array "RelatedTopics"
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            data.RelatedTopics.forEach(topic => {
                if (topic.FirstURL && topic.Text) {
                    results.push({
                        title: topic.Text.split(' - ')[0] || "Neural Link",
                        url: topic.FirstURL,
                        content: topic.Text
                    });
                }
            });
        }

        // Falls es einen Hauptartikel (Abstract) gibt
        if (data.AbstractText) {
            results.unshift({
                title: data.Heading || q,
                url: data.AbstractURL,
                content: data.AbstractText
            });
        }

        // Rückgabe an dein Frontend
        return res.status(200).json({ results: results });

    } catch (error) {
        console.error("Backend Fetch Error:", error);
        return res.status(500).json({ error: "CONNECTION_FAILED" });
    }
}
