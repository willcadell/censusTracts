censusTracts
============

from <a href="http://www.sparkgeo.com/labs/big">this Sparkgeo labs page </a>

a census tract visualisation example using node, mapnik and postgis

<div class="row">
<div class="grid-9">
<p>There are two key features of web mapping. The first is that the interface is resources constrained; it is a browser. The second is that generally you are expected to be able to drive as much data and functionality to that browser as you would expect on a desktop product. In fact, the user doesn't even want to consider how difficult it is to achieve a smooth, immersive map-based experience, they just want to experience what the map is showing them.</p>
<p>This tutorial will attempt to indicate a way of displaying a large number of polygons on a Google Map. We will avoid the use of very large caches in lieu of node.js. We will build on what we learned about <a href="http://www.sparkgeo.com/blog/building-a-us-census-tracts-postgis-database/">building a US Census Tract Database</a> in an earlier blog post. </p>

</div>
<div class="grid-3">
  <strong>Technologies We'll Use:</strong>
	<ul>
		<li><a href="http://www.postgis.net">PostGIS</a></li>
		<li><a href="http://www.mapnik.org">Mapnik</a></li>
		<li><a href="http://www.nodejs.org">Node.js</a></li>
		<li><a href="https://github.com/mapnik/node-mapnik">Node-Mapnik</a></li>
		<li><a href="http://www.mapbox.com/wax/">Wax</a></li>
		<li><a href="https://developers.google.com/maps/">Google Maps</a></li>
		<li><a href="http://www.webfaction.com?affiliate=sparkgeo">Webfaction</a></li>
	</ul>
	<p>Holy smokes that's a lot, but don't worry, it'll be ok...</p>
</div>
</div>

<p>This is what we are shooting for, its a Google map with the 70,000 or so US Census Tract polygons overlaid on top:</p>

<div class="row">
	<iframe class="grid-12" src="http://snippets.sparkgeo.com/census" frameborder="0" height="500px"></iframe>
</div>
<hr class="row-divider">
<strong>Points To Note</strong>
<p>There is no cache, we will not be "optimizing" this system at all. A great deal can be done with node and node-mapnik but this example uses both of these technologies in the most crude of manners. So that means you can take this much further if you want to take the wheels off and have a proper look. additionally the styling is also somewhat bleak, Mapnik provides a vast array of styling options. This example stays very simple.</p>
<hr class="row-divider" />
<strong>Installs</strong>
<p> You will have to have an array of software available on your development machine to get this tutorial running. The list is written out above. My recommendation, if you are starting from scratch is to first look at PostGIS and then Mapnik. For this example we are using the census tract data provided by the <a href="http://www.census.gov/">US Census Bureau</a> and assembled in <a href="http://www.sparkgeo.com/blog/building-a-us-census-tracts-postgis-database/">this earlier Sparkgeo blog post</a>
</p>
<p>So shoot for this order:</p>
<center><p><strong>PostGIS</strong> > <strong>Mapnik</strong> > <strong>Node</strong> > <strong>Node-Mapnik</strong></p></center>
<p>the other pieces to this are javascript libraries which need to be available to the client. So that means you point at Google Maps in the usual documented manner, and you need to download the <a href="http://www.mapbox.com/wax/">Wax libraries</a> and point to them as you would any other javascript file.</p>
<p> I will certainly not be able to provide better information on installation than those provided by each of the excellent authors. I will however suggest that you try this on a linux based machine. Ideally ubuntu is a good bet. I have successfully done this on a mac and on CentOS (thanks to the support team at <a href="http://www.webfaction.com?affiliate=sparkgeo">Webfaction</a>). I have not attempted this in a windows environment.</p>
<hr class="row-divider" />
<strong>Checks</strong>
<p>Ok, so you have managed to install the above softwares. lets do a couple of checks...</p>
<pre>
[will]$ node
> console.log("hello world");
hello world
undefined
> process.exit();
[will]$
</pre>
<p>Sweet, node works</p>
<pre>[will]$ mapnik-config
Usage: mapnik-config [OPTION]

