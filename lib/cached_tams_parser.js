const filename = './cached_tables.json'
const outputfilename = './tams_archive_tables_rewritten.json'
const fs = require('fs')


function readme(){
    return new Promise( (resolve,reject) =>{
        fs.readFile(filename, 'utf8', function (err, data) {
            if (err){
                console.log(err)
                reject( err )
            }
            resolve(data)
        })
    })
}

function writeme(data){
    return new Promise( (resolve,reject) =>{
        fs.writeFile(outputfilename, data, 'utf8', (err) => {
            if (err){
                console.log(err)
                reject( err )
            }
            resolve()
        })
    })
}


readme()
    .then( async (data) => {
        const cache = JSON.parse(data)
        // the default cached tams table output I've generated as a
        // JSON file in tams_classification is super !@#$$@ annoying!!
        //
        // this fixes that situation
        //
        // peel the onion of arrays of arrays
        const onion1 = cache[0]
        const header = onion1[0]
        const onion2 = onion1[1]
        console.log(onion2.length)
        const tams_data = {}
        onion2.forEach( layer => {
            const id = layer[0]
            const info = layer[1] // an array of arrays
            //console.log(id)
            if(tams_data[id]===undefined){
                tams_data[id] = {}
            }
            info.forEach( entry => {
                const db_table = entry[0]
                const db_times = entry[1]
                tams_data[id][db_table] = db_times
                return null
            })
            return null
        })
        // reorganize one more time
        const dumpworthy = []
        const keys = Object.keys(tams_data)
        keys.sort().forEach(k=>{
            dumpworthy.push(Object.assign({},{'site':k,'table_data':tams_data[k]}))
        })
        //console.log(tams_data)
        await writeme(JSON.stringify(dumpworthy))
      })
      .catch( e => {
          throw new e
      })
