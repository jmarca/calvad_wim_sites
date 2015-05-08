# Tiny repo to list wim sites from couchdb, postgres

I am resisting bloating up impute_missing repo by putting this here.

The goal is to write some small, tested code that loads wim sites.

It should load wim sites that need imputing for a given year

It should load wim sites that need graphics processing for a given
year

# I need to add the raw views to this

You can't do anything if the views do not exist in the db, so I should
put them here, and on initial load, do a quick check to make sure they
are there, and if not, save the views and trigger them.

# required

config.json needs to point to a valid couchdb instance:

{
    "couchdb": {
        "host": "http://192.168.0.1",
        "port":5984,
        "db": "vdsdata%2ftracking",
        "auth":{"username":"blechity",
                "password":"blackity bloo"
               }
    }
}

# tests

Test require the same, but in a file called `test.config.json`
