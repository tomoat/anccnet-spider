const Xray = require('x-ray')
const x = Xray()

x('https://blog.ycombinator.com/', '.post', [{
  title: 'h1 a',
  link: '.article-title@href'
}])
  .paginate('.nav-previous a@href')
  .limit(3)
  .write('results.json')


x('http://stackoverflow.com/questions', '#questions .question-summary .summary', [{

  title: 'h3',
  link: 'h3 a@href',
  details: x('h3 a@href', {
    title: 'h1',
    question: '.question .post-text',
  })

}])
  .write('results2.json')
/*(function(err, obj) {

  console.log(err);
  console.log(obj);

})*/