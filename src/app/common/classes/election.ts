export class Candidate {
	name: string;
	votes: number;
	party: string;

	constructor(object: any) {
		this.name = object.name ?? '';
		this.votes = object.votes ?? 0;
		this.party = object.party ?? '';
	}
}

export class Election {
	candidates: Candidate[];
	totalVotes: number;

	constructor(object: any) {
		this.totalVotes = object.totalVotes ?? 0;
		this.candidates = (object.candidates as any[]).map((val) => new Candidate(val)) ?? [];
	}
}
