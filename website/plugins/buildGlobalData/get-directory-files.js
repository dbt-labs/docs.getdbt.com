/**
 * Get an array of all files in a directory
 * and the ID from each file's frontmatter
 * @param {string} dir Directory path 
 * @param {Array.<Object>} [directoryArr=[]] - Subdirectory found in readdirSync
 * @returns {Array} - Array of file paths and file IDs
 */

const fs = require('fs')
const matter = require('gray-matter')

const getDirectoryFiles = (dir, directoryArr = [], returnJson = false) => {
  const files = fs.readdirSync(dir)
  files.map(file => {
    const filePath = `${dir}/${file}`
    if(fs.statSync(filePath).isDirectory()) {
      // If current item is directory, self-invoke getDirectoryFiles function
      getDirectoryFiles(filePath, directoryArr, returnJson)
    } else {
      // If a file, get markdown content
      const fileData = fs.readFileSync(filePath, { encoding: 'utf8' })
      if(!fileData)
        return null
      
      // convert frontmatter to json
      const fileJson = matter(fileData)
      if(!fileJson)
        return null

      // Return full JSON data if returnJson true
      // Otherwise only pass filePath & id
      if(returnJson) {
        fileJson.data.file = file
        fileJson.data.path = filePath
        directoryArr.push(fileJson)
      } else {
        // add file contents to array
        const { data } = fileJson
        directoryArr.push({
          filePath,
          id: data?.id || null
        })
      }

    }
  })
  return directoryArr
}

module.exports = { getDirectoryFiles }
