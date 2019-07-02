import getConfig from 'next/config'
import { AuthService } from './AuthService'
import { AuthGateway } from '../gateways/AuthGateway'
import { PubsubGateway } from '../gateways/PubsubGateway'
import * as RestConnector from '../connectors/RestConnector'
import * as PubsubConnector from '../connectors/PubsubConnector'

const { publicRuntimeConfig } = getConfig()

const API_BASE_URL = `${publicRuntimeConfig.BASE_URL}/api`
const restConnector = RestConnector.create({ baseUrl: API_BASE_URL })
const pubsubConnector = PubsubConnector.create()

const authGateway = new AuthGateway({ restConnector })
const pubsubGateway = new PubsubGateway({ pubsubConnector })

export const authService = new AuthService({
  pubsubGateway,
  authGateway
})
