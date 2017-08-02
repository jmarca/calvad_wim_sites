
/**
 * set_couchdb_options
 * @param {Object} opts contains either a config file, or a couchdb
 * member element
 * @param {Object} opts.couchdb everything in this object will get
 * copied to the reply, if a config_file option does not exist.
 * @param {String} opts.config_file the config file to use to set
 * couchdb options.  overrides anything in opts.couchdb, so don't use
 * this if you don't want that.
 * @returns {Object} o containing either o.config_file, or all the
 * couchdb settings.
 */
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

module.exports.set_couchdb_options=set_couchdb_options
