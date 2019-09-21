const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

// Accet header validation schema
// ^ - starts with; $ - ends with;
const acceptSchema = Joi.string().regex(/^application\/json;\s?version\s?=\s?\d$/)

const internals = {
  options: null,
  versioned: []
}

function retrieveVersion(accept, regex){
  const match = accept.match(matchVersion) // [12] version=1
  return match instanceof Array ? match[0] : null
}

function findVersionedEndpoint(urlPath, accept){
  const versionedEntry = internals.versioned.find(regex => {
    const path = urlPath.match(regex.matchPath)
    return path instanceof Array
  })

  return versionedEntry ? retrieveVersion(accept, versionedEntry.matchVersion) :  null
}

module.exports = {
  name: 'apiVersion',
  version: '1.0.0',
  register: function(server, options){
    options.forEach((item) => {
      internals.versioned.push({
        matchPath: new RegExp(item.basePath),
        matchVersion: new RegExp(`[${item.versions.join('')}]`)
      })
    })

    server.ext('onRequest', (request, h)=>{
      const { accept } = request.headers

      // Validate Accept header format
      const isAcceptValid = acceptSchema.validate(Accept)
      if (isAcceptValid) {
        return Boom.badRequest('Accept header is not valid')
      }
      //
      const matchedVersion = findVersionedEndpoint(request.url.pathname, accept)
      if (matchedVersion){
        request.app.apiVersion = matchedVersion
        const basePath = `api/v${matchedVersion}` // api/v1
        const url = request.url.pathname.slice(4) // The rest of the URL
        const route = `${basePath}${url}`
        request.setUrl(route)
      } else {
        return Boom.badRequest('API version needs to be passed in Accept header')
      }
      return h.continue
    })
  }
}