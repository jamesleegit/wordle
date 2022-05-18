import express, { query } from 'express';
import fileUpload from 'express-fileupload';
import http from 'http';
import cors from 'cors';
import fs from 'fs-extra';
import sharp from 'sharp';
import axios from 'axios';
import https from 'https';
import path from 'path';
import puppeteer from 'puppeteer';

(async() => {
    const app = express();
    app.use(cors({
        origin: ['http://localhost:4200'],
        credentials: true
    }));
    app.get('/robots.txt', (req,res)=>res.status(200).end(`User-agent: *\r\nDisallow: /`));
    app.use('/', express.static('./public/www'));
    app.get('**', (req,res)=>res.status(200).end(fs.readFileSync('./public/www/index.html')));
    app.listen(8000);
})();

