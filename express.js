const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const express = function () {
  const server = http.createServer();

  //static function

  express.static = function (filePath) {
    return function (req, res) {
      if (typeof filePath === "string") {
        console.log(filePath, "filepath");

        if (
          !req.url.includes(
            filePath.split("\\")[filePath.split("\\").length - 1]
          )
        ) {
          res.end(req.url.split("/")[1]);
          req.url = req.url.replace(
            req.url.split("/")[1],
            filePath.split("\\")[filePath.split("\\").length - 1]
          );
        }
        const parsedUrl = url.parse(req.url);
        // extract URL path
        let pathname = `.${parsedUrl.pathname}`;
        // based on the URL path, extract the file extension. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // maps file extension to MIME type
        const map = {
          ".ico": "image/x-icon",
          ".html": "text/html",
          ".js": "text/javascript",
          ".json": "application/json",
          ".css": "text/css",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".wav": "audio/wav",
          ".mp3": "audio/mpeg",
          ".svg": "image/svg+xml",
          ".pdf": "application/pdf",
          ".doc": "application/msword",
        };

        fs.exists(pathname, function (exist) {
          if (!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
          }

          // if is a directory search for index file matching the extension
          if (fs.statSync(pathname).isDirectory()) pathname += "/index" + ext;

          // read file from file system
          fs.readFile(pathname, function (err, data) {
            if (err) {
              res.statusCode = 500;
              res.end(`Error getting the file: ${err}.`);
            } else {
              // if the file is found, set Content-type and send data
              res.setHeader("Content-type", map[ext] || "text/plain");
              res.end(data);
              console.log(data, "data");
            }
          });
        });
      }
    };
  };

  return {
    // listener function
    listen: function (PORT, listenCallback) {
      if (server) {
        server.listen(PORT, listenCallback);
      }
    },

    // get function
    get: function (path, getCallback) {
      server.on("request", (request, response) => {
        if (path === request.url) getCallback(request, response);
      });
    },

    //use function
    use: function (path, useCallback) {
      server.on("request", (request, response) => {
        const url = request.url;
        const re = new RegExp(`${path}`, "g");
        if (url.match(re)) {
          useCallback(request, response);
        }
      });
    },
  };
};

module.exports = express;

// app.listen
// app.get
//app.use
