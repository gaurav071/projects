import jwt from 'jsonwebtoken';

const bodyParser = require('body-parser');

export const initMiddlewares = app => {
    app.use(bodyParser.urlencoded({ extended : false }));
    app.use(bodyParser.json());
};


export const appendToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    if ( !token ) {
        res.sendStatus(401);
    }
    req.token = token;
    next();
};

export const verifyToken = (req, res, next) => {
    return jwt.verify(req.token, 'secret-key', (err, authData) => {
        if ( err ) return res.sendStatus(401);
        next();
    });
};
