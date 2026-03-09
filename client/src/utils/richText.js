const UNSAFE_URL_PROTOCOLS = ['javascript:', 'data:']

const sanitizeAttributeValue = (name, value) => {
  if (!value) return ''

  const lowerName = name.toLowerCase()
  if (lowerName !== 'href' && lowerName !== 'src') {
    return value
  }

  const normalized = String(value).trim().toLowerCase()
  if (UNSAFE_URL_PROTOCOLS.some((protocol) => normalized.startsWith(protocol))) {
    return ''
  }

  return value
}

export const sanitizeRichTextHtml = (html) => {
  if (!html) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(String(html), 'text/html')

  doc.querySelectorAll('script, style, iframe, object, embed').forEach((node) => node.remove())

  doc.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()
      if (name.startsWith('on')) {
        node.removeAttribute(attribute.name)
        return
      }

      const safeValue = sanitizeAttributeValue(name, attribute.value)
      if (!safeValue) {
        node.removeAttribute(attribute.name)
      } else {
        node.setAttribute(attribute.name, safeValue)
      }
    })
  })

  return doc.body.innerHTML
}

export const richTextToPlainText = (html) => {
  if (!html) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(String(html), 'text/html')
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}

export const isRichTextEmpty = (html) => richTextToPlainText(html).length === 0

export const richTextPreview = (html, maxLength = 180) => {
  const text = richTextToPlainText(html)
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}
