const urlencode = require('urlencode')
const mysql = require('mysql2/promise')
const superagent = require('superagent')
const superagentCharset = require('superagent-charset')
const request = superagentCharset(superagent)
const cheerio = require('cheerio')
const _  = require('lodash')
const sleep = require('sleep')
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const config = require('./config')


const url = 'http://search.anccnet.com/searchResult2.aspx'

// console.log(entities.decode('d&#39;POLO STYL  HOMME 1'))
// console.log(_.isEmpty([]))

// simple query
/*connection.query('SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45', function (err, results, fields) {
  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra meta data about results, if available
});*/

/*connection.query('SELECT * FROM `2010` WHERE `name` = ? AND `cas` = ?', ['紫虫胶蜡', '97766-50-2'], function (err, results) {
  console.log(results);
  
  connection.close()
});*/


start()

async function start() {
  try {
    const connection = await mysql.createConnection({host:config.mysql_host, user: config.mysql_user, password: config.mysql_password, database: config.mysql_database})
    const [rows, fields] = await connection.query('SELECT productName FROM `cosmetic_list` WHERE is_off= 0 AND barcode IS NULL ORDER BY provinceConfirm DESC')
    // console.log(rows)

    // const productName = '嘉丝肤缇淡纹赋活感温凝胶眼膜'
    // let keyword = urlencode(productName, 'gbk')
    // let products = await sendRequest(url, keyword)
    // console.log(products)
    while(rows.length > 0) {
      // console.log(results.length)
      // console.log(results.splice(0, 1))
      const productName = rows.splice(0, 1)[0]['productName']
      const pname = entities.decode(productName)
      const keyword = urlencode(pname, 'gbk')
      console.log(pname)
      let times = Math.floor(Math.random() * 5) + 1
      console.log(times)
      sleep.sleep(times)
      let products = await sendRequest(url, keyword)
      console.log(products)
      if (!_.isEmpty(products) && pname == products[0][1]) {
        console.log('##########')
        console.log(products[0][1])
        await connection.query("UPDATE `cosmetic_list` SET `barcode` = '"+ products[0][0] +"', `spec_model` = '"+ products[0][2] +"' ,`desc` = '"+ products[0][3] +"' WHERE `productName` = '"+ productName +"'")
      }
    }
  } catch (e) {
    console.error(e)
  }
}


function sendRequest(url, keyword) {

  return request.get(url + '?keyword='+ keyword)
    // .query({ keyword: keyword })
    .charset('gbk')
    .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3044.0 Safari/537.36')
    .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
    .set('Cookie', 'ASP.NET_SessionId=prmiod45rlftxu455fakg4uq; Hm_lvt_6687bbab0a48629fa014a8b18cff55a9=1491815447,1491815453,1491816235,1492094480; Hm_lpvt_6687bbab0a48629fa014a8b18cff55a9=' + parseInt(Date.now/1000))
    .retry(5)
    .then((res) => {
      // return res.text
      console.log(res.text)
      let $ = cheerio.load(res.text, { decodeEntities: false})
      // let $result = $('.mainlist a .texts').children('h3').text()
      let $result = $('#results .result .p-info') // .children('dd')
      let products = []
      $result.each(function(index, ele) {
        products.push($(this).children('dd').text().split(' '))
        console.log($(this).prev().children('dd').text().split(' '))
        console.log($(this).children('dd').text().split(' '))
        // console.log(index)
      })
      // console.log(products)
      return products
    }).catch(err => {
      console.error(err)
    })
}

