const uuid4 = require('uuid/v4')
const services = require('../services/courses')

async function listCourses (request, h) {
  try{
    let data = await services.getCourses()
    return h.response(data.rows).code(200)
  }catch(err){
    console.log(error)//DEBUG
    return h.response(err).code(500)
  }
}

async function createCourse (request, h) {
  const course = Object.assign(request.payload)
  try{
    const ok = await services.saveCourses(course)
    return h.response(course).code(201)
  }catch(err){
    return h.response(err).code(500)
  }
  // request.server.app.DB.courses.push(course) //Storage not in memory anymore
}

module.exports = {
  listCourses,
  createCourse
}
