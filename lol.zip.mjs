import { appendFile, copyFileSync, readFileSync } from "fs";
import * as http from "http";

const SPACE = 32;
const NEWLINE = 10;

let stats_total = 0;
let stats_currentlySending = 0;

/** @type {Uint8Array} */
let start = null;
/** @type {Uint8Array[]} */
let chunks = [];
let last = 0;

const buffer = new Uint8Array(readFileSync("./lines.txt"));
for (let i = 0; i < buffer.length; i++) {
  if (buffer[i] === NEWLINE) {
    if (start === null) {
      start = buffer.subarray(last, i + 1);
    } else {
      chunks.push(buffer.subarray(last, i + 1));
    }
    buffer[i] = SPACE;
    last = i + 1;
  }
}
const length = chunks.length;

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  let val;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    val = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = val;
  }
  return array;
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const userAgent = req.headers["user-agent"];

    // if known search engine, return a 404
    // if discord, return a 404
    if (
      userAgent.includes("Googlebot") ||
      userAgent.includes("bingbot") ||
      userAgent.includes("Discordbot")
    ) {
      res.writeHead(404);
      res.end();
      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-Length": "77700420420420420",
      "Content-Disposition": "attachment; filename=lol.zip",
      Server: "by Dave Caruso <paperdave.net>",
      "X-Source-Code": "https://github.com/paperdave/lol.zip",
      "X-Discord": "https://discord.gg/4AbvSXV",
    });
    stats_currentlySending++;
    stats_total++;
    // to check how popular / load this server is. im logging when requests happen.
    var date = new Date();
    appendFile(
      `log/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`,
      `${date.getHours()}:${date.getMinutes()}\n`,
      () => {}
    );
    res.write(start);
    var i = 0;
    var array = chunks.slice();
    shuffle(array);
    const int = setInterval(() => {
      if (i >= length) {
        shuffle(array);
        i = 0;
      }
      res.write(array[i]);
      i++;
    }, 100);
    const timer = setTimeout(() => {
      clearInterval(int);
      res.write(
        "\n\ndamn, you got to the end. congrats. you win nothing. this site closes the connection after 24 hours, since i think the joke wears off at that point."
      );
      res.end();
    }, 86400000);
    res.on("close", () => {
      clearInterval(int);
      clearTimeout(timer);
      stats_currentlySending--;
    });
  } else if (req.url === "/stats") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.write(
      JSON.stringify({
        total: stats_total,
        currentlySending: stats_currentlySending,
      })
    );
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);
console.log("Listening on http://localhost:3000");
