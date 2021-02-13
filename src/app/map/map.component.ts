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
	g: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
	projection: d3.GeoProjection = d3.geoAlbersUsa();
	geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects> = d3
		.geoPath()
		.projection(this.projection);

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

	constructor(private httpClient: HttpClient) {}

	ngOnInit(): void {
		this.svg = d3
			.select('#map')
			.attr('viewBox', '0 0 1000 500')
			.attr('preserveAspectRatio', 'xMinYMin meet');
		this.path = d3.select('#map_content').selectAll('path');
		this.g = d3.select('#map_content');

		this.httpClient
			.get('../../assets/data/2019_county_election_map_topo.json')
			.subscribe((json: any) => {
				this.geoJsonDistrictMap = topojsonClient.feature(json, json.objects.counties);

				this.path
					.data(this.geoJsonDistrictMap.features)
					.enter()
					.append('path')
					.attr('d', this.geoGenerator as any)
					.attr('id', (d: any) => {
						return 'F' + d.properties.AFFGEOID; // IDs need to start with a letter.
					})
					.attr('fill', (d: any) => {
						return this.calculateColor(d);
					})
					.style('stroke', '#010101')
					.attr('stroke-width', '0.2px')
					.attr('stroke-linejoin', 'round')
					.attr('pointer-events', 'all')
					.on('click', (event, d: any) => {
						console.log(d.properties.AFFGEOID);
					});
			});

		this.svg.call(
			d3
				.zoom()
				.scaleExtent([1, 11])
				.on('zoom', (event) => {
					this.g.attr('transform', event.transform);
					// d3.selectAll('path').attr('stroke-width', 0.5 / event.transform.k); // Very computationally heavy
				})
		);
	}

	refreshMap() {
		this.geoJsonDistrictMap.features.forEach((d: any) => {
			d3.select('#F' + d.properties.AFFGEOID).attr('fill', (d: any) => {
				return this.calculateColor(d);
			});
		});
	}

	calculateColor(data: any) {
		const colorScale = d3.scaleSequential(d3['interpolateRdBu']).domain([0, 1]);
		for (let candidate of data.properties[this.selectedOption.year].candidates) {
			if (candidate.party == 'democrat') {
				return colorScale(
					candidate.votes / (data.properties[this.selectedOption.year].totalvotes - 1)
				);
			}
		}
		return rgb(200, 200, 200).formatHsl();
	}

	updateYear(event: any) {
		this.refreshMap();
	}

	updateLevel(event: any) {
		this.refreshMap();
	}
}