Known values for OPTION are:

  -h --help         display this help and exit
  -v --version      version information (MAPNIK_VERSION_STRING)
  --version-number  version number (MAPNIK_VERSION) (new in 2.2.0)
  --git-revision    git hash from "git rev-list --max-count=1 HEAD"
  --git-describe    git decribe output (new in 2.2.0)
  --fonts           default fonts directory
  --input-plugins   default input plugins directory
  --defines         pre-processor defines for Mapnik build (new in 2.2.0)
  --prefix          Mapnik prefix [default /home/sparkgeo/mapnik]
  --lib-name        Mapnik library name
  --libs            library linking information
  --dep-libs        library linking information for Mapnik dependencies
  --ldflags         library paths (-L) information
  --includes        include paths (-I) for Mapnik headers (new in 2.2.0)
  --dep-includes    include paths (-I) for Mapnik dependencies (new in 2.2.0)
  --cxxflags        c++ compiler flags and pre-processor defines (new in 2.2.0)
  --cflags          all include paths, compiler flags, and pre-processor defines (for back-compatibility)
  --cxx             c++ compiler used to build mapnik (new in 2.2.0)
  --all-flags       all compile and link flags (new in 2.2.0)
[will]$ 
</pre>
<p>And we have Mapnik running too. Next:</p>
<pre>
[will]$ node
> var mapnik = require('mapnik');
undefined
> mapnik
{ register_datasources: [Function],
  datasources: [Function],
  register_fonts: [Function],
  fonts: [Function],
  fontFiles: [Function],
  clearCache: [Function],
  gc: [Function],
  Map: [Function: Map],
  Color: [Function: Color],
  Geometry: 
   { [Function: Geometry]
     Point: 1,
     LineString: 2,
     Polygon: 3 },
  Feature: [Function: Feature],
  Image: { [Function: Image] open: [Function] },
  ImageView: [Function: ImageView],
  Palette: [Function: Palette],
  Projection: [Function: Projection],
  ProjTransform: [Function: ProjTransform],
  Layer: [Function: Layer],
  Grid: { [Function: Grid] base_mask: -9223372036854776000 },
  GridView: [Function: GridView],
  Datasource: [Function: Datasource],
  Featureset: [Function: Featureset],
  MemoryDatasource: [Function: MemoryDatasource],
  Expression: [Function: Expression],
  versions: 
   { node: '0.8.9',
     v8: '3.11.10.22',
     boost: '1.53.0',
     boost_number: 105300,
     mapnik: '2.2.0',
     mapnik_number: 200200,
     cairo: '1.8.8' },
  supports: 
   { grid: true,
     cairo: true,
     jpeg: true },
  compositeOp: 
   { clear: 0,
     src: 1,
     dst: 2,
     src_over: 3,
     dst_over: 4,
     src_in: 5,
     dst_in: 6,
     src_out: 7,
     dst_out: 8,
     src_atop: 9,
     dst_atop: 10,
     xor: 11,
     plus: 12,
     minus: 13,
     multiply: 14,
     screen: 15,
     overlay: 16,
     darken: 17,
     lighten: 18,
     color_dodge: 19,
     color_burn: 20,
     hard_light: 21,
     soft_light: 22,
     difference: 23,
     exclusion: 24,
     contrast: 25,
     invert: 26,
     invert_rgb: 27 },
  settings: 
   { paths: 
      { fonts: '/home/sparkgeo/mapnik/lib/mapnik/fonts',
        input_plugins: '/home/sparkgeo/mapnik/lib/mapnik/input' } },
  version: '0.7.22',
  register_system_fonts: [Function] }
> process.exit()
[will]$ 
</pre>
<p>Excellent, that confirms that node is talking to mapnik via node-mapnik, we are rocking! Now Finally some data:</p>
<pre>
[will]$ ogrinfo -al -so PG:"dbname=sparkgeo_census user=your_username password=your_password" -sql "SELECT * from  censustracts900913"
INFO: Open of `PG:dbname=sparkgeo_census user=your_username password=your_password'
      using driver `PostgreSQL' successful.

Layer name: sql_statement
Geometry: Unknown (any)
Feature Count: 74134
Extent: (-19951913.227845, -1643352.819807) - (20021888.103161, 11554793.570993)
Layer SRS WKT:
(unknown)
Geometry Column = the_geom
[will]$ 
</pre>

