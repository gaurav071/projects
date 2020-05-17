import _ from 'lodash';

import Folder from '../models/folder';
import TestCase from '../models/testCase';
import { STATUS_BAD_INPUT, STATUS_NOT_FOUND } from '../../config/constants';

import log4js from '../../config/logger';

const logger = log4js.getLogger('app');

export const listTestCasesService = async folderId => {
    logger.info(`[Service] - Fetching test cases for the Folder ID - ${folderId}`);
    const folder = await Folder.find({ folderId });
    if ( _.isEmpty(folder) ) {
        logger.info(`[Service] - Folder ID - ${folderId} does not exist`);
        return { status : STATUS_NOT_FOUND };
    }
    const testCases = await TestCase.find({ folderId });
    return testCases;
};

export const createTestCasesService = async (testCase, folderId) => {
    const { testCaseId, name, stepCount, folder, content } = testCase;
    try {
        logger.info(`[Service] - Creating a test case for the Folder ID - ${folderId}`);
        const testCase = new TestCase({
            testCaseId,
            name,
            stepCount,
            folderId : _.get(folder, 'folderId'),
            content
        });
        const newFolder = { ...folder };
        const folderExists = await Folder.find({ folderId : folderId });
        if ( _.isEmpty(folderExists) ) {
            const { parentFolderId, name } = newFolder;
            const folder = new Folder({
                folderId,
                parentFolderId,
                name
            });
            await folder.save();
        }
        const testCaseExists = await TestCase.find({ testCaseId });
        if ( !_.isEmpty(testCaseExists) ) return { status : STATUS_BAD_INPUT };
        const result = await testCase.save();
        return result;
    } catch ( err ) {
        logger.error(`[Service] - Error while creating test case for Folder ID - ${folderId}`, err);
    }
};

export const deleteTestCasesService = async testCaseId => {
    logger.info(`[Service] - Deleting test case - ${testCaseId}`);
    const testcase = await TestCase.find({ testCaseId : testCaseId });
    if ( _.isEmpty(testcase) ) {
        logger.info(`[Service] - TestCase ID - ${testCaseId} does not exist`);
        return { status : STATUS_NOT_FOUND };
    }
    const result = await TestCase.deleteOne({ testCaseId : testCaseId });
    return result;
};
