var viewer = require('couchdb_get_views')

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

module.exports=get_wim_need_imputing
