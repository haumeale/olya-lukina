export interface AnimeResponse {
  pagination: Pagination
  data: Anime[]
}
export interface Pagination {
  last_visible_page: number
  has_next_page: boolean
  current_page: number
  items: PaginationItems
}

export interface PaginationItems {
  count: number
  total: number
  per_page: number
}
export interface Anime {
  mal_id: number
  url: string
  images: AnimeImages
  trailer: AnimeTrailer

  approved: boolean

  titles: AnimeTitle[]
  title: string
  title_english: string | null
  title_japanese: string | null
  title_synonyms: string[]

  type: string
  source: string

  episodes: number | null
  status: string
  airing: boolean

  aired: AnimeAired

  duration: string
  rating: string

  score: number | null
  scored_by: number | null

  rank: number | null
  popularity: number
  members: number
  favorites: number

  synopsis: string | null
  background: string | null

  season: string | null
  year: number | null

  broadcast: AnimeBroadcast

  producers: AnimeEntity[]
  licensors: AnimeEntity[]
  studios: AnimeEntity[]

  genres: AnimeEntity[]
  explicit_genres: AnimeEntity[]
  themes: AnimeEntity[]
  demographics: AnimeEntity[]
}
export interface AnimeImages {
  jpg: AnimeImageSet
  webp: AnimeImageSet
}

export interface AnimeImageSet {
  image_url: string
  small_image_url: string
  large_image_url: string
}
export interface AnimeTrailer {
  youtube_id: string | null
  url: string | null
  embed_url: string | null
  images: AnimeTrailerImages
}

export interface AnimeTrailerImages {
  image_url: string | null
  small_image_url: string | null
  medium_image_url: string | null
  large_image_url: string | null
  maximum_image_url: string | null
}
export interface AnimeTitle {
  type: string
  title: string
}
export interface AnimeAired {
  from: string | null
  to: string | null
  prop: {
    from: AnimeDate
    to: AnimeDate
  }
  string: string
}

export interface AnimeDate {
  day: number | null
  month: number | null
  year: number | null
}
export interface AnimeBroadcast {
  day: string | null
  time: string | null
  timezone: string | null
  string: string | null
}
export interface AnimeEntity {
  mal_id: number
  type: string
  name: string
  url: string
}
