
import { html, render, Component } from 'https://unpkg.com/htm@3.1.0/preact/standalone.module.js'
import { getExport, getFileName } from '../retrieval.js'
import templateContent from '../template.js'

const fetchItem = async (url) => {
    return window.fetch(url + '.json').then(res => res.json())
}


class Exporter extends Component {

    state = { options: {}, mode: 'json', exportRunning: false, hasError: false, statusText: null, statusPercent: 0 }

    setOptions = patch => this.setState({ options: { ...this.state.options, ...patch } })

    toggleMode = mode => this.setState({ mode })

    handleError = (text) => {
        this.setState({ hasError: true, statusText: text })
    }

    updateStatus = (text, percent) => {
        this.setState({ statusPercent: percent * 100, statusText: text })
    }

    download = (filename, content) => {
        const elem = document.getElementById('download')
        elem.setAttribute('href', content)
        elem.setAttribute('download', filename)
        elem.click()
    }

    getExport = async () => {
        this.setState({ exportRunning: true, hasError: false, statusText: null, statusPercent: 0 })

        getExport({ updateStatus: this.updateStatus, handleError: this.handleError, fetchItem }, this.state.options).then(result => {

            if (result) {
                if (this.state.mode === 'json') {
                    this.download(
                        getFileName(result) + '.json',
                        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result))
                    )
                } else {
                    const template = doT.template(templateContent)
                    this.download(
                        getFileName(result) + '.html',
                        'data:text/html;charset=utf-8,' + encodeURIComponent(template(result))
                    )
                }
            }

            this.setState({ exportRunning:  false})
        })
    }

    render({}, { options, exportRunning, hasError, statusText, statusPercent }) {
        return (html`
            <div>
                <${window.ownInputs} html="${html}" main="${this}" options="${options}" exportRunning="${exportRunning}" />
                <div id="mode">
                    <label for="outputJSON">
                        <input type="radio" defaultChecked="true" name="mode" id="outputJSON" disabled=${exportRunning} onInput=${() => this.toggleMode('json')}/>
                        Machine-readable JSON output
                    </label>
                    <label for="outputHtml">
                        <input type="radio" name="mode" id="outputHtml" disabled=${exportRunning} onInput=${() => this.toggleMode('html')}/>
                            User-readable HTML output
                    </label>
                </div>
                <div id="progress" class="${exportRunning || hasError ? 'visible' : null} ${hasError ? 'error' : null}">
                    <p>${statusText}</p>
                    <i style="width: ${statusPercent}%; display: ${hasError ? 'none' : 'block'}"></i>
                </div>
                <input id="export" type="button" disabled=${!options.username || exportRunning} onClick=${this.getExport} value="Export"/>
                <a id="download" class="hidden">Download</a>
            </div>
            `
        )
    }
}

render(html`<${Exporter}/>`, document.querySelector('#exporter'))
