
import fs from 'fs'

export const fileCleanup = (testOutputDirName, fileNamePartial) => {
    try {
        // remove test output, wether in root or test output folder

        if (testOutputDirName && fs.existsSync(testOutputDirName)) {
            fs.rm(testOutputDirName, { recursive: true, force: true }, (err) => {
                if (err) throw err
            })
        }

        fs.readdir('./', (err, files) => {
            if (err) throw err

            for (const file of files) {
                if (file.includes(fileNamePartial)) {
                    fs.unlink(file, err => {
                        if (err) throw err
                    })
                }
            }
        })
    } catch (err) {
        console.error('Error while teardown - ', err)
    }
}
