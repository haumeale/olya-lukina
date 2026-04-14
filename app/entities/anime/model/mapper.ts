export function mapAnime(item: any) {
  return {
    mal_id: item.mal_id,
    title: item.title,
    image: item.images?.jpg?.image_url,
    score: item.score,
  }
}