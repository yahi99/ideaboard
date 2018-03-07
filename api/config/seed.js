const _get = require('lodash/get')

const config = require('../config.js')

const Permission = require('../app/models/permission')
const User = require('../app/models/user')
const Idea = require('../app/models/idea')
const Category = require('../app/models/category')

// Setup permissions
setupPermissions()

function setupPermissions () {

  // Setup permissions
  const permissions = [
    { type: 'admin', description: 'Administrate the system' },
    { type: 'organiser', description: 'Manage categories and content' },
    { type: 'moderator', description: 'Moderate content submitted by users' }
  ]

  // Store permissions
  let promises = []
  let adminPermissions = []
  
  for (const instance in config.instances) {
    
    console.log(`Setting up permissions for ${instance}...`)

    // Loop permissions
    for (const key in permissions) {
      let newPermission = permissions[key]
      newPermission.instance = instance

      promises.push(new Promise(resolve => {
        Permission.findOneAndUpdate({ instance: instance, type: newPermission.type }, newPermission, { upsert: true, setDefaultsOnInsert: true }, (err, permission) => {
          if (err) console.error(err)
          adminPermissions.push(permission._id)
          resolve()
        })
      }))
    }
  }

  // Assign permissions
  Promise.all(promises).then(() => {
    setupAdmin(adminPermissions)
  })
}

function setupAdmin(adminPermissions) {

  
  for (const instance in config.instances) {
    
    console.log(`Setting up admin for ${instance}...`)
    
    const adminUser = {
      'profile.name': _get(config.instances[instance], 'admin.name', process.env.ADMIN_NAME),
      'profile.bio': _get(config.instances[instance], 'admin.bio', process.env.ADMIN_BIO),
      'local.email': _get(config.instances[instance], 'admin.email', process.env.ADMIN_EMAIL),
      'local.password': _get(config.instances[instance], 'admin.password', process.env.ADMIN_PASSWORD),
      '_permissions': adminPermissions
    }

    User.findOneAndUpdate({ 'local.email': adminUser['local.email'] }, adminUser, { upsert: true, setDefaultsOnInsert: true }, (err) => {
      if (err) console.error(err)
      console.log(`Admin created for ${instance}...`)
      User.findOne({ 'local.email': adminUser['local.email'] }, (err, admin) => {
        if (err) console.error(err)
        setupCategories(admin._id, instance)
      })
    })
  }
}

function setupCategories(adminId, instance) {
  
  console.log(`Setting up categories for ${instance}...`)

  let promises = []

  if (typeof config.instances[instance].categories !== 'undefined') {
    const categories = config.instances[instance].categories
    categories.forEach(data => {
      data._user = adminId
      data.instance = instance
      promises.push(new Promise(resolve => {
        Category.findOneAndUpdate({ 'instance': data.instance, 'tag': data.tag }, data, { upsert: true, setDefaultsOnInsert: true }, (err) => {
          if (err) console.error(err)
          resolve()
        })
      }))
    })
  }

  Promise.all(promises).then(() => {
    console.log(`Categories created for ${instance}...`)
  })
}
