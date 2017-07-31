var putview = require('couchdb_put_view')

function put_a_view(opts){
    return new Promise((resolve, reject)=>{
        //console.log(opts)
        putview(opts,function(e,r){
            if(e){
                return reject(e)
            }else{
                return resolve(r)
            }
        })
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
