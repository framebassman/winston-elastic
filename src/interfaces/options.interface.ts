import { type ClientOptions } from '@elastic/elasticsearch'

interface IOptions {
  elasticClient: ClientOptions
  silent: boolean
  index: string
}

export type {
  IOptions
}
