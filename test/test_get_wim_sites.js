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
                                            r.should.have.property('rows').with.lengthOf(80)
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
})
