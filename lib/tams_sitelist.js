const filename =  './tams_archive_tables_rewritten.json'
const fs = require('fs')

const readedit = fs.readFileSync(filename, 'utf8')
const data = JSON.parse(readedit)
module.exports=data
