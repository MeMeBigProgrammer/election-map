import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { rgb } from 'd3';
import * as topojsonClient from 'topojson-client';
import { CountyNode, CountyGeoJson } from '../core/classes/county-models';

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

	tooltipConfig = {
		css: {
			position: 'absolute',
		},
		isVisible: false,
		node: {},
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
				this.geoJsonDistrictMap = new CountyGeoJson(
					topojsonClient.feature(json, json.objects.counties)
				);

				this.path
					.data(this.geoJsonDistrictMap.features)
					.enter()
					.append('path')
					.attr('d', this.geoGenerator)
					.attr('id', (d: CountyNode) => {
						return 'F' + d.properties.affGeoId; // IDs need to start with a letter.
					})
					.attr('fill', (d: CountyNode) => {
						return this.calculateColor(d);
					})
					.style('stroke', '#010101')
					.attr('stroke-width', '0.2px')
					.attr('stroke-linejoin', 'round')
					.attr('pointer-events', 'all')
					.on('click', (event, d: CountyNode) => {
						this.tooltipConfig.css['top'] = event.pageY + 50 + 'px';
						this.tooltipConfig.css['left'] = event.pageX - 25 + 'px';
						this.tooltipConfig.isVisible = !this.tooltipConfig.isVisible;
						this.tooltipConfig.node = d;
					})
					.on('mouseover', (event, d: CountyNode) => {
						this.tooltipConfig.css['top'] = event.pageY + 50 + 'px';
						this.tooltipConfig.css['left'] = event.pageX - 150 + 'px';
						this.tooltipConfig.node = d;
					});
			});

		this.svg.call(
			d3
				.zoom()
				.scaleExtent([1, 11])
				.on('zoom', (event) => {
					this.g.attr('transform', event.transform);
					this.tooltipConfig.isVisible = false;
					// d3.selectAll('path').attr('stroke-width', 0.5 / event.transform.k); // Very computationally heavy
				})
		);
	}

	refreshMap() {
		this.geoJsonDistrictMap.features.forEach((d: CountyNode) => {
			d3.select('#F' + d.properties.affGeoId).attr('fill', (d: CountyNode) => {
				return this.calculateColor(d);
			});
		});
	}

	calculateColor(data: CountyNode) {
		const colorScale = d3.scaleSequential(d3['interpolateRdBu']).domain([0, 1]);
		let results = data.properties.results.get(this.selectedOption.year);
		for (let candidate of results.candidates) {
			if (candidate.party == 'democrat') {
				return colorScale(candidate.votes / (results.totalVotes - 1));
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
