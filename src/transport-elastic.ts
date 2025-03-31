import WinstonTransport from 'winston-transport'
import { type Client } from '@elastic/elasticsearch'

import createConnection from './elasticsearch'

import { type IOptions } from './interfaces/options.interface'

class WinstonElastic extends WinstonTransport {
  public options: IOptions
  public elastic: Client
  public silent: boolean
  public index: string

  constructor (options: IOptions) {
    super(options)

    this.options = options
    this.silent = options.silent || false
    this.index = options.index !== '' ? options.index : 'log'

    this.elastic = createConnection(options.elasticClient)
  }

  public async log (info: unknown, next: () => void): Promise<void> {
    if (this.silent) { next(); return }

    // @ts-expect-error it is necessary
    info['@timestamp'] = info.timestamp ? info.timestamp : new Date().toISOString()

    await this.elastic.index({
      body: info,
      index: this.index
    })

    next()
  }

  public async close (): Promise<void> {
    await this.elastic.close()
  }
}

export default WinstonElastic
