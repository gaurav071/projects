import _ from 'lodash';

import { createTestCasesService, deleteTestCasesService, listTestCasesService } from '../services/_testCases';
import { apiResponse } from '../../lib/apiResponse';
import { STATUS_BAD_INPUT, STATUS_CREATED, STATUS_ERROR, STATUS_NOT_FOUND, STATUS_OK } from '../../config/constants';
import log4js from '../../config/logger';

const logger = log4js.getLogger('app');


export const listTestCases = async folderId => {
    if ( !folderId ) return apiResponse(STATUS_BAD_INPUT, [], 'Please provide a Folder ID');
    try {
        logger.info(`[Controller] - Listing the test cases for the Folder ID - ${folderId}`);
        const testCases = await listTestCasesService(folderId);
        if ( testCases.status === STATUS_NOT_FOUND ) return apiResponse(STATUS_NOT_FOUND, [], `Folder ID - ${folderId} does not exist`);
        return apiResponse(STATUS_OK, testCases);
    } catch ( err ) {
        logger.error('Error in listTestCases ', err.message);
        return apiResponse(STATUS_ERROR, [], err.message);
    }
};

export const createTestCase = async testcase => {
    try {
        if ( !testcase ) return apiResponse(STATUS_BAD_INPUT, [], 'Please provide a valid Test Case object');
        const { folderId } = _.get(testcase, 'folder');
        if ( !folderId ) return apiResponse(STATUS_BAD_INPUT, [], 'Please provide a Folder ID with the Test Case');
        logger.info(`[Controller] - Creating test case for the Folder ID - ${folderId}`);
        const testCase = await createTestCasesService(testcase, folderId);
        if ( testCase.status === STATUS_BAD_INPUT ) return apiResponse(STATUS_BAD_INPUT, [], `TestCase already exists`);
        return apiResponse(STATUS_CREATED, testCase);
    } catch ( err ) {
        logger.error('Error in createTestCases ', err.message);
        return apiResponse(STATUS_ERROR, [], err.message);
    }
};

export const deleteTestCase = async testCaseId => {
    try {
        if ( !testCaseId ) return apiResponse(STATUS_BAD_INPUT, [], 'Please provide a Test Case ID');
        logger.info(`Deleting test cases - ${testCaseId}`);
        const testCase = await deleteTestCasesService(testCaseId);
        if ( testCase.status === STATUS_NOT_FOUND ) return apiResponse(STATUS_NOT_FOUND, [], `TestCase ID - ${testCaseId} does not exist`);
        return apiResponse(STATUS_OK, testCase);
    } catch ( err ) {
        logger.error('Error in deleteTestCases ', err.message);
        return apiResponse(STATUS_ERROR, [], err.message);
    }
};

