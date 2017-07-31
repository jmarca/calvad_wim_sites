const superagent = require('superagent')
const exec = require('child_process').exec
const fixup_views = require('../lib/fixup_views.js')
const file_dir = process.cwd()+'/test/files/'


function create_tempdb(config,db){


    if(!db || db === undefined || typeof db === 'function'){
        throw new Error('db required now')
    }
    const cdb =
        [config.couchdb.host+':'+config.couchdb.port
         ,db].join('/')

    const req = superagent.put(cdb)
          .type('json')
          .auth(config.couchdb.auth.username
                ,config.couchdb.auth.password)
    // superagent is "then-able"
    return req

}

function delete_tempdb(config,db){
    if(typeof db === 'function'){
        throw new Error('db required now')
    }
    const cdb =
        [config.couchdb.host+':'+config.couchdb.port
         ,db].join('/')
    const req = superagent.del(cdb)
          .type('json')
          .auth(config.couchdb.auth.username
                ,config.couchdb.auth.password)

    return req
}


// utility
function put_file(file,couch){
    const db_dump = require(file)
    const req = superagent.post(couch)
          .type('json')
          .send(db_dump)
    return req
}

function load_files(config,db_files){
    const cdb = [config.couchdb.host+':'+config.couchdb.port
                 ,config.couchdb.db].join('/')
    const jobs = []
    db_files.forEach(function(file){
        jobs.push(put_file(file,cdb))
    })
    return jobs
}

async function load_wim(config){
    var db_files = [file_dir+'wim.10.N.json'  //done impute, with png files
                    ,file_dir+'wim.80.W.json' //not done impute, without png files, no data in db
                    ,file_dir+'wim.87.S.json' //not done impute, without png files
                    ,file_dir+'wim.83.W.json' //not done impute, without png files
                   ]
    const jobs = load_files(config,db_files)
    // console.log('first jobs isArray',Array.isArray(jobs))
    jobs.push(fixup_views.put_wim_views(config,config.couchdb.db))
    return jobs
}

async function load_tams(config){
    var db_files = [file_dir+'tams.7005.E.json'
                    ,file_dir+'tams.7005.W.json'
                   ]
    const jobs = load_files(config,db_files)
    jobs.push(fixup_views.put_tams_views(config,config.couchdb.db))
    // console.log('load tams,  jobs isArray',Array.isArray(jobs),jobs.length)
    return jobs
}


function load_detector(config){
    var db_files = [file_dir+'801447.json'  //with png files
                    ,file_dir+'801449.json' //with png files
                    ,file_dir+'801451.json' // without png files
                    ,file_dir+'822370.json' // without png files
                   ]
    return load_files(config,db_files)
}


async function demo_db_before(config){

    const creation = await create_tempdb(config,config.couchdb.db)
    // console.log(creation)
    const wimjobs = await load_wim(config)  // waiting to get the list of
                                         // promises, actually
    const tamsjobs = await load_tams(config)

    const results = await Promise.all([].concat(wimjobs,tamsjobs))
    // console.log('results.length is ',results.length)
    return null
}

async function demo_db_after(config){
    await delete_tempdb(config,config.couchdb.db)
    return null
}

exports.load_detector = load_detector
exports.load_wim = load_wim
exports.create_tempdb = create_tempdb
exports.delete_tempdb = delete_tempdb
exports.demo_db_after = demo_db_after
exports.demo_db_before= demo_db_before
