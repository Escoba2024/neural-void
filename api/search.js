export default async function handler(req, res) {
    const { q, cat } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query is required" });
    }

    // HIER KOMMT DEIN EIGENER API SCHLÜSSEL REIN:
    const API_KEY = "DEIN_BRAVE_API_KEY"; 

    try {
        let targetUrl = "";
        let formattedResults = [];

        // Wir rufen je nach Tab die richtige API auf
        if (cat === "images") {
            targetUrl = `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(q)}`;
        } else {
            targetUrl = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}`;
        }

        const response = await fetch(targetUrl, {
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip",
                "X-Subscription-Token": API_KEY // Dein digitaler Ausweis!
            }
        });

        if (!response.ok) {
            console.error(`Brave API Error: ${response.status}`);
            return res.status(response.status).json({ error: "BRAVE_API_REJECTED" });
        }

        const data = await response.json();

        // Daten so formatieren, wie dein Frontend sie erwartet
        if (cat === "images") {
            if (data.results) {
                formattedResults = data.results.map(img => ({
                    img_src: img.properties.url
                }));
            }
        } else {
            if (data.web && data.web.results) {
                formattedResults = data.web.results.map(item => ({
                    title: item.title,
                    url: item.url,
                    content: item.description
                }));
            }
        }

        return res.status(200).json({ results: formattedResults });

    } catch (error) {
        console.error("System Failure:", error);
        return res.status(500).json({ error: "CRITICAL_SYSTEM_FAILURE" });
    }
}
