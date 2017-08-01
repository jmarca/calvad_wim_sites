#!/usr/bin/env node
var path = require('path');
const fixup_views = require('.').fixup_views

const rootdir = path.normalize(process.cwd())

let config_file = path.normalize(rootdir+'/config.json')

const config_okay = require('config_okay')
const argv = require('minimist')(process.argv.slice(2))

// process command line arguments
if(argv.config !== undefined){
    config_file = path.normalize(rootdir+'/'+argv.config)
}
console.log('setting configuration file to ',config_file,'.  Change with the --config option.')



config_okay(config_file)
    .then(async (config) => {
        console.log('got config')
        const wimjobs =  fixup_views.put_wim_views(config,config.couchdb.db)
        const tamsjobs = fixup_views.put_tams_views(config,config.couchdb.db)

        const jobs = [].concat(wimjobs,tamsjobs)
        console.log(jobs)
        return Promise.all(jobs)
    })
    .then(r => {
        console.log('done saving views')
        console.log(r)
    })
    .catch(e=>{
        console.log('something fell')
        console.log(e)
    })
