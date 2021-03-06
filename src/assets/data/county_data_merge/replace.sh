ogr2ogr -f GeoJSON ../shapefiles/output.json ../shapefiles/cb_2019_us_county_20m.shp
python counties.py
geo2topo counties=final.json > topoout.json
cp topoout.json ../2019_county_election_map_topo.json
cp final.json ../2019_county_election_map_geo.json

# ogr2ogr -simplify 0.0040 iter.shp cb_2019_us_county_500k.shp
# ogr2ogr -f GeoJSON output.json input.shp
# geo2topo counties=output.json > topoout.json