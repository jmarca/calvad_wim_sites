/* global require console process describe it */

var should = require('should')
var wim_sites = require('../wim_sites')
var path    = require('path')
var rootdir = path.normalize(__dirname)


var config_file = rootdir+'/../test.config.json'
var config={}

describe('get sites',function(){
    it('should get all the wim sites that need imputing',function(done){
        wim_sites({'year':2007
                  ,'config_file':config_file}
                 ,function(e,r){
                      should.not.exist(e)
                      should.exist(r)
                      //console.log(r)
                      return done()
        })
    })
    it('should get all the wim sites that need plotting',function(done){
        wim_sites.get_wim_need_plotting({'year':2008
                                        ,'config_file':config_file}
                                       ,function(e,r){
                                            should.not.exist(e)
                                            should.exist(r)
                                            r.should.have.property('rows').with.lengthOf(25)
                                            //console.log(r)
                                            return done()
                                        })
    })
    it('should get all the wim sites that need pairing',function(done){
        wim_sites.get_wim_need_pairing({'year':2007
                                        ,'config_file':config_file}
                                       ,function(e,r){
                                            should.not.exist(e)
                                            should.exist(r)
                                            r.should.have.property('rows').with.lengthOf(86)
                                            //console.log(r)
                                            return done()
                                        })
    })
    it('should export the list of all WIM sites known about',function(done){
        var sites = wim_sites.sites
        should.exist(sites)
        sites.should.have.lengthOf(117)

        sites.forEach(function(entry,i){
            entry.should.have.property('site')
            entry.should.have.property('site_name')
            return null
        })
        return done()
    })
    it('should get the imputed status of all the wim sites',function(done){
        wim_sites.get_wim_imputed_status({'year':2012
                                          ,'config_file':config_file}
					 ,function(e,r){
                                             should.not.exist(e)
                                             should.exist(r)
                                             r.should.have.property('rows').with.lengthOf(165)
                                             //console.log(r)
                                             return done()
                                         })
    })
    it('should get the list of merged wim/vds sites for a year',function(done){
        wim_sites.get_wim_merged({'year':2012
                                  ,'config_file':config_file}
				 ,function(e,r){
                                     should.not.exist(e)
                                     should.exist(r)
                                     r.should.have.property('rows')
                                         .with.lengthOf(85)
                                     //console.log(r)
                                     return done()
                                 })
    })

})
