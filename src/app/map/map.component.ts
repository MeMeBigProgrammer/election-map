import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { rgb } from 'd3';
import * as topojsonClient from 'topojson-client';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
	geoJsonDistrictMap: any;
	svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
	path: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
	g: any;
	projection: d3.GeoProjection;
	geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;

	levelOptions = [
		{ value: 'county', viewValue: 'County' },
		{ value: 'state', viewValue: 'State' },
	];

	yearOptions = {
		county: [
			{ value: '2016', viewValue: '2016' },
			{ value: '2012', viewValue: '2012' },
			{ value: '2008', viewValue: '2008' },
			{ value: '2004', viewValue: '2004' },
			{ value: '2000', viewValue: '2000' },
		],
	};

	selectedOption = {
		year: '2016',
		level: 'county',
	};

	colorScale = d3.scaleSequential(d3['interpolateRdBu']).domain([0, 1]);

	constructor(private httpClient: HttpClient) {}

	ngOnInit(): void {
		this.svg = d3.select('#map').attr('viewBox', '0 0 1000 500').attr('preserveAspectRatio', 'xMinYMin meet');
		this.path = d3.select('#map_content').selectAll('path');
		this.g = d3.select('#map_content');
		this.projection = d3.geoAlbersUsa();
		this.geoGenerator = d3.geoPath().projection(this.projection);

		this.httpClient.get('../../assets/data/county_data_merge/topoout.json').subscribe((json: any) => {
			// src/assets/data/county_data_merge/final.json ../../assets/data/2019_county_election_map_topo.json
			this.geoJsonDistrictMap = topojsonClient.feature(json, json.objects.counties);

			this.path
				.data(this.geoJsonDistrictMap.features)
				.enter()
				.append('path')
				.attr('d', this.geoGenerator as any)
				.attr('id', (d: any) => {
					return 'F' + d.properties.AFFGEOID;
				})
				.attr('fill', (d: any) => {
					for (let candidate of d.properties[this.selectedOption.year].candidates) {
						if (candidate.party == 'democrat') {
							return this.colorScale(candidate.votes / (d.properties[this.selectedOption.year].totalvotes - 1));
						}
					}
					return rgb(200, 200, 200).formatHsl();
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

	refreshMap() {
		this.geoJsonDistrictMap.features.forEach((d: any) => {
			d3.select('#F' + d.properties.AFFGEOID).attr('fill', (d: any) => {
				for (let candidate of d.properties[this.selectedOption.year].candidates) {
					if (candidate.party == 'democrat') {
						return this.colorScale(candidate.votes / (d.properties[this.selectedOption.year].totalvotes - 1));
					}
				}
				return rgb(200, 200, 200).formatHsl();
			});
		});
	}

	updateYear(event: any) {
		this.refreshMap();
	}
	updateLevel(event: any) {
		// console.log(event);
		this.refreshMap();
	}
}
