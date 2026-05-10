const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.static('./front_end'));
app.use(express.json());



app.post('/api/answer', (req, res) => {
    const answer = req.body;
    answer.datum = new Date().toLocaleString();
    
    console.log(answer);

    fs.readFile('svar.json', 'utf8', (err, data) => {
        let jsonLista = [];

        if (!err && data) {
            // Om filen redan har innehåll, gör om texten till en lista
            jsonLista = JSON.parse(data);
        }

        // 2. Lägg till det nya svaret i listan
        jsonLista.push(answer);

        // 3. Spara ner hela listan till filen igen
        fs.writeFile('svar.json', JSON.stringify(jsonLista, null, 2), (err) => {
            if (err) {
                console.log("Ett fel uppstod vid sparande:", err);
                res.send("Något gick fel!");
            } else {
                console.log("Svar sparat i svar.json!");
                res.send("Tack för ditt svar! Jag har tagit emot det.");
            }
        });
    });
    
});

app.get('/api/getAnswer', (req, res) => {
    function lasAllaSvar() {
        try {
            // 1. Kolla om filen överhuvudtaget existerar
            if (!fs.existsSync('svar.json')) {
                console.log("Filen hittades inte, returnerar tom lista.");
                return [];
            }

            // 2. Läs filens innehåll (som text)
            const filInnehall = fs.readFileSync('svar.json', 'utf8');

            // 3. Om filen är helt tom, returnera en tom lista
            if (!filInnehall) return [];

            // 4. Gör om texten till ett riktigt JavaScript-objekt/lista
            const svarLista = JSON.parse(filInnehall);
            return svarLista;

        } catch (error) {
            console.error("Kunde inte läsa eller tolka svar.json:", error);
            return [];
        }
    }

    res.send(lasAllaSvar())
});

app.get('/radera-alla-svar', (req, res) => {
    const tomLista = [];

    // Vi skriver över filen med en tom array []
    fs.writeFile('svar.json', JSON.stringify(tomLista), (err) => {
        if (err) {
            console.error("Kunde inte tömma filen:", err);
            return res.status(500).send("Ett fel uppstod när jag försökte tömma svaren.");
        }

        console.log("Svar.json har tömts!");
        return res.send("Alla svar har raderats permanent.");
    });
});

app.listen(PORT, () => {
    console.log(`port ${PORT}`);
});