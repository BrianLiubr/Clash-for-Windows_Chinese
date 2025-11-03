export type AnnotationType = 'good' | 'typo' | 'sentence_issue'

export interface AnnotationRange {
  id: string
  start: number // inclusive, UTF-16 code unit offset
  end: number   // exclusive
  type: AnnotationType
  color?: string
  payload?: {
    comment?: string
    suggestion?: string
    original?: string
    corrected?: string
  }
}

export interface MetaInfo {
  score?: number
  rating?: string
  summary?: string
  perspectiveScore?: Record<string, number>
}

export interface DemoData {
  plainText: string
  annotations: AnnotationRange[]
  meta?: MetaInfo
}

export interface Segment {
  start: number
  end: number
  text: string
  annotations: AnnotationRange[]
}
