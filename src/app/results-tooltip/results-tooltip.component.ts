import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CountyNode, Election } from '../core/classes';

@Component({
	selector: 'app-results-tooltip',
	templateUrl: './results-tooltip.component.html',
	styleUrls: ['./results-tooltip.component.scss'],
})
export class ResultsTooltipComponent implements OnInit, OnChanges {
	constructor() {}

	@Input() node: CountyNode;

	@Input() year: string;

	election: Election;

	ngOnInit(): void {
		this.election = this.node.properties.results.get(this.year);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.ngOnInit();
	}
}
