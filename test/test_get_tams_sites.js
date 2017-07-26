/* global require console process describe it */

var should = require('should')
var wim_sites = require('../.')
var path    = require('path')
var rootdir = path.normalize(__dirname)


var config_file = rootdir+'/../test.config.json'
var config={}

describe('get sites',function(){
    it('should get all the tams sites that need imputing',function(done){
        wim_sites.get_tams_need_imputing({'year':2017
                                          ,'config_file':config_file}
                                         ,function(e,r){
                                             should.not.exist(e)
                                             should.exist(r)
                                             //console.log(r)
                                             return done()
                                         })
    })
    it('should get the imputed status of all the tams sites 2016',function(done){
        wim_sites.get_tams_imputed_status({'year':2016
                                          ,'config_file':config_file}
					 ,function(e,r){
                                             var acct = {}
                                             should.not.exist(e)
                                             should.exist(r)
                                             r.should.have.property('rows').with.lengthOf(165)
                                             r.rows.forEach(function(d){
                                                 if(acct[d.key[1]] === undefined){
                                                     acct[d.key[1]] = 1
                                                 }else{
                                                     acct[d.key[1]]++
                                                 }
                                             })
                                             acct.finished.should.eql(140)
                                             //console.log(acct)
                                             return done()
                                         })
    })
    it('should get the tams sites that have not yet been imputed successfully for some reason in 2016',function(done){
        wim_sites.get_tams_need_imputing({'year':2016
                                          ,'config_file':config_file}
		                         ,function(e,r){
                                             should.not.exist(e)
                                             should.exist(r)
                                             r.should.have.property('rows').with.lengthOf(13)
                                             r.rows.forEach(function(d){
                                                 d.key.should.not.match(/finished/i)
                                                 return null
                                             })
                                             return done()
                                         })
    })
    it('should return nothing at all if date out of range',function(done){
        wim_sites.get_tams_need_imputing({'year':2024
                                          ,'config_file':config_file}
		                         ,function(e,r){
                                             should.not.exist(e)
                                             should.not.exist(r)
                                             return done()
                                         })
    })

    // it('should get all the tams sites that need plotting',function(done){
    //     wim_sites.get_tams_need_plotting({'year':2017
    //                                     ,'config_file':config_file}
    //                                    ,function(e,r){
    //                                         should.not.exist(e)
    //                                         should.exist(r)
    //                                         r.should.have.property('rows').with.lengthOf(25)
    //                                         //console.log(r)
    //                                         return done()
    //                                     })
    // })
    // it('should get all the tams sites that need pairing',function(done){
    //     wim_sites.get_tams_need_pairing({'year':2017
    //                                     ,'config_file':config_file}
    //                                    ,function(e,r){
    //                                         should.not.exist(e)
    //                                         should.exist(r)
    //                                         r.should.have.property('rows').with.lengthOf(86)
    //                                         //console.log(r)
    //                                         return done()
    //                                     })
    // })
    // it('should export the list of all TAMS sites known about',function(done){
    //     var sites = tams_sites.sites
    //     should.exist(sites)
    //     sites.should.have.lengthOf(117)

    //     sites.forEach(function(entry,i){
    //         entry.should.have.property('site')
    //         entry.should.have.property('site_name')
    //         return null
    //     })
    //     return done()
    // })
    // it('should get the list of merged tams/vds sites for a year',function(done){
    //     wim_sites.get_tams_merged({'year':2016
    //                               ,'config_file':config_file}
    //     			 ,function(e,r){
    //                                  should.not.exist(e)
    //                                  should.exist(r)
    //                                  r.should.have.property('rows')
    //                                      .with.lengthOf(85)
    //                                  //console.log(r)
    //                                  return done()
    //                              })
    // })

})
