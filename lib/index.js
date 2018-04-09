var request = require('request');
var slugify = require('slugify');
var marked = require('marked');
var type = require('component-type');
var querystring = require('query-string');

module.exports = plugin;

function buildPinboardURL(options) {
    let pinboardObj = {};

    if (!options.username) {
        return pinboardURL = 'https://feeds.pinboard.in/json/popular'
    } else {
        try {
            if (type(options.count) === 'number') {
                pinboardObj['count'] = '?count='+options.count;
            } else {
                throw new Error('Count must be an integer');
            }

            if (type(options.username) === 'string') {
                pinboardObj['username'] = options.username;
            } else {
                throw new Error('username must be a string');
            }

            if (type(options.tags) === 'array') {
                if (options.tags.length === 0) {
                    pinboardObj['tags'] = [];
                }
                else if (options.tags.length <= 3) {
                    pinboardObj['tags'] = '';

                    options.tags.forEach(element => {
                        pinboardObj['tags'] += 't:' + element + '/';
                    });
                } 
                else {
                    throw new Error('Only 3 items allowed in the tags array');
                }
            } else {
                throw new Error('tags must be an array');
            }

            return `https://feeds.pinboard.in/json/u:${pinboardObj['username']}/${pinboardObj['tags']}${pinboardObj['count']}`;
        } 
        
        catch(err) {
            console.error(err);
        } 
    }
}


function plugin(options) {
    options = options || {};

    return function (files, metalsmith, done) {
        let pinboardData = [];

        request.get({url: buildPinboardURL(options), json: true}, (err, response) => {
            let pinboardData = response.body;

            let prefix = 'bookmarks';

            for (var i = 0, len = pinboardData.length; i < len; i++) {
                let filename = slugify(pinboardData[i]['u'], {
                    replacement: '-',
                    lower: true,
                    remove: /[$*_+~.()'"!\-/:@]/g
                  });

                filename = `${prefix}/${filename}.${options.type}`;
                let content = '';

                if (pinboardData[i]['n']) {
                    content = pinboardData[i]['n'];
                }

                if (options.type === 'md') {
                    marked(content);
                }
                
                files[filename]= {};
                files[filename]['title'] = pinboardData[i]['d'];
                files[filename]['contents'] = Buffer.from(content, 'utf8' );
                files[filename]['date'] = pinboardData[i]['dt'];
                files[filename]['slug'] = options.slug || filename;
                files[filename]['sourceurl'] = pinboardData[i]['u'];
            }

            setImmediate(done);
        });

    }
}