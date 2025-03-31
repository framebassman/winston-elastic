import { type ClientOptions } from '@elastic/elasticsearch'

interface IOptions {
  elasticClient: ClientOptions
  silent: boolean
  index: string
  useTransformer?: boolean
  transformer?: (info: unknown) => Promise<unknown>
}

export type {
  IOptions
}
