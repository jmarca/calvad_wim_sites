const tap = require('tap')
const fs = require('fs')
const  spawn = require('child_process').spawn

const path      = require('path')
const rootdir   = path.normalize(__dirname)

const superagent = require('superagent')

const config_file = rootdir+'/../test.config.json'
const config_okay = require('config_okay')
const utils =  require('./couch_utils.js')
const create_tempdb = utils.create_tempdb
const delete_tempdb = utils.delete_tempdb

const config_file_2 = 'view.test.config.json'
const logfile = 'test_write_views.log'



tap.plan(2)


function promise_wrapper(fn,arg){
    return new Promise((resolve, reject)=>{
        fn(arg,function(e,r){
            if(e){
                // console.log(e)
                return reject(e)
            }else{
                // console.log(r)
                return resolve(r)
            }
        })
    })
}



config_okay(config_file)
    .then( async (config) => {
        // first set up the db
        // then run the tests
        // then tear down the db
        // console.log(config)
        const date = new Date()
        const test_db_unique = [config.couchdb.db,
                                date.getHours(),
                                date.getMinutes(),
                                date.getSeconds(),
                                date.getMilliseconds()].join('-')
        config.couchdb.db = test_db_unique
        try{
            await create_tempdb(config,config.couchdb.db)
        }catch(e){
            if(e) console.log(e)
            throw e
        }
        return new Promise(function(resolve,reject){
            fs.writeFile(config_file_2,JSON.stringify(config),
                         {'encoding':'utf8'
                          ,'mode':0o600
                         },function(e){
                             if(e){ return reject(e) }
                             else {
                                 //console.log('wrote test config file')
                                 return resolve(config)
                             }
                         })
        })
    })
    .then( (config)=>{
        return new Promise((resolve,reject)=>{
            // run the command line program here
            let logstream,errstream

            const commandline = ['--config',config_file_2]
            // console.log(commandline)
            // return done()
            var job  = spawn('write_views.js', commandline)
            job.stderr.setEncoding('utf8')
            job.stdout.setEncoding('utf8')
            logstream = fs.createWriteStream(logfile
                                             ,{flags: 'a'
                                               ,encoding: 'utf8'
                                               ,mode: 0o666 })
            errstream = fs.createWriteStream(logfile
                                             ,{flags: 'a'
                                               ,encoding: 'utf8'
                                               ,mode: 0o666 })
            job.stdout.pipe(logstream)
            job.stderr.pipe(errstream)


            job.on('exit',(code,signal)=>{


                // done doing work; now can run the tests
                return resolve(config)
            })
            job.on('error', (err) => {
                console.log('Failed',err)
                return reject(err)
            })
        })
    })
    .then( async (config)=>{
        // tests
        // console.log('running tests on result of executable')
        // console.log('config is ',config)
        // check that views exist in database
        const cdb =
              [config.couchdb.host+':'+config.couchdb.port
               ,config.couchdb.db].join('/')
        const uri_wim = cdb + '/' + '_design/wim'
        const uri_tams = cdb + '/' + '_design/tams'
        const req_wim = superagent.head(uri_wim)
          .type('json')
          .auth(config.couchdb.auth.username
                ,config.couchdb.auth.password)
        const req_tams = superagent.head(uri_tams)
          .type('json')
          .auth(config.couchdb.auth.username
                ,config.couchdb.auth.password)

        const results = await Promise.all([req_wim,req_tams])
        results.forEach((res)=>{
            // console.log(res.header.etag)
            let etag = JSON.parse(res.headers.etag)
            tap.match(etag,/^1-/)
        })
        return config
    })
    .then( async (config)=>{
        // cleanup
        try{
            await Promise.all([delete_tempdb(config,config.couchdb.db)
                               ,promise_wrapper(fs.unlink,logfile)
                               ,promise_wrapper(fs.unlink,config_file_2)
                              ])
        }catch(e){
            if(e) console.log(e)
            throw e
        }
    })



    .catch( err => {
        console.log(err)
        throw new Error(err)
    })
