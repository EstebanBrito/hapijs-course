const Hapi = require('@hapi/hapi')
const Blipp = require('blipp')
const apiVersion = require('./plugins/apiVersion')

const DB = require('./dbMemory')
const routes = require('./routes')

const server = Hapi.server({
  port: process.env.port || 3000,
  host: 'localhost'
})

server.app.DB = DB // Load it into global object

async function init () {
  try {

    await server.register({
      plugin: Blipp,
      options: {
        showAuth: true
      }
    })
    await server.register({
      plugin: apiVersion,
      options: [
        {
          basePath: 'api/courses',
          versions: [1, 2]
        },
        {
          basePath: 'api/lessons',
          versions: [1]
        }
      ]
    })
    server.route(routes)

    await server.start()
    console.log(`Server is running on ${server.info.uri}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

const preResponse = function (request, h){
  if (request.response.isBoom){
    return h.continue
  }

  const response = {
    data: request.response.source,
    company: 'ADC',
    api: `v${request.app.apiVersion}`
  }

  request.response.source = response
  return h.continue
}

server.ext('onPreResponse', preResponse)

init()
