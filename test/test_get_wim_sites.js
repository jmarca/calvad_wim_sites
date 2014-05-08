/* global require console process describe it */

var should = require('should')
var wim_sites = require('../wim_sites')
var path    = require('path')
var rootdir = path.normalize(__dirname)

var config_okay = require('config_okay')

var config_file = rootdir+'/../test.config.json'
var config={}

describe('get sites',function(){
    it('should get all the wim sites',function(done){
        wim_sites({'year':2007
                  ,'config_file':config_file}
                 ,function(e,r){
            should.not.exist(e)
            should.exist(r)
            console.log(r)
            return done()
        })
    })
})
