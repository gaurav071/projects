import express from 'express';
import jwt from 'jsonwebtoken';

import { appendToken, initMiddlewares, verifyToken } from '../middlewares/_middlewares';
import { createTestCase, deleteTestCase, listTestCases } from '../app/controllers/_testCases';

const router = express();
initMiddlewares(router);

// API Routes

router.get('/folders/:folder_id/test-cases', async (req, res) => {
    const { folder_id } = req.params;
    const testCases = await listTestCases(folder_id);
    res.json({
        result : testCases
    });
});

router.post('/test-cases', [appendToken, verifyToken], async (req, res) => {
    const { testcase } = req.body;
    const result = await createTestCase(testcase);
    res.json({
        result
    });
});

router.delete('/test-cases/:testcaseId', [appendToken, verifyToken], async (req, res) => {
    const { testcaseId } = req.params;
    const testCase = await deleteTestCase(testcaseId);
    res.json({
        result : testCase
    });
});

router.post('/login', (req, res) => {
    // Dummy user. Later we can fetch a real user from a user microservice
    const user = {
        id   : '12345',
        name : 'gaurav'
    };
    jwt.sign({ user }, 'secret-key', (err, token) => {  // using a dummy secret key. Not setting up token expiration duration for now
        res.json({
            token
        });
    });
});

router.use((req, res) => {
    res.sendStatus(404);
});


export default router;


