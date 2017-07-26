var sites = require('./lib/sitelist.js');
var wim_sites = require('./lib/wim_sites.js')
var tams_sites = require('./lib/tams_sites.js')


module.exports.get_wim_need_imputing=wim_sites.get_wim_need_imputing
module.exports.get_wim_need_plotting=wim_sites.get_wim_need_plotting
module.exports.get_wim_need_pairing=wim_sites.get_wim_need_pairing
module.exports.sites =  sites
module.exports.get_wim_imputed_status=wim_sites.get_wim_imputed_status
module.exports.get_wim_merged=wim_sites.get_wim_merged

module.exports.get_tams_imputed_status=tams_sites.get_tams_imputed_status
module.exports.get_tams_need_imputing=tams_sites.get_tams_need_imputing
// module.exports.get_tams_need_plotting=tams_sites.get_tams_need_plotting
// module.exports.get_tams_need_pairing=tams_sites.get_tams_need_pairing
// module.exports.get_tams_merged=tams_sites.get_tams_merged
