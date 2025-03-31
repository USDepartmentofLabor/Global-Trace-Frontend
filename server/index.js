import { Server } from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './app';

dotenv.config();

const PORT = process.env.SSR_PORT || 3001;
const build = 'public';
const staticFiles = [
  '/*.png',
  '/*.jpg',
  '/*.jpeg',
  '/*.svg',
  '/*.ttf',
  '/*.css',
  '/*.js',
];

export default {
  run: () => {
    const app = express();
    const server = new Server(app);

    app.use(compression({ threshold: 0 }));

    staticFiles.forEach((file) => {
      app.get(file, (req, res) => {
        const filePath = path.resolve(`${build}/${req.url}`);
        if (['/*.css', '/*.js'].indexOf(file) !== -1) {
          res.set('Content-Encoding', 'gzip');
        }
        res.sendFile(filePath);
      });
    });

    const htmlContent = fs.readFileSync(
      path.join(__dirname, '..', `${build}/index.html`),
    );

    app.use(express.static(path.join(__dirname, '..', build)));

    app.get('*', (req, res) => {
      const renderer = createRenderer();
      createApp({ url: req.url })
        .then((app) => {
          renderer.renderToString(app, (err, html) => {
            res.writeHead(200);
            res.write(htmlContent.toString());
            res.end();
          });
        })
        .catch((error) => {
          /* eslint-disable-next-line */
          console.log('Create app error', error);
        });
    });

    server.listen(PORT, () => {
      /* eslint-disable-next-line */
      console.log(`Server listening at PORT: ${server.address().port}`);
    });
  },
};
