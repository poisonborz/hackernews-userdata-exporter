﻿
import fs from 'fs'
import path from 'path'

const __dirname = process.env.PWD

export const fileCleanup = (testOutputDirName, fileNamePartial) => {
    try {
        // remove test output, wether in root or test output folder

        if (testOutputDirName && fs.existsSync(testOutputDirName)) {
            fs.rm(testOutputDirName, { recursive: true, force: true }, (err) => {
                if (err) throw err
            })
        }

        fs.readdir(path.join(__dirname), (err, files) => {
            if (err) throw err

            for (const file of files) {
                if (file.includes(fileNamePartial) && fs.existsSync(file)) {
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
