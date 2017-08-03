var viewer = require('couchdb_get_views')
var setter = require('couch_set_state')
var set_couchdb_options = require('./couch_utils').set_couchdb_options

// pass in year, config_file (optional) in opts object
/**
 * get_tams_need_imputing
 * @param {Object} opts couchdb options object
 * @param {function} cb called with a list of tams ids that need
 * imputing
 * @returns {}
 */
function get_tams_need_imputing(opts,cb){
    // first call get imputed status, then sift the results.

    get_tams_imputed_status(opts,function(e,r){
        var result = []
        if(r.rows === undefined || r.rows.length === 0){
            return cb()
        }else{
            var unique_tams = {}
            r.rows.forEach( d => {
                // // verify direction
                // if(d.key[3] === undefined){
                //     return null
                // }
                const tamsid = d.key[2]
                if(unique_tams[tamsid] === undefined){
                    unique_tams[tamsid] = {}
                }
                if(d.key[3] !== undefined){
                    unique_tams[tamsid][d.key[3]] = d.key[1]
                }else{
                    unique_tams[tamsid].both = d.key[1]
                }
                return null
            })

            Object.keys(unique_tams).forEach( k => {
                // roll up state.
                // cases:
                // if no directions, push
                // if directions, but one or both unifinished, push
                // if two directions, both finished, don't push
                const directions = ['both','E','W','N','S']
                let finished = 0
                directions.forEach( dir => {
                    if(unique_tams[k][dir] !== undefined
                       && unique_tams[k][dir] === 'finished' )
                        finished++
                })
                if(finished < 2){
                    result.push(k)
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
/**
 * get_tams_imputed_status
 * @param {Object} opts couchdb options object
 * @param {function} cb called with rows from DB with imputed status
 * @returns {}
 * @throws {}
 */
function get_tams_imputed_status(opts,cb){
    var year = +opts.year
    var o = set_couchdb_options(opts)
    o['view']= '_design/tams/_view/imputed_status'
    o['startkey'] = [year]
    o['endkey'] = [year,"\ufff0"] // verified high sentinel as of 1.6.2 couchdb
    o['reduce'] = false
    //console.log(o)
    viewer(o
          ,function(err,docs){
               if(err) throw new Error('oops')
               cb(null,docs)
               return null
           })
    return null
}


/**
 * set_tams_data_state
 * @param {Object} opts couchdb options for couch_set_state
 * @param {Integer} year
 * @param {} value anything.  Will be stuck under the "data" state for
 * the given year
 * @returns {Promise} returns a "thenable" promise
 */
function set_tams_data_state(opts,year,value){

    return setter({'db':opts.couchdb.db
                   ,'doc': opts.doc
                   ,'year':year
                   ,'state':'data'
                   ,'value':value})

}




module.exports.get_tams_imputed_status=get_tams_imputed_status
module.exports.get_tams_need_imputing=get_tams_need_imputing
// module.exports.get_tams_need_plotting=get_tams_need_plotting
// module.exports.get_tams_need_pairing=get_tams_need_pairing
// module.exports.get_tams_merged=get_tams_merged
module.exports.set_tams_data_state=set_tams_data_state
