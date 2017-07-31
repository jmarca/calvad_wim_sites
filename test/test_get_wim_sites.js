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

tap.plan(10)

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

function promise_wrapper(fn,arg){
    return new Promise((resolve, reject)=>{
        fn(arg,function(e,r){
            if(e){
                // console.log(e)
                return reject(e)
            }else{
                // console.log(r)
                return resolve(r)
            }
        })
    })
}

const tests = async (_config ) => {

    await tap.test(function need_imputing_2007(t) {
        return promise_wrapper(
            wim_sites.get_wim_need_imputing
            ,{'year':2007
              ,'couchdb':_config.couchdb}
        ).then((r)=>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,0,'got 0 wim sites that need imputing still')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })
    await tap.test(function need_imputing_2017(t) {
        return promise_wrapper(
            wim_sites.get_wim_need_imputing
            ,{'year':2017
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            // expect no result, as 2017 is out of range
            t.notOk(r)
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })
    await tap.test(function need_plotting_2008(t) {
        return promise_wrapper(
            wim_sites.get_wim_need_plotting
            ,{'year':2008
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,1,'got 1 wim sites that need plotting still')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })


    await tap.test('get all the wim sites that need plotting', (t)=>  {
        return promise_wrapper(
            wim_sites.get_wim_need_plotting
            ,{'year':2008
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,1,'got 1 sites that need plotting')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })

    await tap.test('get all the wim sites that need pairing',(t)=>{
        return promise_wrapper(
            wim_sites.get_wim_need_pairing
            ,{'year':2012
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,3,'got sites needing pairing')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })
    tap.test('should export the list of all WIM sites known about',(t)=>{
        var sites = wim_sites.sites
        t.ok(sites)
        t.is(sites.length,117)
        sites.forEach(function(entry,i){
            t.ok(entry.site)
            t.ok(entry.site_name)
            return null
        })
        t.end()
        return null
    })
    await tap.test('should get the imputed status of all the wim sites 2008',(t)=>{
        return promise_wrapper(
            wim_sites.get_wim_imputed_status
            ,{'year':2008
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,2,'got all imputed status 2008')
            const acct ={}
            r.rows.forEach((d) => {
                if(acct[d.key[1]] === undefined){
                    acct[d.key[1]] = 1
                }else{
                    acct[d.key[1]]++
                }
            })
            t.is(acct.finished,2,'2 finished entries')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })

    await tap.test('should get the wim sites that have not yet been imputed successfully for some reason in 2012',(t)=>{
        return promise_wrapper(
            wim_sites.get_wim_need_imputing
            ,{'year':2012
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,3,'still to do 3 in 2012')
            r.rows.forEach((d)=>{
                t.notMatch(d.key,/finished/i)
                return null
            })
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })

    await tap.test('should get the list of merged wim/vds sites for a year',(t)=>{
        return promise_wrapper(
            wim_sites.get_wim_merged
            ,{'year':2012
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,1,'1 merged in 2012')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })
    tap.end()

}
config_okay(config_file)
    .then( async (config) => {
        // first set up the db
        // then run the tests
        // then tear down the db
        // console.log(config)
        const date = new Date()
        const test_db_unique = [config.couchdb.db,
                                date.getHours(),
                                date.getMinutes(),
                                date.getSeconds(),
                                date.getMilliseconds()].join('-')
        config.couchdb.db = test_db_unique
        try {
            await demo_db_before(config)

            await tests(config)

            await demo_db_after(config)
        }catch (e){
            console.log(e)
            await demo_db_after(config)
        }

    })
    .catch( err => {
        console.log(err)
        throw new Error(err)
    })
