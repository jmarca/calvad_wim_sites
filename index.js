const sites = require('./lib/sitelist.js');
const tams_sitelist = require('./lib/tams_sitelist.js');
const wim_sites = require('./lib/wim_sites.js')
const tams_sites = require('./lib/tams_sites.js')
const row_has_year = require('./lib/tams_row_has_year.js')

module.exports.get_wim_need_imputing=wim_sites.get_wim_need_imputing
module.exports.get_wim_need_plotting=wim_sites.get_wim_need_plotting
module.exports.get_wim_need_pairing=wim_sites.get_wim_need_pairing
module.exports.sites =  sites
module.exports.get_wim_imputed_status=wim_sites.get_wim_imputed_status
module.exports.get_wim_merged=wim_sites.get_wim_merged

module.exports.get_tams_imputed_status=tams_sites.get_tams_imputed_status
module.exports.get_tams_need_imputing=tams_sites.get_tams_need_imputing
module.exports.tams_sitelist =  tams_sitelist
module.exports.tams_row_has_year = row_has_year
// module.exports.get_tams_need_plotting=tams_sites.get_tams_need_plotting
// module.exports.get_tams_need_pairing=tams_sites.get_tams_need_pairing
// module.exports.get_tams_merged=tams_sites.get_tams_merged
