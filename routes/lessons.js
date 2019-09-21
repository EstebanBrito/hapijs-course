const Boom = require('@hapi/boom')
const handlers = require('../handlers/lessons')
const lessonSchema = require('../schemas/lessonSchema')

const lessons = [
  {
    method: 'GET',
    path: '/api/courses/{courseId}/lessons',
    handler: handlers.listLessons
  },
  {
    method: 'POST',
    path: '/api/courses/{courseId}/lessons',
    handler: handlers.createLesson,
    options: {
      validate: {
        payload: lessonSchema.createPayload,
        params: lessonSchema.courseIdParam,
        failAction: (request, h, error) => {
          throw Boom.boomify(new Error(error.message), {statusCode: 400})
        }
      }
    }
  }
]

module.exports = lessons