import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
	districtMap: any;
	svg: any;
	mapContent: any;
	mapContentParent: any;
	projection: d3.GeoProjection;
	geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;

	// https://angularquestions.com/2020/10/12/d3-v6-zoom-and-drag-functionality/
	// https://bl.ocks.org/mbostock/3680999

	constructor(private httpClient: HttpClient) {}

	ngOnInit(): void {
		this.svg = d3.select('#map').attr('viewBox', '0 0 1000 500').attr('preserveAspectRatio', 'xMinYMin meet');
		this.mapContent = d3.select('#map_content').selectAll('path').attr('transform', '');
		this.mapContentParent = d3.select('#map_content');
		this.projection = d3.geoAlbersUsa();
		this.geoGenerator = d3.geoPath().projection(this.projection);

		this.httpClient.get('../../assets/data/counties.json').subscribe((json: any) => {
			this.districtMap = json;

			this.mapContent
				.data(this.districtMap.features)
				.enter()
				.append('path')
				.attr('d', this.geoGenerator as any);
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
					.scaleExtent([1, 8])
					.on('zoom', (event) => {
						console.log(event.transform);
						this.mapContentParent.attr('transform', event.transform);
					})
			);
	}
}
