export const availableStatuses = [
	{
		value: "airing",
		label: "Airing",
	},
	{
		value: "completed",
		label: "Completed",
	},
	{
		value: "upcoming",
		label: "Upcoming",
	},
];

export const ratingOptions = [
	{ value: "g", label: "G - All Ages" },
	{ value: "pg", label: "PG - Children" },
	{ value: "pg13", label: "PG-13 - Teens 13 or older" },
	{ value: "r17", label: "R - 17+ (violence & profanity)" },
	{ value: "r", label: "R+ - Mild Nudity" },
	{ value: "rx", label: "Rx - Hentai" },
] as const;

export const typeOptions = [
	{ value: "tv", label: "TV" },
	{ value: "movie", label: "Movie" },
	{ value: "ova", label: "OVA" },
	{ value: "special", label: "Special" },
	{ value: "ona", label: "ONA" },
	{ value: "music", label: "Music" },
	{ value: "cm", label: "CM" },
	{ value: "pv", label: "PV" },
	{ value: "tv_special", label: "TV Special" },
] as const;

export const orderByOptions = [
	{ value: "mal_id", label: "ID" },
	{ value: "title", label: "Title" },
	{ value: "start_date", label: "Start Date" },
	{ value: "end_date", label: "End Date" },
	{ value: "episodes", label: "Episodes" },
	{ value: "score", label: "Score" },
	{ value: "scored_by", label: "Scored By" },
	{ value: "rank", label: "Rank" },
	{ value: "popularity", label: "Popularity" },
	{ value: "members", label: "Members" },
	{ value: "favorites", label: "Favorites" },
] as const;
