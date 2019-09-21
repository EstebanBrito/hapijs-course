const pool = require('../repository/connection')

async function getCourses(){
  let sql = `SELECT * FROM courses`
  return await pool.query(sql)
}

async function saveCourses(payload){
  let sql = `INSERT INTO courses (name, description, credits, code) 
  VALUES ('${payload.name}', '${payload.description}', '${payload.credits}', '${payload.code}')`

  console.log(sql) // DEBUG

  pool.query(sql)
    .then(data =>{
      console.log('Cursos insertados')
      return 'ok'
    })
    .catch(err =>{
      console.log(err)
      return err
    })
}

module.exports = {
  getCourses,
  saveCourses
}