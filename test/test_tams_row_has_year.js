const tap = require('tap')

const tams_row_has_year = require('../.').tams_row_has_year

const test_rows =
      [
          {
              "site": "10001",
              "table_data": {
                  "signaturearchive_201706_10001": {
                      "mintime": "2017-05-31 20:00:21.79",
                      "maxtime": "2017-06-23 00:59:53.547"
                  },
                  "signaturearchive_201705_10001": {
                      "mintime": "2017-04-30 20:00:09.371",
                      "maxtime": "2017-05-31 19:59:33.31"
                  },
                  "signaturearchive_10_2015": {
                      "mintime": "2015-10-09 16:41:09.838",
                      "maxtime": "2015-10-31 10:42:29.862"
                  },
                  "signaturearchive_11_2015": {
                      "mintime": "2015-11-02 12:22:36.914",
                      "maxtime": "2015-11-30 19:59:18.092"
                  },
                  "signaturearchive_12_2015": {
                      "mintime": "2015-12-11 03:01:56.507",
                      "maxtime": "2015-12-31 19:59:41.763"
                  },
                  "signaturearchive_1_2016": {
                      "mintime": "2015-12-31 20:00:26.138",
                      "maxtime": "2016-01-20 21:55:23.252"
                  },
                  "signaturearchive_201601_10001": {
                      "mintime": "2016-01-22 02:58:05.348",
                      "maxtime": "2016-01-31 19:59:58.904"
                  },
                  "signaturearchive_201602_10001": {
                      "mintime": "2016-01-31 20:00:00.826",
                      "maxtime": "2016-02-29 19:59:39.858"
                  },
                  "signaturearchive_201603_10001": {
                      "mintime": "2016-02-29 11:00:19.858",
                      "maxtime": "2016-03-31 19:59:40.844"
                  },
                  "signaturearchive_201604_10001": {
                      "mintime": "2016-03-31 20:00:11.546",
                      "maxtime": "2016-04-30 19:59:52.062"
                  },
                  "signaturearchive_201605_10001": {
                      "mintime": "2016-04-30 20:00:08.25",
                      "maxtime": "2016-05-31 19:59:23.974"
                  },
                  "signaturearchive_201606_10001": {
                      "mintime": "2016-05-31 20:00:23.349",
                      "maxtime": "2016-06-28 12:12:12.93"
                  },
                  "signaturearchive_201607_10001": {
                      "mintime": "2016-07-02 02:57:25.309",
                      "maxtime": "2016-07-31 19:59:14.891"
                  },
                  "signaturearchive_201608_10001": {
                      "mintime": "2016-07-31 20:00:10",
                      "maxtime": "2016-08-31 19:59:50.424"
                  },
                  "signaturearchive_201609_10001": {
                      "mintime": "2016-08-31 20:00:01.766",
                      "maxtime": "2016-09-30 19:59:59.128"
                  },
                  "signaturearchive_201610_10001": {
                      "mintime": "2016-09-30 20:00:00.595",
                      "maxtime": "2016-10-31 19:59:29.842"
                  },
                  "signaturearchive_201611_10001": {
                      "mintime": "2016-10-31 20:00:01.056",
                      "maxtime": "2016-11-30 19:59:57.444"
                  },
                  "signaturearchive_201612_10001": {
                      "mintime": "2016-11-30 20:00:55.055",
                      "maxtime": "2016-12-31 19:59:51.394"
                  },
                  "signaturearchive_201701_10001": {
                      "mintime": "2016-12-31 20:00:18.819",
                      "maxtime": "2017-01-07 23:19:30.029"
                  },
                  "signaturearchive_201702_10001": {
                      "mintime": "2017-02-13 10:20:11.557",
                      "maxtime": "2017-02-28 19:59:59.812"
                  },
                  "signaturearchive_201703_10001": {
                      "mintime": "2017-02-28 20:00:01.656",
                      "maxtime": "2017-03-31 19:59:56.254"
                  },
                  "signaturearchive_201704_10001": {
                      "mintime": "2017-03-31 20:00:20.622",
                      "maxtime": "2017-04-30 19:59:40.534"
                  },
                  "signaturearchive_3_2015": {
                      "mintime": "2015-03-25 18:06:13.257",
                      "maxtime": "2015-03-31 17:11:09.036"
                  },
                  "signaturearchive_4_2015": {
                      "mintime": "2015-04-01 08:38:22.486",
                      "maxtime": "2015-04-30 04:45:12.145"
                  },
                  "signaturearchive_5_2015": {
                      "mintime": "2015-05-01 03:06:32.642",
                      "maxtime": "2015-05-31 20:59:31.211"
                  },
                  "signaturearchive_6_2015": {
                      "mintime": "2015-05-31 21:00:09.118",
                      "maxtime": "2015-06-24 20:36:36.599"
                  },
                  "signaturearchive_9_2015": {
                      "mintime": "2015-09-15 02:57:04.526",
                      "maxtime": "2015-09-30 12:10:05.724"
                  }
              }
          },
          {
              "site": "10002",
              "table_data": {
                  "signaturearchive_201706_10002": {
                      "mintime": "2017-05-31 20:00:03.394",
                      "maxtime": "2017-06-23 00:59:59.6"
                  },
                  "signaturearchive_201705_10002": {
                      "mintime": "2017-04-30 20:00:00.896",
                      "maxtime": "2017-05-31 19:59:54.295"
                  },
                  "signaturearchive_10_2015": {
                      "mintime": "2015-10-09 16:02:46.871",
                      "maxtime": "2015-10-31 10:42:35.934"
                  },
                  "signaturearchive_11_2015": {
                      "mintime": "2015-11-02 12:22:25.171",
                      "maxtime": "2015-11-30 19:59:59.792"
                  },
                  "signaturearchive_12_2015": {
                      "mintime": "2015-12-09 12:00:02.907",
                      "maxtime": "2015-12-31 19:59:54.303"
                  },
                  "signaturearchive_1_2016": {
                      "mintime": "2015-12-31 20:00:04.164",
                      "maxtime": "2016-01-21 00:59:59.016"
                  },
                  "signaturearchive_201601_10002": {
                      "mintime": "2016-01-21 00:00:03.938",
                      "maxtime": "2016-01-31 19:59:58.421"
                  },
                  "signaturearchive_201602_10002": {
                      "mintime": "2016-01-31 20:00:00.891",
                      "maxtime": "2016-02-29 19:59:56.197"
                  },
                  "signaturearchive_201603_10002": {
                      "mintime": "2016-02-29 12:00:00.4",
                      "maxtime": "2016-03-31 19:59:59.79"
                  },
                  "signaturearchive_201604_10002": {
                      "mintime": "2016-03-31 20:00:00.556",
                      "maxtime": "2016-04-30 19:59:59.75"
                  },
                  "signaturearchive_201605_10002": {
                      "mintime": "2016-04-30 20:00:00.03",
                      "maxtime": "2016-05-31 19:59:58.397"
                  },
                  "signaturearchive_201606_10002": {
                      "mintime": "2016-05-31 20:00:00.677",
                      "maxtime": "2016-06-30 19:59:58.895"
                  },
                  "signaturearchive_201607_10002": {
                      "mintime": "2016-06-30 20:00:00.13",
                      "maxtime": "2016-07-31 19:59:59.936"
                  },
                  "signaturearchive_201608_10002": {
                      "mintime": "2016-07-31 20:00:01.842",
                      "maxtime": "2016-08-29 10:20:43.88"
                  },
                  "signaturearchive_201609_10002": {
                      "mintime": "2016-09-28 17:27:27.928",
                      "maxtime": "2016-09-30 19:59:57.756"
                  },
                  "signaturearchive_201610_10002": {
                      "mintime": "2016-09-30 20:00:00.444",
                      "maxtime": "2016-10-12 03:56:40.42"
                  },
                  "signaturearchive_201702_10002": {
                      "mintime": "2017-02-13 11:22:21.738",
                      "maxtime": "2017-02-28 19:59:59.083"
                  },
                  "signaturearchive_201703_10002": {
                      "mintime": "2017-02-28 20:00:00.65",
                      "maxtime": "2017-03-31 19:59:59.477"
                  },
                  "signaturearchive_201704_10002": {
                      "mintime": "2017-03-31 20:00:01.69",
                      "maxtime": "2017-04-30 19:59:59.709"
                  },
                  "signaturearchive_3_2015": {
                      "mintime": "2015-03-26 04:20:29.41",
                      "maxtime": "2015-03-31 17:11:19.618"
                  },
                  "signaturearchive_4_2015": {
                      "mintime": "2015-04-01 08:38:19.496",
                      "maxtime": "2015-04-30 20:59:58.813"
                  },
                  "signaturearchive_5_2015": {
                      "mintime": "2015-04-30 21:00:00.407",
                      "maxtime": "2015-05-31 14:31:16.486"
                  },
                  "signaturearchive_6_2015": {
                      "mintime": "2015-06-01 02:56:47.243",
                      "maxtime": "2015-06-25 01:03:41.441"
                  },
                  "signaturearchive_9_2015": {
                      "mintime": "2015-09-15 02:57:08.733",
                      "maxtime": "2015-09-30 12:09:56.463"
                  }
              }
          },
          {
              "site": "7005",
              "table_data": {
                  "signaturearchive_201602_7005": {
                      "mintime": "2016-02-23 08:09:21.716",
                      "maxtime": "2016-02-26 23:28:35.751"
                  },
                  "signaturearchive_201603_7005": {
                      "mintime": "2016-03-01 11:32:59.95",
                      "maxtime": "2016-03-31 19:59:59.387"
                  },
                  "signaturearchive_201604_7005": {
                      "mintime": "2016-03-31 20:00:00.403",
                      "maxtime": "2016-04-30 19:59:58.191"
                  },
                  "signaturearchive_201605_7005": {
                      "mintime": "2016-04-30 20:00:00.849",
                      "maxtime": "2016-05-31 19:59:59.154"
                  },
                  "signaturearchive_201606_7005": {
                      "mintime": "2016-05-31 20:00:00.434",
                      "maxtime": "2016-06-30 19:59:59.526"
                  },
                  "signaturearchive_201607_7005": {
                      "mintime": "2016-06-30 20:00:01.003",
                      "maxtime": "2016-07-31 19:59:59.483"
                  },
                  "signaturearchive_201608_7005": {
                      "mintime": "2016-07-31 20:00:00.274",
                      "maxtime": "2016-08-31 19:59:59.152"
                  },
                  "signaturearchive_201609_7005": {
                      "mintime": "2016-08-31 20:00:00.441",
                      "maxtime": "2016-09-30 19:59:59.822"
                  },
                  "signaturearchive_201610_7005": {
                      "mintime": "2016-09-30 20:00:00.071",
                      "maxtime": "2016-10-31 19:59:57.692"
                  },
                  "signaturearchive_201611_7005": {
                      "mintime": "2016-10-31 20:00:00.573",
                      "maxtime": "2016-11-30 19:59:59.785"
                  },
                  "signaturearchive_201612_7005": {
                      "mintime": "2016-11-30 20:00:00.553",
                      "maxtime": "2016-12-31 19:59:59.361"
                  },
                  "signaturearchive_201701_7005": {
                      "mintime": "2016-12-31 20:00:00.696",
                      "maxtime": "2017-01-31 19:59:59.509"
                  },
                  "signaturearchive_201702_7005": {
                      "mintime": "2017-01-31 20:00:00.062",
                      "maxtime": "2017-02-28 18:55:26.579"
                  },
                  "signaturearchive_201703_7005": {
                      "mintime": "2017-03-02 14:33:20.726",
                      "maxtime": "2017-03-31 19:59:59.498"
                  },
                  "signaturearchive_201704_7005": {
                      "mintime": "2017-03-31 20:00:02.055",
                      "maxtime": "2017-04-13 02:52:38.843"
                  }
              }
          },
          {
              "site": "7006",
              "table_data": {
                  "signaturearchive_201706_7006": {
                      "mintime": "2017-05-31 20:00:00.035",
                      "maxtime": "2017-06-23 00:59:56.46"
                  },
                  "signaturearchive_201602_7006": {
                      "mintime": "2016-02-23 10:30:03.981",
                      "maxtime": "2016-02-28 23:59:59.783"
                  },
                  "signaturearchive_201603_7006": {
                      "mintime": "2016-02-28 14:00:22.032",
                      "maxtime": "2016-03-31 19:59:58.687"
                  },
                  "signaturearchive_201604_7006": {
                      "mintime": "2016-03-31 20:00:00.169",
                      "maxtime": "2016-04-30 19:59:58.947"
                  },
                  "signaturearchive_201605_7006": {
                      "mintime": "2016-04-30 20:00:03.305",
                      "maxtime": "2016-05-31 19:59:58.953"
                  },
                  "signaturearchive_201606_7006": {
                      "mintime": "2016-05-31 20:00:00.3",
                      "maxtime": "2016-06-30 13:30:35.102"
                  },
                  "signaturearchive_201607_7006": {
                      "mintime": "2016-07-01 02:57:26.278",
                      "maxtime": "2016-07-31 19:59:59.776"
                  },
                  "signaturearchive_201608_7006": {
                      "mintime": "2016-07-31 20:00:00.285",
                      "maxtime": "2016-08-31 19:59:56.343"
                  },
                  "signaturearchive_201609_7006": {
                      "mintime": "2016-08-31 20:00:00.018",
                      "maxtime": "2016-09-30 19:59:58.774"
                  },
                  "signaturearchive_201610_7006": {
                      "mintime": "2016-09-30 20:00:01.904",
                      "maxtime": "2016-10-31 19:59:59.261"
                  },
                  "signaturearchive_201611_7006": {
                      "mintime": "2016-10-31 20:00:00.651",
                      "maxtime": "2016-11-30 19:59:59.34"
                  },
                  "signaturearchive_201612_7006": {
                      "mintime": "2016-11-30 20:00:00.653",
                      "maxtime": "2016-12-31 19:59:59.679"
                  },
                  "signaturearchive_201701_7006": {
                      "mintime": "2016-12-31 20:00:00.316",
                      "maxtime": "2017-01-31 19:59:59.786"
                  },
                  "signaturearchive_201702_7006": {
                      "mintime": "2017-01-31 20:00:00.32",
                      "maxtime": "2017-02-28 19:59:58.99"
                  },
                  "signaturearchive_201703_7006": {
                      "mintime": "2017-02-28 20:00:00.139",
                      "maxtime": "2017-03-31 19:59:59.874"
                  },
                  "signaturearchive_201704_7006": {
                      "mintime": "2017-03-31 20:00:00.313",
                      "maxtime": "2017-04-30 19:59:59.791"
                  },
                  "signaturearchive_201705_7006": {
                      "mintime": "2017-04-30 20:00:00.651",
                      "maxtime": "2017-05-31 19:59:57.846"
                  }
              }
          }]

// the 7005, 7006 do not have 2015

tap.plan(4)

tap.ok(tams_row_has_year,'the tams_row_has_year function exists')
const check_2015 = tams_row_has_year(2015)
tap.ok(check_2015,'can create a function for checking a particular year')
const checked_2015 = tams_row_has_year(2015,test_rows[0])
tap.ok(checked_2015,'can also check a year, row combination')

tap.test('returns right answers',(t)=>{
    t.ok(check_2015(test_rows[0]),'10001 has 2015 data')
    t.ok(check_2015(test_rows[1]),'10002 has 2015 data')
    t.notOk(check_2015(test_rows[2]),'7005 does not have 2015 data')
    t.notOk(check_2015(test_rows[3]),'7006 does not have 2015 data')
    t.end()
})
