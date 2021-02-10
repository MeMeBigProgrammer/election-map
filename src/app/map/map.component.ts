import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { rgb } from 'd3';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
	geoJsonDistrictMap: any;
	svg: any;
	path: any;
	g: any;
	projection: d3.GeoProjection;
	geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;

	constructor(private httpClient: HttpClient) {}

	ngOnInit(): void {
		this.svg = d3.select('#map').attr('viewBox', '0 0 1000 500').attr('preserveAspectRatio', 'xMinYMin meet');
		this.path = d3.select('#map_content').selectAll('path');
		this.g = d3.select('#map_content');
		this.projection = d3.geoAlbersUsa();
		this.geoGenerator = d3.geoPath().projection(this.projection);

		var colorScale = d3.scaleSequential(d3['interpolateRdBu']).domain([0, 1]);

		this.httpClient.get('../../assets/data/2019_county_election_map.json').subscribe((json: any) => {
			this.geoJsonDistrictMap = json;

			this.path
				.data(this.geoJsonDistrictMap.features)
				.enter()
				.append('path')
				.attr('d', this.geoGenerator as any)
				.attr('fill', (d: any) => {
					for (let candidate of d.properties['2016'].candidates) {
						if (candidate.party == 'democrat') {
							// console.log(d);
							return colorScale(candidate.votes / d.properties['2012'].totalvotes);
						}
					}
					// return rgb(100, 0, 0).formatHsl();
				})
				.style('stroke', '#0E0E0E')
				.style('stroke-width', '0.1px');
		});

		this.svg
			.append('rect')
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.attr('width', 1000)
			.attr('height', 500)
			.call(
				d3
					.zoom()
					.scaleExtent([1, 11])
					.on('zoom', (event) => {
						this.g.attr('transform', event.transform);
					})
			);
	}
}
