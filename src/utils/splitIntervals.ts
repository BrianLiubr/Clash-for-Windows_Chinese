import type { AnnotationRange, Segment } from '../types'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function normalizeAnnotations(plainText: string, anns: AnnotationRange[]): AnnotationRange[] {
  const len = plainText.length
  const normalized: AnnotationRange[] = []
  for (const a of anns) {
    const s = clamp(Math.floor(a.start ?? 0), 0, len)
    const e = clamp(Math.floor(a.end ?? 0), 0, len)
    if (e <= s) continue
    normalized.push({ ...a, start: s, end: e })
  }
  return normalized
}

export function splitIntoSegments(plainText: string, anns: AnnotationRange[]): Segment[] {
  const textLen = plainText.length
  const annotations = normalizeAnnotations(plainText, anns)
  const boundaries = new Set<number>([0, textLen])
  for (const a of annotations) {
    boundaries.add(a.start)
    boundaries.add(a.end)
  }
  const points = Array.from(boundaries).sort((a, b) => a - b)
  const segments: Segment[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const s = points[i]
    const e = points[i + 1]
    if (e <= s) continue
    const covering = annotations.filter(a => a.start <= s && a.end >= e)
    const text = plainText.slice(s, e)
    segments.push({ start: s, end: e, text, annotations: covering })
  }
  return segments
}

export function deriveSegmentClass(seg: Segment): { className: string, tooltip?: string } {
  const types = new Set(seg.annotations.map(a => a.type))
  const hasIssue = types.has('sentence_issue')
  const hasGood = types.has('good')
  const hasTypo = types.has('typo')
  const classList = ['segment']
  if (hasIssue) classList.push('issue')
  else if (hasGood) classList.push('good')
  if (hasTypo) classList.push('typo')

  const tooltipItems: string[] = []
  for (const a of seg.annotations) {
    const t = a.payload?.comment || a.payload?.suggestion
    if (t) tooltipItems.push(t)
  }
  const tooltip = tooltipItems.join(' | ')
  return { className: classList.join(' '), tooltip }
}
