
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.join(path.dirname(__filename), '..')

export const fileCleanup = async (testOutputDirName, fileNamePartial) => {
    try {
        // remove test output, wether in root or test output folder

        if (testOutputDirName && fs.existsSync(testOutputDirName)) {
            fs.rm(testOutputDirName, { recursive: true, force: true }, (err) => {
                if (err) throw err
            })
        }

        const files = await fs.promises.readdir(__dirname)
        await Promise.all(files.map(async file => {
            if (file.includes(fileNamePartial) && fs.existsSync(path.join(__dirname, file))) {
                await fs.unlink(path.join(__dirname, file), (err) => {
                    if (err) throw err
                })
            }
        }))

    } catch (err) {
        console.error('Error while teardown - ', err)
    }
}