<p>Ok, thats everything rolling, now we need to write some code.</p>
<hr class="row-divider" />
<strong>The Front End</strong>
<p>All we want to do is have the polygons show up on a Google Map. This is a simple web product so we need a place for the map to show up. Its going to be a simple html file which looks like this:</p>
<pre>
&lt;html&gt;
&lt;head&gt;
	&lt;script src=&#39;http://maps.google.com/maps/api/js?sensor=false&#39; type=&#39;text/javascript&#39;&gt;&lt;/script&gt;
	&lt;script src=&#39;wax/dist/wax.g.min.js&#39; type=&#39;text/javascript&#39;&gt;&lt;/script&gt;
	&lt;style type=&quot;text/css&quot;&gt;
		html, body {height: 100%;overflow: hidden;}
		#map {height: 100%;}
	&lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div id=&quot;map&quot;&gt;&lt;/div&gt;
	&lt;script&gt;
		var start = new google.maps.LatLng(37.770, -122.418 ); //SF - flowers in your hair
		var dmZoom = 10; 
		var censusTiles = {
			tilejson: &#39;1.0.0&#39;,
			scheme: &#39;xyz&#39;,
			tiles: [&#39;http://census.sparkgeo.com/{z}/{x}/{y}.png&#39;],
			formatter: function(options, data) { return data.NAME }
		};
		var map = new google.maps.Map(document.getElementById(&#39;map&#39;), {
			zoom: dmZoom,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
				},
			center: start
		});
		map.overlayMapTypes.insertAt(0, new wax.g.connector(censusTiles));
	&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</pre>
<p>This is simple but there are some critical parts. Firstly, don't forget to reference <a href="http://www.mapbox.com/wax/">Wax</a> & <a href="https://developers.google.com/maps/">Google Maps</a>, nothing will work without them. Secondly, Yup you are right there are inline styles and scripts. Yuk! But its for demo purposes, ok ;). You will also notice there is only one tag inside the body. The div "map" fills the screen and is populated entirely by Google Maps. The two inline styles ensure that the screen is filled.</p>
<p>The inline javascript script is where the magic happens. There are four things that happen to observe. Firstly we set the variables, the starting location (start) and the starting zoom level(dmZoom). Then we build the tile request. This request basically defines what the client is expecting to see from our node application. If you are building this on a local machine local machine, your tile url might be:</p>
<pre>
http://localhost:8000/{z}/{x}/{y}.png
</pre>
<p>instead. You can find out more about this in the <a href="http://www.mapbox.com/wax/">Wax docs</a>. The third piece is the definition of the Google Map, which you can find out lots from the <a href="https://developers.google.com/maps/">Google Maps docs</a>. Finally we add the wax layer to the map.
</p>
<hr class="row-divider" />
<strong>The Back End</strong>
<p>Our Node app will start its own little webserver, so you need to put it in a sensible place. If you are running local host it can really go anywhere, but if you are putting this i a public place, then you should consider this location a little more carefully. It will also have to speak to PostGIS, of course. The node app which I called cencon.js looks like this:
</p>

<pre>
var mapnik = require('mapnik');
var mercator = require('./sphericalmercator');
var url = require('url');
var fs = require('fs');
var http = require('http');
var parseXYZ = require('./tile.js').parseXYZ;
var path = require('path');
var port = 8000; // this will define the port at which the map tiles appear.. ie http://localhost:8000
var TMS_SCHEME = false;

