// function to look at tams data to determine if the given row has the
// given year

function year_in_table_range(year){
    const yr_match = new RegExp('^'+year+'-')
    return (range)=>{
        return yr_match.test(range.mintime) ||
            yr_match.test(range.maxtime)
    }
}


/**
 * row_has_year
 *
 * Look through the given row to determine if it contains any data for
 * the passed in year
 *
 * @param {integer} year
 * @param {Object} row --- must look pretty much like what you find in
 * this module's tams_sitelist
 */
function row_has_year(year,row){
    const testyear = year_in_table_range(year)
    const checker =  (row)=>{
        const values = Object.values(row.table_data)
        return values.some(testyear)
    }

    if(row === undefined){
        return checker
    }else{
        return checker(row)
    }
}


module.exports = row_has_year
