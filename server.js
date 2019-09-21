const Hapi = require('@hapi/hapi')

const DB = require('./dbMemory')
const routes = require('./routes')

const server = Hapi.server({
  port: process.env.port || 3000,
  host: 'localhost'
})

server.app.DB = DB // Load it into global object

async function init () {
  try {
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

init()
