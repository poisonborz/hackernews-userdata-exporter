
import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'
import dot from 'dot'
import * as readline from 'readline'
import common from '../retrieval.js'
import templateContent from '../template.js'

const updateConsole = (text, ending) => {
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(text)

    if (ending) {
        process.stdout.write('\n')
    }
}

export const updateStatus = (text, percent, success) => {
    if (percent) {
        const percentValue = Math.round(percent * 10) / 1.1
        updateConsole(`[${'■'.repeat(percentValue)}${'-'.repeat(10 - percentValue)}] ${text}`)
        if (percent === 1) {
            updateStatus(text, null, true)
        }
    } else {
        updateConsole(`[   ${success !== undefined ? success ? ' √ ' : ' x ' : '...'}   ] ${text}`, success !== undefined)
    }
}

export const fetchItem = async (url) => {
    return fetch(url + '.json').then(res => res.json())
}

export const handleError = (message) => {
    updateStatus(message, null,false)
    process.exit(1)
}

export const getParams = (argv) => {
    const args = argv.slice(2)
    let params = {}

    args.forEach(a => {
        const nameValue = a.split('=')
        params[nameValue[0]] = nameValue[1]
    })

    return params
}

export const generateExport = async (options, utils) => {

    if (options.outputPath && !fs.existsSync(!options.outputPath)) {
        try {
            fs.mkdirSync(options.outputPath, { recursive: true })
        } catch (e) {
            utils.handleError(`Error creating output path "${options.outputPath}": ${e}`)
        }
    }

    const filePath = result => path.join(options.outputPath || '.', common.getFileName(result))

    return common.getExport(utils, options)
        .then(async result => {

            console.info('----------------------------------------------------')

            const createdFiles = []

            if (!options.mode || options.mode === 'json') {
                const file = filePath(result) + '.json'
                createdFiles.push(new Promise((resolve) => {
                    fs.writeFile(file, JSON.stringify(result, null, 4), () => {
                        console.info('Exported json file successfully created: ' + file)
                        resolve(file)
                    })
                }))
            }

            if (!options.mode || options.mode === 'html') {
                const file = filePath(result) + '.html'
                const template = dot.template(templateContent)

                createdFiles.push(new Promise((resolve) => {
                    fs.writeFile(file, template(result), () => {
                        console.info('Exported html file successfully created: ' + file)
                        resolve(file)
                    })
                }))
            }

            return Promise.all(createdFiles)

        }).catch(e => utils.handleError('Error: ' + e))
}
