import * as express from "express";
import cors = require('cors');
import helmet from 'helmet';

const cookieParser = require('cookie-parser');
const compression = require("compression");
const path = require('path');
const { specs, swaggerUi } = require('../swagger');

const { packageRouter , deliveryRouter} = require('./routes/v1');
//const  rateLimiter = require('./middleware/rateLimiter');

//import { errorHandler } from './middleware/errorHandler';
//import config from './config/config';
//import { xssMiddleware } from './middleware/xssMiddleware';
//import path from 'path';

const app = express();
//app.use(rateLimiter);
const publicDirectoryPath = path.join(__dirname,'/public');

app.use(express.static(publicDirectoryPath));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
//app.use(xssMiddleware());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/v1/', packageRouter);
app.use('/api/v1/', deliveryRouter);

//app.use(errorHandler);

export default app;
