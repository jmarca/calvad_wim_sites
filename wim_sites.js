var viewer = require('couchdb_get_views')
var sites = require('./lib/sitelist.js');

// pass in year, config_file (optional) in opts object
function get_wim_need_imputing(opts,cb){
    var year = +opts.year
    viewer({'view':'_design/wim/_view/imputed_status'
           ,'startkey':[year,"nothing" ]
           ,'endkey':[year,"nothing",{}]
           ,'reduce':false
           ,'config_file':opts.config_file
           }
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

// pass in year, config_file (optional) in opts object
function get_wim_need_plotting(opts,cb){
    var year = +opts.year
    viewer({'view':'_design/wim/_view/plot_status'
           ,'startkey':[year,"nothing" ]
           ,'endkey':[year,"nothing",{}]
           ,'reduce':false
           ,'config_file':opts.config_file
           }
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

// pass in year, config_file (optional) in opts object
function get_wim_need_pairing(opts,cb){
    var year = +opts.year
    viewer({'view':'_design/wim/_view/pair_check_yr'
           ,'startkey':[year]
           ,'endkey':[year,"\ufff0"]
           ,'reduce':false
           ,'config_file':opts.config_file
           }
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

// pass in year, config_file (optional) in opts object
function get_wim_done_imputing(opts,cb){
    var year = +opts.year
    viewer({'view':'_design/wim/_view/impute_finished_yr'
           ,'startkey':[year]
           ,'endkey':[year,"\ufff0"] // check the semantics with newer couchdb
           ,'reduce':false
           ,'config_file':opts.config_file
           }
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}

module.exports=get_wim_need_imputing
module.exports.get_wim_need_plotting=get_wim_need_plotting
module.exports.get_wim_need_pairing=get_wim_need_pairing
module.exports.sites =  sites
module.exports.get_wim_done_imputing=get_wim_done_imputing
