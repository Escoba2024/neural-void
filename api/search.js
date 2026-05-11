export default async function handler(req, res) {
    const { q, cat } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query is required" });
    }

    // HIER DEINEN SERPER API KEY EINFÜGEN:
    const API_KEY = "9a0e7ee3200d4d91a678cd39b09f4b1554c0376e"; 

    try {
        const type = cat === "images" ? "images" : "search";
        const targetUrl = `https://google.serper.dev/${type}`;

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            },
            // SafeSearch deaktivieren für unzensiertere Ergebnisse!
            body: JSON.stringify({ q: q, gl: "de", hl: "de", safe: "off" })
        });

        if (!response.ok) {
            console.error(`Serper API Error: ${response.status}`);
            return res.status(response.status).json({ error: "API_REJECTED" });
        }

        const data = await response.json();
        let formattedResults = [];

        if (cat === "images" && data.images) {
            formattedResults = data.images.map(img => ({
                img_src: img.imageUrl
            }));
        } else if (data.organic) {
            formattedResults = data.organic.map(item => ({
                title: item.title,
                url: item.link,
                content: item.snippet
            }));
        }

        return res.status(200).json({ results: formattedResults });

    } catch (error) {
        console.error("System Failure:", error);
        return res.status(500).json({ error: "CRITICAL_SYSTEM_FAILURE" });
    }
}
