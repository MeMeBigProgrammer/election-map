ogr2ogr -simplify 0.0040 iter.shp cb_2019_us_county_500k.shp
ogr2ogr -f GeoJSON output.json input.shp
geo2topo output.json > topoout.json
