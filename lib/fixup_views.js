var putview = require('couchdb_put_view')
var superagent = require('superagent')

function put_a_view(opts){
    const target =
          [opts.host+':'+opts.port
           ,opts.db
           ,opts.doc._id
          ].join('/')
    return new Promise(async (resolve,reject)=>{
        try{
            const exists = superagent.head(target)
                  .type('json')
                  .auth(opts.auth.username
                        ,opts.auth.password)
            const res = await exists
            //console.log('not found = ',res.notFound)
            //console.log(res.headers.etag)
            resolve(res.headers.etag)
        }catch (e) {
            // this is okay, if 404
            // console.log('result error',e.status)
            if(e.status === 404){
                putview(opts,function(e,r){
                    if(e){
                        console.log('unknown error putting view',e)
                        reject(e)
                    }else{
                        // console.log('put view done',r)
                        resolve(r.rev)
                    }
                    return null
                })
            }else{
                console.log('unknown error putting view',e)
                reject(e)
            }
        }
        return null

    })
}

function put_wim_views(config,db){
    var opts = Object.assign({},config.couchdb)
    opts.db = db
    opts.doc = require('../couchdb_views/wim.json')
    return put_a_view(opts)
}
function put_tams_views(config,db){
    var opts = Object.assign({},config.couchdb)
    opts.db = db
    opts.doc = require('../couchdb_views/tams.json')
    return put_a_view(opts)
}

module.exports.put_wim_views=put_wim_views
module.exports.put_tams_views=put_tams_views
