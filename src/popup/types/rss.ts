export const SECTION_IDS = [
  'Africa',
  'Americas',
  'ArtandDesign',
  'Arts',
  'AsiaPacific',
  'Automobiles',
  'Baseball',
  'Books/Review',
  'Business',
  'Climate',
  'CollegeBasketball',
  'CollegeFootball',
  'Dance',
  'Dealbook',
  'DiningandWine',
  'Economy',
  'Education',
  'EnergyEnvironment',
  'Europe',
  'FashionandStyle',
  'Golf',
  'Health',
  'Hockey',
  'HomePage',
  'Jobs',
  'Lens',
  'MediaandAdvertising',
  'MiddleEast',
  'MostEmailed',
  'MostShared',
  'MostViewed',
  'Movies',
  'Music',
  'NYRegion',
  'Obituaries',
  'PersonalTech',
  'Politics',
  'ProBasketball',
  'ProFootball',
  'RealEstate',
  'Science',
  'SmallBusiness',
  'Soccer',
  'Space',
  'Sports',
  'SundayBookReview',
  'Sunday-Review',
  'Technology',
  'Television',
  'Tennis',
  'Theater',
  'TMagazine',
  'Travel',
  'Upshot',
  'US',
  'Weddings',
  'Well',
  'World',
  'YourMoney',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

export type ViewStatus = 'idle' | 'loading' | 'success' | 'error'

export type SectionOption = {
  id: SectionId
  label: string
}

export type RssItem = {
  title: string
  link: string
  creator?: string
  pubDate?: string
  description?: string
  categories: string[]
  imageUrl?: string
}

export const SECTION_OPTIONS: SectionOption[] = SECTION_IDS.map((section) => ({
  id: section,
  label: section,
}))