
import { jest } from '@jest/globals'
import fs from 'fs'
import { fileCleanup } from '../_tools'
import * as utils from '../../src/exporter/node.js'
import common from '../../src/retrieval.js'


const testOutputDirName = 'tests_output'

const resultFixture = {
    "user": {
        "created": 946684800000,
        "id": "USERID",
        "karma": 100
    },
    "comment": [
        {
            "id": 111111,
            "by": "USERID",
            "text": "...",
            "time": 946684800000
        }
    ]
}

const render = async (options) => {
    const getExport = jest.spyOn(common, 'getExport')
    getExport.mockReturnValue(Promise.resolve(resultFixture))

    const result = await utils.generateExport(options, utils)
    getExport.mockRestore()

    return result
}

describe('node tests', () => {
    afterEach(() => fileCleanup(testOutputDirName, '_export_'))

    test('Should produce error on no username', async () => {
        const handleError = jest.fn(() => {})
        await utils.generateExport({}, { ...utils, handleError })
        expect(handleError).toHaveBeenCalled()

        handleError.mockRestore()
    })

    test('Should be able to set output folder, contains 2 files', async () => {
        await render({ username: 'a', outputPath: testOutputDirName })
        expect(fs.existsSync(testOutputDirName)).toBeTruthy()

        await fs.readdir(testOutputDirName, (err, files) => {
            expect(!err && files.length === 2).toBeTruthy()
        })
    })

    test('Should produce only a json in json mode', async () => {
        const result = await render({ username: 'a', mode: 'json' })
        expect(result.length === 1 && result[0].includes('json')).toBeTruthy()
    })

    test('Should produce only a html in html mode', async () => {
        const result = await render({ username: 'a', mode: 'html' })
        expect(result.length === 1 && result[0].includes('html')).toBeTruthy()
    })

    test('Should properly dissect param string', async () => {
        const paramsObj = utils.getParams(['padding', 'padding', 'username=asd', 'mode=json'])

        expect(paramsObj?.username === 'asd').toBeTruthy()
        expect(paramsObj?.mode === 'json').toBeTruthy()
    })
})
