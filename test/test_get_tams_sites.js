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


tap.test('functions exist',function (t) {
    t.plan(3)
    t.ok( wim_sites.get_tams_need_imputing,'get_tams_need_imputing exists')
    t.ok( wim_sites.get_tams_imputed_status,'get_tams_imputed_status exists')
    t.ok( wim_sites.tams_sitelist,'tams_sitelist exists')
    t.end()
})

tap.test('should export the list of all TAMS sites known about',(t)=>{
    var sites = wim_sites.tams_sitelist
    t.ok(sites)
    t.is(sites.length,116)
    sites.forEach(function(entry,i){
        t.ok(entry.site)
        t.ok(entry.table_data)
        Object.keys(entry.table_data).forEach(table=>{
            const details = entry.table_data[table]
            t.ok(details.mintime)
            t.ok(details.maxtime)
        })
        return null
    })
    t.end()
    return null
})

const tests = async (_config ) => {

    await tap.test(function need_imputing_2016(t) {
        return promise_wrapper(
            wim_sites.get_tams_need_imputing
            ,{'year':2016
              ,'couchdb':_config.couchdb}
        ).then((r)=>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,1,'got 1 tams sites that need imputing still')
            t.is(r.rows[0],'7005')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })
    await tap.test(function need_imputing_2017(t) {
        return promise_wrapper(
            wim_sites.get_tams_need_imputing
            ,{'year':2017
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            // expect no result, as 2017 is out of range
            t.ok(r.rows)
            t.is(r.rows.length,0,'got 0 tams sites that need imputing still')
            t.end()
            return null
        }).catch( err => {
            console.log(err)
            throw new Error(err)
        })
    })
    await tap.test(function need_imputing_2027(t) {
        return promise_wrapper(
            wim_sites.get_tams_need_imputing
            ,{'year':2027
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
    await tap.test('should get the imputed status of all the tams sites 2017',(t)=>{
        return promise_wrapper(
            wim_sites.get_tams_imputed_status
            ,{'year':2017
              ,'couchdb':_config.couchdb}
        ).then( (r) =>{
            t.ok(r)
            t.ok(r.rows)
            //console.log(r.rows)
            t.is(r.rows.length,2,'got all imputed status 2017')
            const acct ={}
            r.rows.forEach((d) => {
                if(acct[d.key[1]] === undefined){
                    acct[d.key[1]] = 1
                }else{
                    acct[d.key[1]]++
                }
            })
            // should be sorted in id order, according to couchdb docs
            t.is(r.rows[0].id,'tams.7005.E')
            t.is(r.rows[1].id,'tams.7005.W')
            t.is(acct.finished,2,'2 finished entries')
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
