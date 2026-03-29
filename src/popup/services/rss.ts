import type { RssItem, SectionId } from '../types/rss'

const RSS_BASE_URL = 'https://rss.nytimes.com/services/xml/rss/nyt'

function getRssUrl(section: SectionId): string {
  return `${RSS_BASE_URL}/${section}.xml`
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function stripHtml(input: string): string {
  const doc = new DOMParser().parseFromString(input, 'text/html')
  return normalizeWhitespace(doc.body.textContent ?? '')
}

function getText(node: Element, tagName: string): string | undefined {
  const value = node.getElementsByTagName(tagName)[0]?.textContent
  if (!value) {
    return undefined
  }
  const normalized = normalizeWhitespace(value)
  return normalized.length > 0 ? normalized : undefined
}

function getImageUrl(node: Element): string | undefined {
  const mediaContent = node.getElementsByTagName('media:content')[0]
  const mediaCredit = node.getElementsByTagName('media:credit')[0]

  const mediaContentUrl = mediaContent?.getAttribute('url')
  if (mediaContentUrl && mediaContentUrl.length > 0) {
    return mediaContentUrl
  }

  const mediaCreditUrl = mediaCredit?.getAttribute('url')
  return mediaCreditUrl && mediaCreditUrl.length > 0 ? mediaCreditUrl : undefined
}

function parseFeed(xmlText: string): RssItem[] {
  const parser = new DOMParser()
  const xmlDocument = parser.parseFromString(xmlText, 'application/xml')
  const parserError = xmlDocument.querySelector('parsererror')

  if (parserError) {
    throw new Error('Failed to parse RSS response.')
  }

  const itemNodes = Array.from(xmlDocument.querySelectorAll('item'))
  return itemNodes
    .map((node) => {
      const categoryNodes = Array.from(node.getElementsByTagName('category'))
      const categories = categoryNodes
        .map((categoryNode) => normalizeWhitespace(categoryNode.textContent ?? ''))
        .filter((category, index, all) => category.length > 0 && all.indexOf(category) === index)

      const descriptionRaw = getText(node, 'description')

      return {
        title: getText(node, 'title') ?? 'Untitled',
        link: getText(node, 'link') ?? '',
        creator: getText(node, 'dc:creator'),
        pubDate: getText(node, 'pubDate'),
        description: descriptionRaw ? stripHtml(descriptionRaw) : undefined,
        categories,
        imageUrl: getImageUrl(node),
      }
    })
    .filter((item) => item.link.length > 0)
}

export async function fetchSectionFeed(section: SectionId): Promise<RssItem[]> {
  const response = await fetch(getRssUrl(section))

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`)
  }

  const xmlText = await response.text()
  return parseFeed(xmlText)
}