const tap = require('tap')

var wim_sites = require('../.')
var path      = require('path')
var rootdir   = path.normalize(__dirname)


var config_file = rootdir+'/../test.config.json'
const config_okay = require('config_okay')
const utils =  require('./couch_utils.js')
const demo_db_before = utils.demo_db_before
const demo_db_after = utils.demo_db_after

tap.plan(2)


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
    t.plan(1)
    t.ok( wim_sites.set_tams_data_state,'set_tams_data_state exists')
    t.end()
})


const tests = async (_config ) => {

    await tap.test(function set_data_state(t) {
        return promise_wrapper(
            wim_sites.get_tams_need_imputing
            ,{'year':2016
              ,'couchdb':_config.couchdb}
        ).then((r)=>{
            t.ok(r)
            t.ok(r.rows)
            t.is(r.rows.length,1,'got 1 tams sites that need imputing still')
            t.is(r.rows[0],'7005')
            return null
        }).then(()=>{
            // now, set a new data state
            const new_doc = 'tams.4001'
            const year = 2016
            const value = [
                [
                    "signaturearchive_201607_4001",
                    {
                        "maxtime" : "2016-07-31 19:59:59.428",
                        "mintime" : "2016-07-18 11:09:12.207"
                    }
                ],
                [
                    "signaturearchive_201608_4001",
                    {
                        "mintime" : "2016-07-31 20:00:02.492",
                        "maxtime" : "2016-08-31 19:59:59.819"
                    }
                ],
                [
                    "signaturearchive_201609_4001",
                    {
                        "maxtime" : "2016-09-30 19:59:59.988",
                        "mintime" : "2016-08-31 20:00:00.86"
                    }
                ],
                [
                    "signaturearchive_201610_4001",
                    {
                        "mintime" : "2016-09-30 20:00:00.295",
                        "maxtime" : "2016-10-31 19:59:59.885"
                    }
                ],
                [
                    "signaturearchive_201611_4001",
                    {
                        "maxtime" : "2016-11-30 19:59:59.947",
                        "mintime" : "2016-10-31 20:00:02.332"
                    }
                ],
                [
                    "signaturearchive_201612_4001",
                    {
                        "maxtime" : "2016-12-31 19:59:59.678",
                        "mintime" : "2016-11-30 20:00:02.557"
                    }
                ]
            ]
            return wim_sites.set_tams_data_state({'doc':new_doc
                                                  ,'couchdb':_config.couchdb}
                                                 ,year, value
                                                )

        }).then( () =>{
            // now should see new docs
            return promise_wrapper(
                wim_sites.get_tams_need_imputing
                ,{'year':2016
                  ,'couchdb':_config.couchdb}
            )
        }).then((r)=>{
            t.ok(r)
            t.ok(r.rows)
            // console.log(r.rows)
            t.is(r.rows.length,2,'got 2 tams sites that need imputing still')
            t.is(r.rows[0],'4001')
            t.is(r.rows[1],'7005')
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
