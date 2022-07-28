import * as prismic from '@prismicio/client'
import { CreateClientConfig, enableAutoPreviews} from '@prismicio/next'

import { apiEndpoint } from '../../sm.json'

export const repositoryName = prismic.getRepositoryName(apiEndpoint)

export const createClient = (config?: CreateClientConfig) => {
    const client = prismic.createClient(apiEndpoint, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN
    })

    enableAutoPreviews({
        client,
        previewData: config?.previewData,
        req: config?.req,
    })

    return client
}