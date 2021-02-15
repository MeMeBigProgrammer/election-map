export interface Candidate {
	name: string;
	votes: number;
	party: string;
}

export interface Election {
	candidates: Election;
	totalVotes: number;
}

export class CountyNodeProperties {
	'2000': Election;
	'2004': Election;
	'2008': Election;
	'2012': Election;
	'2016': Election;
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
		this['2000'] = d['2000'] as Election;
		this['2004'] = d['2004'] as Election;
		this['2008'] = d['2008'] as Election;
		this['2012'] = d['2012'] as Election;
		this['2016'] = d['2016'] as Election;
		this.affGeoId = d.AFFGEOID ?? '';
		this.aland = d.ALAND ?? 0;
		this.awater = d.AWATER ?? 0;
		this.countyFipsCode = d.COUNTYFP ?? '';
		this.countyNS = d.COUNTYNS ?? '';
		this.GeoId = d.GEOID ?? '';
		this.lsad = d.LSAD ?? '';
		this.name = d.NAME ?? '';
		this.StateFipsCode = d.STATEFP ?? '';
	}

	sortElections() {} // TODO, allows to remove a @Input
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
