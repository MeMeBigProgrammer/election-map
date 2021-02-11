import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { rgb } from 'd3';

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
					for (let candidate of d.properties[this.selectedOption.year].candidates) {
						if (candidate.party == 'democrat') {
							return colorScale(candidate.votes / (d.properties[this.selectedOption.year].totalvotes - 1));
						}
					}
					return rgb(200, 200, 200).formatHsl();
				})
				.style('stroke', '#0E0E0E')
				.style('stroke-width', '0.1px');
		});

		// this.svg
		// 	.append('rect')
		// 	.attr('fill', 'none')
		// 	.attr('pointer-events', 'all')
		// 	.attr('width', 1000)
		// 	.attr('height', 500)
		// 	.call(
		// 		d3
		// 			.zoom()
		// 			.scaleExtent([1, 11])
		// 			.on('zoom', (event) => {
		// 				this.g.attr('transform', event.transform);
		// 			})
		// 	);
	}

	refreshMap() {
		d3.select('#map_content').selectAll('path').exit().remove();
	}

	updateYear(event: any) {
		// console.log(this.selectedOption.year);
		this.refreshMap();
	}
	updateLevel(event: any) {
		// console.log(event);
		this.refreshMap();
	}
}
