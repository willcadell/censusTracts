var mapnik = require('mapnik');
var mercator = require('./sphericalmercator');
var url = require('url');
var fs = require('fs');
var http = require('http');
var parseXYZ = require('./tile.js').parseXYZ;
var path = require('path');
var port = 30191;
var TMS_SCHEME = false;

// change this to fit your db connection and settings
var postgis_settings = {
  'host' : 'localhost',
  'dbname' : 'sparkgeo_census',
  'table' : 'censustracts900913',
  'user' : 'sparkgeo_census',
  'password' : 'sparkgeo_census',
  'type' : 'postgis',
  'initial_size' : '10',
 'estimate_extent' : '1'
};

http.createServer(function(req, res) {
  parseXYZ(req, TMS_SCHEME, function(err,params) {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end(err.message);
    } else {
      try {
        var map = new mapnik.Map(256, 256, mercator.proj4);
        var layer = new mapnik.Layer('tile', mercator.proj4);
        var postgis = new mapnik.Datasource(postgis_settings);
  
        var bbox = mercator.xyz_to_envelope(parseInt(params.x),
                                               parseInt(params.y),
                                               parseInt(params.z), false);
        
		layer.datasource = postgis;
        layer.styles = ['polygon'];

        map.bufferSize = 0;
        map.load(path.join(__dirname, 'tile_symbols.xml'), {strict: true}, function(err,map) {
            if (err) throw err;
            map.add_layer(layer);
             //console.log(map.toXML()); // Debug settings
            map.extent = bbox;
            var im = new mapnik.Image(map.width, map.height);
            map.render(im, function(err, im) {
              if (err) {
                throw err;
              } else {
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.end(im.encodeSync('png'));
              }
            });	
        });
		
      }
      catch (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err.message);
      }
    }
  });
}).listen(port);

console.log('Server running on port %d', port);
