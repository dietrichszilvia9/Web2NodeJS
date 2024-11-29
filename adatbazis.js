var http = require("http"),
    url = require("url"),
    mysql = require("mysql");

function doTable(callback) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "studb011",
        password: "Almafa123",
        database: "db011"
     });
    
    con.connect(function(err) {
        if (err) throw err;
        con.query("select m.cim,ifnull(m.eredeti,'-') as eredeti,m.szinhaz,m.ev,a.nev from mu m join kapcsolat k on m.id=k.muid join alkoto a on a.id=k.alkotoid order by m.cim desc;", function (err, result, fields) {
          if (err) throw err;
          var columns = [];
          for(var x in fields)
            columns.push(fields[x].name);
          getHtmlText(columns, result, callback);
        });
    });
}

function getHtmlText(columns, rows, callback) {
    var text = "<table style='text-align: center;'>";
    text += "<tr>";
    for(var i=0; i<columns.length; i++)
        text += "<th>"+columns[i]+"</th>";
    text += "</tr>";
    for(i=0; i<rows.length; i++) {
        text += "<tr>";
        for(var j in rows[i]) {
            text += "<td>"+rows[i][j]+"</td>";
        }
        text += "</tr>";
    }
    text += "</table>";
    callback(text);     
}

module.exports = { doTable };