
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { fileCleanup } from './_tools'
import * as utils from '../src/exporter/node.js'
import { getFileName } from '../src/retrieval.js'

// abandoned low content account
const usernameFixture = 'binarykeats'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('hacker news specific tests', () => {
    afterAll(() => fileCleanup(null, '_export_'))

    test('Should properly retrieve actual account data',  async () => {
        const result = await utils.generateExport({ username: usernameFixture }, utils)

        expect(result.length).toBe(2)

        // json should contain data in proper format
        expect(result[0]).toContain('.json')
        const jfile = fs.readFileSync(result[0], { encoding: 'utf8' })
        expect(JSON.parse(jfile).user.id).toBe(usernameFixture)

        // html should contain data in proper format
        expect(result[1]).toContain('.html')
        const hfile = fs.readFileSync(result[1], { encoding: 'utf8' })
        expect(hfile).toContain('<td>' + usernameFixture)
    })


    test('Filename should contain passed user id, current date',  () => {
        const result = getFileName({ user: { id: 'bob' } })

        expect(
            result.includes('bob') &&
            result.includes(String((new Date()).getFullYear()))
        ).toBeTruthy();
    })
})

