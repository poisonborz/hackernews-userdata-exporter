
const baseUrl = 'https://hacker-news.firebaseio.com/v0/'

const batchedGet = async (items, statusMessage, utils) => {
    const batchSize = 5
    let position = 0
    let result = []

    utils.updateStatus(statusMessage, 0);

    while (position < items.length) {
        // batch request to not spam the api all at once
        const itemsForBatch = items.slice(position, position + batchSize);
        result = [...result, ...await Promise.all(itemsForBatch.map(item => utils.fetchItem(item)))];
        position += batchSize;

        utils.updateStatus(statusMessage, Math.min(position/items.length,1));
    }

    return result;
}

const getData = (username, utils) => {
    utils.updateStatus('Getting user data');
    return utils.fetchItem(baseUrl + 'user/' + username).then(async data => {

        if (!data) {
            utils.handleError('Username not found - might not exist or is private')
            return
        }

        const result = {}
        const submissions = data?.submitted?.map((s) => s) || []
        delete data.submitted

        result.user = data

        utils.updateStatus('Getting user data', null, true);

        if (submissions?.length) {
            const items = await batchedGet(submissions.map(s => baseUrl + 'item/' + s ), 'Getting user submissions', utils)

            // get parents of comments for semantical context
            const submissionsWithParent = items.filter(s => s.parent)

            if (submissionsWithParent.length) {
                (await batchedGet(submissionsWithParent.map(s => baseUrl + 'item/' + s.parent), 'Getting comment submission parent items', utils)).forEach(p => {
                    submissionsWithParent.find(s => s.parent === p?.id).parent = p
                })
            }

            // get parts of polls
            const submissionsWithParts = items.filter(s => s.parts)

            if (submissionsWithParts.length) {
                (await batchedGet(submissionParts.map(s => s.parts).flat().map(partId => baseUrl + 'item/' + partId), 'Getting poll submission part items', utils)).forEach(p => {
                    for (let s of submissionsWithParts) {
                        const i = s.parts.findIndex(sp => sp === p.id)

                        if (i > -1) {
                            submissionsWithParts[i] = p
                        }

                        break
                    }
                })
            }

            ['comment', 'story', 'poll', 'job'].forEach((type) => {
                result[type] = items.filter(i => i.type === type)
            })

            return result
        }
    })
}

export const getExport = async (utils, options) => {

    if (!options.username) {
        utils.handleError('No username argument specified')
        return
    }

    return getData(options.username, utils)
}

export const getFileName = (result) => {
    const dateString = (new Date).toISOString().replace('T','_').replace(/:/g,'-').split('.')[0]
    return `hn_export_${result.user.id}_${dateString}`
}

export default {
    getExport,
    getFileName
}
