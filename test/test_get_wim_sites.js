/* global require console process describe it */

const tap = require('tap')

var wim_sites = require('../.')
var path      = require('path')
var rootdir   = path.normalize(__dirname)


var config_file = rootdir+'/../test.config.json'
const config_okay = require('config_okay')
const utils =  require('./couch_utils.js')
const demo_db_before = utils.demo_db_before
const demo_db_after = utils.demo_db_after

tap.plan(6)

tap.test('functions exist',function (t) {
    t.plan(6)
    t.ok( wim_sites.get_wim_need_imputing,'get_wim_need_imputing exists')
    t.ok( wim_sites.get_wim_need_plotting,'get_wim_need_plotting exists')
    t.ok( wim_sites.get_wim_need_pairing,'get_wim_need_pairing exists')
    t.ok( wim_sites.sites ,'  sites exists')
    t.ok( wim_sites.get_wim_imputed_status,'get_wim_imputed_status exists')
    t.ok( wim_sites.get_wim_merged,'get_wim_merged exists')
    t.end()
})

const tests = async (_config ) => {

    await tap.test('get sites that need imputing',async (t)=> {
        const r = await wim_sites.get_wim_need_imputing({'year':2007
                                   ,'config_file':config_file})
        t.ok(r)
        t.ok(r.rows)
        t.is(r.rows.length,25,'got 25 wim sites that need imputing still')
        t.end()
        return null
    })
    await tap.test('get all the wim sites that need plotting',async (t) => {
        const r = await wim_sites.get_wim_need_plotting({'year':2008
                                                         ,'config_file':config_file})
        t.ok(r)
        t.ok(r.rows)
        t.is(r.rows.length,25,'got 25 sites that need plotting')
        t.end()
        return null
    })
    // it('should get all the wim sites that need pairing',function(done){
    //     wim_sites.get_wim_need_pairing({'year':2007
    //                                     ,'config_file':config_file}
    //                                    ,function(e,r){
    //                                         should.not.exist(e)
    //                                         should.exist(r)
    //                                         r.should.have.property('rows').with.lengthOf(86)
    //                                         //console.log(r)
    //                                         return done()
    //                                     })
    // })
    // it('should export the list of all WIM sites known about',function(done){
    //     var sites = wim_sites.sites
    //     should.exist(sites)
    //     sites.should.have.lengthOf(117)

    //     sites.forEach(function(entry,i){
    //         entry.should.have.property('site')
    //         entry.should.have.property('site_name')
    //         return null
    //     })
    //     return done()
    // })
    // it('should get the imputed status of all the wim sites 2012',function(done){
    //     wim_sites.get_wim_imputed_status({'year':2012
    //                                       ,'config_file':config_file}
    //     				 ,function(e,r){
    //                                          var acct = {}
    //                                          should.not.exist(e)
    //                                          should.exist(r)
    //                                          r.should.have.property('rows').with.lengthOf(165)
    //                                          r.rows.forEach(function(d){
    //                                              if(acct[d.key[1]] === undefined){
    //                                                  acct[d.key[1]] = 1
    //                                              }else{
    //                                                  acct[d.key[1]]++
    //                                              }
    //                                          })
    //                                          acct.finished.should.eql(140)
    //                                          //console.log(acct)
    //                                          return done()
    //                                      })
    // })
    // it('should get the wim sites that have not yet been imputed successfully for some reason in 2012',function(done){
    //     wim_sites({'year':2012
    //                ,'config_file':config_file}
    //     	  ,function(e,r){
    //                   should.not.exist(e)
    //                   should.exist(r)
    //                   r.should.have.property('rows').with.lengthOf(13)
    //                   r.rows.forEach(function(d){
    //                       d.key.should.not.match(/finished/i)
    //                       return null
    //                   })
    //                   return done()
    //               })
    // })
    // it('should return nothing at all if date out of range',function(done){
    //     wim_sites({'year':2014
    //                ,'config_file':config_file}
    //     	  ,function(e,r){
    //                   should.not.exist(e)
    //                   should.not.exist(r)
    //                   return done()
    //               })
    // })
    // it('should get the list of merged wim/vds sites for a year',function(done){
    //     wim_sites.get_wim_merged({'year':2012
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
    return tap.end()
}
config_okay(config_file)
    .then( async (config) => {
        // first set up the db
        // then run the tests
        // then tear down the db
        console.log(config)
        const date = new Date()
        const test_db_unique = [config.couchdb.db,
                                date.getHours(),
                                date.getMinutes(),
                                date.getSeconds(),
                                date.getMilliseconds()].join('-')
        config.couchdb.db = test_db_unique
        try {
            await demo_db_before(config)

            //await tests(config)

            // await demo_db_after(config)
        }catch (e){
            console.log(e)
            await demo_db_after(config)
        }

    })
    .catch( err => {
        console.log(err)
        throw new Error(err)
    })