// the db connection info
var postgis_settings = {
  'host' : 'localhost',
  'dbname' : 'sparkgeo_census',
  'table' : 'censustracts900913',
  'user' : 'your_username',
  'password' : 'your_password',
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
        var postgis = new mapnik.Datasource(postgis_settings); // settings defined above
        var bbox = mercator.xyz_to_envelope(parseInt(params.x),
                                               parseInt(params.y),
                                               parseInt(params.z), false); // coordinates provided by the sphericalmercator.js script
		layer.datasource = postgis; 
        layer.styles = ['polygon']; // this pertains the the style in the xml doc
        map.bufferSize = 0; // how much edging is provided for each tile rendered
        map.load(path.join(__dirname, 'tile_symbols.xml'), {strict: true}, function(err,map) {
            if (err) throw err;
            map.add_layer(layer);
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

</pre>
<p>
The script above basically gathers the dependencies, defines the database connection string then scopes out how to deal with each request while it listens on a specific port (8000, in this case). Its up to the client to ask for tiles and this node application will deliver. So the relationship between what wax is doing and what node-mapnik is doing is absolutely critical. Wax will define what tiles are required and request them from the node application. The node application will take each individual request and throw them at Mapnik and by extension PostGIS. Mapnik's resulting image files will be sent back to the client and wax will overlay it on the Google Map and cache them for a short time in the client browser session.
</p>
<p>
The application code above refers to two external js files: sphericalmercator and tile. Both of these files have very conveniently been provided by <a href="https://github.com/springmeyer"> Springmeyer</a> in the <a href="https://github.com/mapnik/node-mapnik">Node-Mapnik</a> bindings. Look at: <a href="https://github.com/mapnik/node-mapnik-sample-code/blob/master/utils/sphericalmercator.js">sphericalmercator.js</a> and <a href="https://github.com/mapnik/node-mapnik-sample-code/blob/master/utils/tile.js">Tile.js</a>. The third dependancy is the tile_symbols.xml which defines the styling associated with the node-mapnik overlay:
</p>
<pre>
&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;
&lt;!DOCTYPE Map [
&lt;!ENTITY maxscale_zoom2 &quot;&lt;MaxScaleDenominator&gt;200000000&lt;/MaxScaleDenominator&gt;&quot;&gt;
&lt;!ENTITY minscale_zoom19 &quot;&lt;MinScaleDenominator&gt;500&lt;/MinScaleDenominator&gt;&quot;&gt;
]&gt;
&lt;Map minimum-version=&quot;2.0.0&quot;&gt;

&lt;Style name=&quot;polygon&quot;&gt;
    &lt;Rule&gt;
        &amp;maxscale_zoom2;
        &amp;minscale_zoom19;
        &lt;LineSymbolizer  stroke-width=&quot;0.5&quot; stroke-opacity=&quot;0.6&quot;/&gt;
    &lt;/Rule&gt;
&lt;/Style&gt;
&lt;/Map&gt;

</pre>
<p>I'll reiterate once more that the styling here is very simple, a single feature type being styled in a single manner. This could go a great deal further!</p>
<hr class="row-divider" />
<strong>Start Serving</strong>
<p>We have our architecture in place and all that is left is to start the service:</p>

<pre> [will]$ node cencon.js </pre>

<p> That's it, if you want this service to persist beyond the terminal session you can do: </p>

<pre> [will]$ nohup node cencon.js & </pre>

<hr class="row-divider" />

<strong>Shout Outs</strong>
	<ul>
		<li><a href="http://www.postgis.net">PostGIS</a> - The Spatial Database of Choice</li>
		<li><a href="http://www.mapnik.org">Mapnik</a> - Toolkit for developing mapping applications</li> 
		<li><a href="http://www.nodejs.org">Node.js</a> - Server-side JS, not as crazy as it sounds and rocket fast</li> 
		<li><a href="https://github.com/mapnik/node-mapnik">Node-Mapnik</a> - Bindings to Mapnik for Node, particular props go to the prolific <a href="https://github.com/springmeyer"> Springmeyer</a></li>
		<li><a href="http://www.mapbox.com/wax/">Wax</a> - Library for displaying all sorts of data on all sorts of mapping fabrics, brought to us by the magicians at <a href="http://mapbox.com">mapbox</a></li>
		<li><a href="https://developers.google.com/maps/">Google Maps</a> - The worlds favourite mapping fabric</li>
		<li><a href="http://www.webfaction.com?affiliate=sparkgeo">Webfaction</a> - My favourite web host, developer friendly, with amazing support!</li>
	</ul>
<p>I hope this proves useful to the geoweb community. Remember, try and make maps for the web that don&rsquo;t just look like web maps! ;)</p>
										
		</div> <!-- /container -->
		
	</div> <!-- /content -->
