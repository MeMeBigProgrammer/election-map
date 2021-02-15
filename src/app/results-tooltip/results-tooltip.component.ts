import { Component, Input, OnInit } from '@angular/core';
import {
	CountyNode,
	CountyNodeProperties,
	Candidate,
	Election,
} from '../core/classes/county-models';

@Component({
	selector: 'app-results-tooltip',
	templateUrl: './results-tooltip.component.html',
	styleUrls: ['./results-tooltip.component.scss'],
})
export class ResultsTooltipComponent implements OnInit {
	constructor() {}

	@Input() node: CountyNode;

	@Input() election: Election;

	ngOnInit(): void {}
}
