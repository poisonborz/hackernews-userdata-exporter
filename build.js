
import resEdit from 'resedit'
import path from 'path'
import fs from 'fs'
import { exec } from 'pkg'
import webpack from 'webpack'
import { fileURLToPath } from 'url'
import webpackConfig from './config.merge.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buildConfigPath = path.join(__dirname, 'config.build.json')
const buildPlatformPath = path.join(__dirname, 'src', 'build.json')
const iconPath = path.join(__dirname, 'src', 'icon.ico')
const outputFolder = 'dist'

const {
    pkg
} = JSON.parse(fs.readFileSync(buildConfigPath, { encoding: 'utf8' }))

const {
    version,
    description,
    company,
    name,
    copyright
} = JSON.parse(fs.readFileSync(buildPlatformPath, { encoding: 'utf8' }))


webpack(webpackConfig, async (err, stats) => {

    if (err || stats.hasErrors()) {
        console.log(err || 'Error while merging source')
        process.exit(1)
    }

    await exec([
        path.join(webpackConfig.output.path, webpackConfig.output.filename),
        '--config', buildConfigPath,
        '--output', path.join(outputFolder, name)
    ])

    const exePath = path.join(outputFolder, `${name}-win.exe`)
    const data = fs.readFileSync(exePath)
    const exe = resEdit.NtExecutable.from(data)
    const res = resEdit.NtExecutableResource.from(exe)
    const vi = resEdit.Resource.VersionInfo.fromEntries(res.entries)[0]
    const iconFile = resEdit.Data.IconFile.from(fs.readFileSync(iconPath))
    const theVersion = `${version}.0`.split(".")

    vi.removeStringValue({ lang: 1033, codepage: 1200 }, 'OriginalFilename')
    vi.removeStringValue({ lang: 1033, codepage: 1200 }, 'InternalName')
    vi.setProductVersion(theVersion[0], theVersion[1], theVersion[2], theVersion[3], 1033)
    vi.setFileVersion(theVersion[0], theVersion[1], theVersion[2], theVersion[3], 1033)
    vi.setStringValues(
        { lang: 1033, codepage: 1200 },
        {
            FileDescription: description,
            ProductName: name,
            CompanyName: company,
            LegalCopyright: copyright
        }
    )

    vi.outputToResourceEntries(res.entries)

    resEdit.Resource.IconGroupEntry.replaceIconsForResource(
        res.entries,
        1,
        1033,
        iconFile.icons.map((item) => item.data)
    )

    res.outputResource(exe)
    fs.writeFileSync(exePath, Buffer.from(exe.generate()))
})
