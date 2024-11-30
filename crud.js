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

function CRUD(req, res) {
    const con = createDbConnection();
    con.connect(err => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Adatbázis hiba.");
            return;
        }

        const urlParts = req.url.split("/");
        const id = urlParts[2];

        if (req.method === "GET" && urlParts[1] === "crud") {
            con.query("SELECT * FROM alkoto", (err, results) => {
                if (err) throw err;
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
				con.end();
            });
        } else if (req.method === "POST" && urlParts[1] === "crud") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                const { nev } = qs.parse(body);
                con.query("INSERT INTO alkoto (nev) VALUES (?)", [nev], err => {
                    if (err) throw err;
                    res.writeHead(201);
                    res.end("Rekord létrehozva.");
					con.end();
                });
            });
        } else if (req.method === "PUT" && urlParts[1] === "crud" && id) {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                const { nev } = qs.parse(body);
                con.query("UPDATE alkoto SET nev = ? WHERE id = ?", [nev, id], err => {
                    if (err) throw err;
                    res.writeHead(200);
                    res.end("Rekord módosítva.");
					con.end();
                });
            });
        } else if (req.method === "DELETE" && urlParts[1] === "crud" && id) {
			con.query("DELETE FROM kapcsolat WHERE alkotoid = ?", [id], (err) => {
				if (err) {
					res.writeHead(500, { "Content-Type": "text/plain" });
					res.end("Hiba a kapcsolódó rekordok törlése során.");
				} else {
					con.query("DELETE FROM alkoto WHERE id = ?", [id], (err) => {
						if (err) {
							res.writeHead(500, { "Content-Type": "text/plain" });
							res.end("Hiba az alkotó törlése során.");
						} else {
							res.writeHead(200);
							res.end("Rekord törölve.");
						}
						con.end();
					});
				}
			});
		} else {
            res.writeHead(405, { "Content-Type": "text/plain" });
            res.end("Nem támogatott művelet.");
			con.end();
        }
    });
}

module.exports = { CRUD };
