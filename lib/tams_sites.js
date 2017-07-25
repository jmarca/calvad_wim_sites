var viewer = require('couchdb_get_views')

function set_couchdb_options(opts){
    var o = {}
    if(opts.config_file !== undefined){
        o.config_file = opts.config_file
        return o
    }
    if(opts.couchdb !== undefined){
        Object.keys(opts.couchdb).forEach(function(k){
            o[k] = opts.couchdb[k]
        })
        return o
    }
    return o
}
// pass in year, config_file (optional) in opts object
function get_tams_need_imputing(opts,cb){
    // first call get imputed status, then sift the results.

    get_tams_imputed_status(opts,function(e,r){
        var result = []
        if(r.rows === undefined || r.rows.length === 0){
            return cb()
        }else{
            r.rows.forEach(function(d){
                // verify direction
                if(d.key[3] === undefined){
                    return null
                }
                if(d.key[1] != 'finished'){
                    result.push(d)
                }
                return null
            })
            return cb(null,{'rows':result})
        }
        return null
    })
    return null
}

// pass in year, config_file (optional) in opts object
function get_tams_need_plotting(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view'] = '_design/tams/_view/plot_status'
    o['startkey'] = [year,"nothing" ]
    o['endkey'] = [year,"nothing",{}]
    o['reduce'] = false

    viewer(o
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

// pass in year, config_file (optional) in opts object
function get_tams_need_pairing(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view']= '_design/tams/_view/pair_check_yr'
    o['startkey'] = [year]
    o['endkey'] = [year,"\ufff0"]
    o['reduce'] = false

    viewer(o
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

// pass in year, config_file (optional) in opts object
function get_tams_imputed_status(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view']= '_design/tams/_view/imputed_status'
    o['startkey'] = [year]
    o['endkey'] = [year,"\ufff0"] // verified high sentinel as of 1.6.2 couchdb
    o['reduce'] = false
    console.log(o)
    viewer(o
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

function get_tams_merged(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view']= '_design/tams/_view/merge_check_yr'
    o['startkey'] = [year]
    o['endkey'] = [year,"\ufff0"] // verified high sentinel as of 1.6.2 couchdb
    o['reduce'] = false
    viewer(o
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

module.exports=get_tams_need_imputing
module.exports.get_tams_need_plotting=get_tams_need_plotting
module.exports.get_tams_need_pairing=get_tams_need_pairing
module.exports.get_tams_imputed_status=get_tams_imputed_status
module.exports.get_tams_merged=get_tams_merged
