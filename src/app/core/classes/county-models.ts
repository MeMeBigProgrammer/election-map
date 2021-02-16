export interface Candidate {
	name: string;
	votes: number;
	party: string; // TODO compress party names to save ~.4 MB, unpack here; Delete unused properties from data; try smaller shapefile
}

export interface Election {
	candidates: Candidate[];
	totalvotes: number;
}

export class CountyNodeProperties {
	static validYears = ['2016', '2012', '2008', '2004', '2000'];
	results: Map<string, Election> = new Map<string, Election>();
	affGeoId: string;
	aland: Number;
	awater: Number;
	countyFipsCode: string;
	countyNS: string;
	GeoId: string;
	lsad: string;
	name: string;
	StateFipsCode: string;

	constructor(d: any) {
		for (let year of CountyNodeProperties.validYears) {
			this.results.set(year, d[year] as Election);
		}

		this.affGeoId = d.AFFGEOID ?? '';
		this.aland = d.ALAND ?? 0;
		this.awater = d.AWATER ?? 0;
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
