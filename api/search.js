export default async function handler(req, res) {
    const { q, cat } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query is required" });
    }

    // Eine Liste verschiedener Instanzen. Wenn eine blockt, wird die nächste probiert.
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
            const response = await fetch(targetUrl);
            
            // Wenn die Instanz erfolgreich antwortet (Status 200)
            if (response.ok) {
                const data = await response.json();
                return res.status(200).json(data); // Daten ans Frontend senden und abbrechen
            }
            console.log(`${instance} responded with ${response.status}. Trying next...`);
        } catch (error) {
            console.log(`Connection to ${instance} failed. Trying next...`);
        }
    }

    // Wenn ALLE Instanzen in der Liste fehlgeschlagen sind
    return res.status(500).json({ error: "ALL_NODES_OFFLINE" });
}
