import test from 'ava'
import sinon from 'sinon'
import winston from 'winston'

import WinstonElastic from '../transport-elastic'

test('Transport Elastic is associate with success how to transport in winston', t => {
  const logger = winston.createLogger({
    transports: [
      new WinstonElastic({
        silent: false,
        elasticClient: {
          node: 'http://localhost:9200'
        },
        index: 'log'
      })
    ]
  })

  t.is(logger.transports.length, 1)

  const transports = logger.transports[0]

  t.like(transports, {
    silent: false,
    options: {
      elasticClient: {
        node: 'http://localhost:9200'
      },
      silent: false,
      index: 'log'
    }
  })
})

test('Should send logs with success to elasticsearch', async t => {
  const sandbox = sinon.createSandbox()

  const winstonElastic = new WinstonElastic({
    silent: false,
    elasticClient: {
      node: 'http://localhost:9200'
    },
    index: 'log'
  })

  const stubElastic = sandbox.stub(winstonElastic.elastic, 'index')

  const logger = winston.createLogger({
    transports: [
      winstonElastic
    ]
  })

  logger.info({
    message: 'testing'
  })

  t.is(stubElastic.calledOnce, true)
  t.is(stubElastic.calledWithMatch({
    body: {
      message: 'testing',
      level: 'info'
    },
    index: 'log'
  }), true)
})
