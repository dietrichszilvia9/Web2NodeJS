const mysql = require("mysql");
const qs = require("querystring");

function createDbConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "studb011",
        password: "Almafa123",
        database: "db011"
    });
}

function handleForm(req, res) {
    if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const formData = qs.parse(body);

            const con = createDbConnection();
            con.connect(err => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Hiba az adatbázis-kapcsolat létrehozása során.");
                    return;
                }

                const sql = "INSERT INTO uzenetek (nev, email, targy, uzenet) VALUES (?, ?, ?, ?)";
                const params = [formData.nev, formData.email, formData.targy, formData.uzenet];

                con.query(sql, params, (err, result) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Hiba az adatok adatbázisba mentése során.");
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                        res.end("<h1>Üzenet sikeresen elküldve!</h1>");
                    }
                    con.end();
                });
            });
        });
    } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Nem támogatott HTTP metódus.");
    }
}

module.exports = { handleForm };
