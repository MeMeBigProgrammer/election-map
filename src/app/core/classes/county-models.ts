export interface Candidate {
	name: string;
	votes: number;
	party: string;
}

export interface Election {
	candidates: Candidate[];
	totalVotes: number;
}

export class CountyNodeProperties {
	static validYears = ['2016', '2012', '2008', '2004', '2000'];
	results: Map<string, Election> = new Map<string, Election>();
	affGeoId: string;
	countyFipsCode: string;
	countyNS: string;
	GeoId: string;
	lsad: string;
	name: string;
	StateFipsCode: string;

	constructor(d: any) {
		for (let year of CountyNodeProperties.validYears) {
			let election = (d[year] as Election) ?? {
				candidates: [],
				totalVotes: 0,
			};
			this.results.set(year, election);
		}

		this.affGeoId = d.AFFGEOID ?? '';
		this.countyFipsCode = d.COUNTYFP ?? '';
		this.countyNS = d.COUNTYNS ?? '';
		this.GeoId = d.GEOID ?? '';
		this.lsad = d.LSAD ?? '';
		this.name = d.NAME ?? '';
		this.StateFipsCode = d.STATEFP ?? '';
		this.sortElections();
	}

	sortElections() {
		for (let year of CountyNodeProperties.validYears) {
			this.results.get(year).candidates.sort((left: Candidate, right: Candidate) => {
				left.votes = Number(left.votes);
				right.votes = Number(right.votes);
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
