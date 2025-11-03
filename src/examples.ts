import type { AnnotationRange, DemoData } from './types'

export function buildExample(): DemoData {
  const plainText = `春风又绿江南岸，明月何时照我还？\n小明今天早上來到学校，他很高兴，因爲他得了第一名。`

  const anns: AnnotationRange[] = []

  // good: “春风又绿”
  const good1Start = plainText.indexOf('春风又绿')
  if (good1Start >= 0) {
    anns.push({ id: 'g1', start: good1Start, end: good1Start + '春风又绿'.length, type: 'good', payload: { comment: '用词生动' } })
  }

  // typo: 來 -> 来
  const typo1Start = plainText.indexOf('來到')
  if (typo1Start >= 0) {
    anns.push({ id: 't1', start: typo1Start, end: typo1Start + 1, type: 'typo', payload: { comment: '繁体字', original: '來', corrected: '来', suggestion: '改为“来到”' } })
  }

  // typo: 因爲 -> 因为
  const typo2Start = plainText.indexOf('因爲')
  if (typo2Start >= 0) {
    anns.push({ id: 't2', start: typo2Start + 1, end: typo2Start + 2, type: 'typo', payload: { comment: '错别字', original: '爲', corrected: '为', suggestion: '改为“因为”' } })
  }

  // sentence_issue: “小明今天早上來到学校，他很高兴” （故意跨越并与上面错字重叠）
  const sentStart = plainText.indexOf('小明今天早上')
  if (sentStart >= 0) {
    const sentEnd = plainText.indexOf('，因', sentStart)
    const end = sentEnd > sentStart ? sentEnd : sentStart + '小明今天早上來到学校，他很高兴'.length
    anns.push({ id: 's1', start: sentStart, end, type: 'sentence_issue', payload: { comment: '句式略显啰嗦，可合并精炼', suggestion: '可改为“早上小明来到学校，很高兴，因为……”' } })
  }

  // good: “明月何时照我还？” 与句级问题无重叠，展示多类型
  const good2Start = plainText.indexOf('明月何时照我还')
  if (good2Start >= 0) {
    anns.push({ id: 'g2', start: good2Start, end: good2Start + '明月何时照我还'.length, type: 'good', payload: { comment: '引用诗句，富有文采' } })
  }

  return {
    plainText,
    annotations: anns,
    meta: {
      score: 88,
      rating: '良好',
      summary: '整体表达流畅，文采较好；存在少量错别字与个别句式问题，建议注意规范用字与句式精炼。',
      perspectiveScore: { logic: 0.78, expression: 0.85, grammar: 0.72 }
    }
  }
}
