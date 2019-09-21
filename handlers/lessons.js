const uuid4 = require('uuid/v4')
const Boom  = require('@hapi/boom')

async function createLesson (request, h) {
  const id = uuid4()
  const { courseId } = request.params
  const course = request.server.app.DB.courses.find((c) => c.id===courseId)
  if (!course) {
    throw Boom.notFound('courseId does not belong to any register in Courses')
  }
  const payload = Object.assign(request.payload, { id, courseId})
  request.server.app.DB.lessons.push(payload)
  return payload
}

async function listLessons (request, h) {
  let lessons = []
  const { description } = request.query // description comes from query params
  const { courseId } = request.params // courseId comes from URI
  //Filter by description
  if (description){
    lessons = request.server.app.DB.lessons.filter((l) => {
      // Return True if description exits (is different than -1) and the lesson belongs to that course
      return l.description.toLowerCase().search(description) !== -1 && l.courseId === courseId
    })
  } else{
    //Filter by courseId
    //Return True if lesson belongs to that course
    lessons = request.server.app.DB.lessons.filter((l) => l.courseId === courseId)
  }
  
  // Return lessons if is not null. Otherwise return an empty array
  return lessons || []
}

module.exports = {
  createLesson,
  listLessons
}