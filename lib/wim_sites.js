var viewer = require('couchdb_get_views')

var set_couchdb_options = require('./couch_utils').set_couchdb_options

// pass in year, config_file (optional) in opts object
function get_wim_need_imputing(opts,cb){
    // first call get imputed status, then sift the results.

    get_wim_imputed_status(opts,function(e,r){
        var result = []
        //console.log(e)
        //console.log(r)
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
function get_wim_need_plotting(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view'] = '_design/wim/_view/plot_status'
    o['startkey'] = [year,"nothing" ]
    o['endkey'] = [year,"nothing",{}]
    o['reduce'] = false

    viewer(o
          ,function(err,docs){
              if(err){
                  console.log(err)
                  throw new Error('oops')
              }
              cb(null,docs)
              return null
          })
    return null
}

// pass in year, config_file (optional) in opts object
function get_wim_need_pairing(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view']= '_design/wim/_view/pair_check_yr'
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
function get_wim_imputed_status(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view']= '_design/wim/_view/imputed_status'
    o['startkey'] = [year]
    o['endkey'] = [year,"\ufff0"] // verified high sentinel as of 1.6.2 couchdb
    o['reduce'] = false
    //console.log(o)
    viewer(o
          ,function(err,docs){
              if(err){
                  console.log(err)
                  throw new Error('oops')
              }
               cb(null,docs)
               return null
           })
    return null
}

function get_wim_merged(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view']= '_design/wim/_view/merge_check_yr'
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

// need to fix up putview still
// var fs = require('fs')
// var viewdoc = require('./couchdb_views/wim.json')
// // write views to db
// function write_views(opts,cb){
//     putview({db:db
//             ,doc:design_doc}
//            ,cb2)
//     fs.readFile(viewfile, function (err, data) {
//         if (err) throw err;
//         design_doc = JSON.parse(data)
//         cb(null)
//     });
// }

module.exports.get_wim_need_imputing=get_wim_need_imputing
module.exports.get_wim_need_plotting=get_wim_need_plotting
module.exports.get_wim_need_pairing=get_wim_need_pairing
module.exports.get_wim_imputed_status=get_wim_imputed_status
module.exports.get_wim_merged=get_wim_merged
