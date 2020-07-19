import axios from 'axios'
// const baseurl = 'http://localhost:3001/persons'
const baseurl = '/persons'

const getAll = () => {
  const request = axios.get(baseurl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseurl, newObject)
  return request.then(response => response.data)
}

const update = (id, updatedObject) => {
  const request = axios.put(`${baseurl}/${id}`, updatedObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${baseurl}/${id}`) 
  return request.then()
}

export default {getAll, create, update, remove}