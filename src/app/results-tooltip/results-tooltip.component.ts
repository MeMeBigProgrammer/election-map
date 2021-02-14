import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-results-tooltip',
	templateUrl: './results-tooltip.component.html',
	styleUrls: ['./results-tooltip.component.scss'],
})
export class ResultsTooltipComponent implements OnInit {
	constructor() {}

	@Input() text: string;

	@Input() node: any;

	@Input() election: any;

	ngOnInit(): void {
		console.log(this.election);
	}
}
