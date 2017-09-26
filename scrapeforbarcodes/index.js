const request = require('request');
const cheerio = require('cheerio')

request('https://github.com/artoolkit/artoolkit5/tree/master/doc/patterns/Matrix%20code%203x3%20(72dpi)', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var filenames = [];
        $('tr.js-navigation-item').each(function(i, element){
            filenames.push($(this).children('.content').children().children().attr('href'))
        });
        // console.log(filenames)
        filenames.map(function(x) {
            request('https://github.com/'+x, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html);
                    var downloadNames = []
                    $('#raw-url').each(function(i, element){
                        downloadNames.push($(this).attr('href'))
                    });

                    downloadNames.map(function(url) {
                        let urlList = url.split('/');
                        let title = urlList[8].split('.')
                        let urlName = 'http://github.com/'+url

                        return download(urlName, title[0])
                    })
                }
            })
        });
    }
});


function download(downloadURL, title) {
    var fs = require('fs');
    request.get({url: downloadURL, encoding: 'binary'}, (err, res) => {
        if ( !err && res.statusCode == 200)
        fs.writeFile(title+'.png', res.body, {encoding: 'binary'})
    })
}