import _ from 'lodash';
import mongoose from '../config/dbConfig';

import { createTestCase, deleteTestCase, listTestCases } from '../app/controllers/_testCases';
import Folder from '../app/models/folder';
import TestCase from '../app/models/testCase';
import { testCaseFixture } from './fixtures/_testcase';
import { foldersFixture } from './fixtures/_folders';
import { STATUS_BAD_INPUT, STATUS_CREATED, STATUS_NOT_FOUND, STATUS_OK } from '../config/constants';

beforeAll(async () => {
    await setupMockDatabase();
});

afterAll(async () => {
    await destroyMockDatabase();
    mongoose.connection.close();
});

describe('List Test Cases', () => {
    it('should throw an error if Folder ID is not provided', async () => {
        const testCases = await listTestCases();
        expect(testCases.status)
            .toBe(STATUS_BAD_INPUT);
        expect(testCases.message)
            .toEqual('Please provide a Folder ID');
    });

    it('should throw an error if there does not exist a folder with the provided Folder ID', async () => {
        const testCases = await listTestCases('50');
        expect(testCases.status)
            .toBe(STATUS_NOT_FOUND);
        expect(testCases.message)
            .toEqual('Folder ID - 50 does not exist');
    });

    it('should list the test cases in the given Folder ID', async () => {
        const testCases = await listTestCases('13');
        expect(testCases.status)
            .toBe(STATUS_OK);
        const testCaseIds = _.map(testCases.data, 'testCaseId');
        expect(testCaseIds)
            .toEqual(['JIRA-2701', 'JIRA-181', 'JIRA-191']);
    });
});

describe('Create Test Cases', () => {
    it('should throw an error if test case object is not provided as param', async () => {
        const result = await createTestCase();
        expect(result.status)
            .toBe(STATUS_BAD_INPUT);
        expect(result.message)
            .toEqual('Please provide a valid Test Case object');
    });

    it('should throw an error if the provided test case object does not have a folder id', async () => {
        const testCase = {
            'testCaseId' : 'JIRA-171x',
            'name'       : 'sample-test-case',
            'stepCount'  : 4,
            'folder'     : {
                'parentFolderId' : null,
                'name'           : 'Sample Folder 1'
            },
            'content'    : 'This is the test case content'
        };
        const result = await createTestCase(testCase);
        expect(result.status)
            .toBe(STATUS_BAD_INPUT);
        expect(result.message)
            .toEqual('Please provide a Folder ID with the Test Case');
    });

    it('should create a test case from the given params', async () => {
        const testCase = {
            'testCaseId' : 'JIRA-171x',
            'name'       : 'sample-test-case',
            'stepCount'  : 4,
            'folder'     : {
                'folderId'       : '13',
                'parentFolderId' : null,
                'name'           : 'Sample Folder 1'
            },
            'content'    : 'This is the test case content'
        };
        const result = await createTestCase(testCase);
        expect(result.status)
            .toBe(STATUS_CREATED);
        expect(result.data.testCaseId)
            .toEqual('JIRA-171x');
        expect(result.data.name)
            .toEqual('sample-test-case');
    });

    it('should create a new folder if there does not exist a folder id given in the test case params', async () => {
        const testCase = {
            'testCaseId' : 'JIRA-171xy',
            'name'       : 'sample-test-case',
            'stepCount'  : 4,
            'folder'     : {
                'folderId'       : '53',
                'parentFolderId' : null,
                'name'           : 'Sample Folder 1'
            },
            'content'    : 'This is the test case content'
        };
        const result = await createTestCase(testCase);
        expect(result.status)
            .toBe(STATUS_CREATED);
        expect(result.data.testCaseId)
            .toEqual('JIRA-171xy');
        expect(result.data.folderId)
            .toEqual('53');
    });
});

describe('Delete Test Cases', () => {
    it('should throw an error if test case id is not provide', async () => {
        const deletedTestCase = await deleteTestCase();
        expect(deletedTestCase.status)
            .toBe(STATUS_BAD_INPUT);
        expect(deletedTestCase.message)
            .toEqual('Please provide a Test Case ID');
    });

    it('should throw an error there does not exist a test case with the given test case id', async () => {
        const deletedTestCase = await deleteTestCase('JIRA-171xyzz');
        expect(deletedTestCase.status)
            .toBe(STATUS_NOT_FOUND);
        expect(deletedTestCase.message)
            .toEqual('TestCase ID - JIRA-171xyzz does not exist');
    });

    it('should delete the given test case', async () => {
        const deletedTestCase = await deleteTestCase('JIRA-271');
        expect(deletedTestCase.status)
            .toBe(STATUS_OK);
    });
});


const setupMockDatabase = async () => {
    console.log('Creating mock database');
    for ( const folder of foldersFixture ) {
        const mockedFolder = new Folder({
            folderId       : folder.folderId,
            parentFolderId : folder.parentFolderId,
            name           : folder.name
        });
        await mockedFolder.save();
    }
    for ( const testCase of testCaseFixture ) {
        const mockedTestCase = new TestCase({
            testCaseId : testCase.testCaseId,
            name       : testCase.name,
            stepCount  : testCase.stepCount,
            folderId   : testCase.folderId,
            content    : testCase.content
        });
        await mockedTestCase.save();
    }
};

const destroyMockDatabase = async () => {
    console.log('Destroying mock database');
    await Folder.remove();
    await TestCase.remove();
};
