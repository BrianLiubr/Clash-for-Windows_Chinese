import { describe, it, expect } from 'vitest'
import type { AnnotationRange } from '../types'
import { splitIntoSegments, normalizeAnnotations } from './splitIntervals'

describe('normalizeAnnotations', () => {
  it('clamps and drops invalid', () => {
    const text = 'abcd'
    const anns: AnnotationRange[] = [
      { id: '1', start: -2, end: 2, type: 'good' },
      { id: '2', start: 3, end: 8, type: 'typo' },
      { id: '3', start: 2, end: 2, type: 'sentence_issue' }, // invalid
    ]
    const out = normalizeAnnotations(text, anns)
    expect(out).toEqual([
      { id: '1', start: 0, end: 2, type: 'good' },
      { id: '2', start: 3, end: 4, type: 'typo' },
    ])
  })
})

describe('splitIntoSegments', () => {
  it('basic non-overlap splitting', () => {
    const text = 'abcd'
    const anns: AnnotationRange[] = [
      { id: 'a', start: 0, end: 2, type: 'good' },
    ]
    const segs = splitIntoSegments(text, anns)
    expect(segs.map(s => ({ range: [s.start, s.end], anns: s.annotations.map(a => a.id) }))).toEqual([
      { range: [0, 2], anns: ['a'] },
      { range: [2, 4], anns: [] },
    ])
    expect(segs[0].text).toBe('ab')
    expect(segs[1].text).toBe('cd')
  })

  it('overlap splitting attaches covering annotations', () => {
    const text = 'abcdefgh'
    const anns: AnnotationRange[] = [
      { id: 'A', start: 0, end: 4, type: 'good' },
      { id: 'B', start: 2, end: 6, type: 'typo' },
      { id: 'C', start: 5, end: 8, type: 'sentence_issue' },
    ]
    const segs = splitIntoSegments(text, anns)
    // boundaries: 0,2,4,5,6,8
    expect(segs.map(s => ({ r: [s.start, s.end], anns: s.annotations.map(a => a.id) }))).toEqual([
      { r: [0, 2], anns: ['A'] },
      { r: [2, 4], anns: ['A', 'B'] },
      { r: [4, 5], anns: ['B'] },
      { r: [5, 6], anns: ['B', 'C'] },
      { r: [6, 8], anns: ['C'] },
    ])
  })

  it('handles empty annotations', () => {
    const text = '你好，世界\nHello, world.'
    const segs = splitIntoSegments(text, [])
    expect(segs).toHaveLength(1)
    expect(segs[0].text).toBe(text)
  })
})
