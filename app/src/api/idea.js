import axios from 'axios'
import * as config from '@/api/config'

export default {
  start (idea, cb, errorCb) {
    axios.post(`${config.API_ADDRESS}/idea`, idea, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  update (idea, cb, errorCb) {
    axios.put(`${config.API_ADDRESS}/idea`, idea, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  view (id, cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/idea/${id}`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  destroy (postData, cb, errorCb) {
    axios.post(`${config.API_ADDRESS}/idea/destroy`, postData, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  explore (categoryId, cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/ideas/${categoryId}`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  subscribe (ideaId, cb, errorCb) {
    axios.put(`${config.API_ADDRESS}/idea/subscribe`, { idea_id: ideaId }, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  unsubscribe (ideaId, cb, errorCb) {
    axios.put(`${config.API_ADDRESS}/idea/unsubscribe`, { idea_id: ideaId }, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  }
}
