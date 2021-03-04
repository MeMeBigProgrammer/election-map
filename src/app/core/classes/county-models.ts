import { Election, Candidate } from './election';

export class CountyNodeProperties {
	static validYears = ['2016', '2012', '2008', '2004', '2000'];
	results: Map<string, Election> = new Map<string, Election>();
	affGeoId: string;
	countyFipsCode: string;
	GeoId: string;
	name: string;
	StateFipsCode: string;

	constructor(object: any) {
		for (let year of CountyNodeProperties.validYears) {
			let election = new Election(object[year]);

			for (let index = 0; index < election.candidates.length; index++) {
				if (election.candidates[index].party == 'rep') {
					election.candidates[index].party = 'republican';
				} else if (election.candidates[index].party == 'dem') {
					election.candidates[index].party = 'democrat';
				}
			}
			this.results.set(year, election);
		}

		this.affGeoId = object.AFFGEOID ?? '';
		this.countyFipsCode = object.COUNTYFP ?? '';
		this.GeoId = object.GEOID ?? '';
		this.name = object.NAME ?? '';
		this.StateFipsCode = object.STATEFP ?? '';
		this.sortElections();
	}

	sortElections() {
		for (let year of CountyNodeProperties.validYears) {
			this.results.get(year).candidates.sort((left: Candidate, right: Candidate) => {
				if (right.votes == left.votes) {
					return 0;
				}
				return Number(left.votes) < Number(right.votes) ? 1 : -1;
			});
		}
	}
}

export class CountyNode {
	type: string;
	properties: CountyNodeProperties;
	geometry: any;

	constructor(d: any) {
		this.type = d.type ?? '';
		this.properties = new CountyNodeProperties(d.properties);
		this.geometry = d.geometry;
	}
}

export class CountyGeoJson {
	features: CountyNode[] = [];
	type: string;
	constructor(json: any) {
		this.type = json.type ?? '';
		json.features.forEach((node: any) => {
			this.features.push(new CountyNode(node));
		});
	}
}
