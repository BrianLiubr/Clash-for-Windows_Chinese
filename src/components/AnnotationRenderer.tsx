import React, { useMemo, useState } from 'react'
import type { AnnotationRange, Segment } from '../types'
import { deriveSegmentClass, splitIntoSegments } from '../utils/splitIntervals'
import Modal from './Modal'

interface RendererProps {
  plainText: string
  annotations: AnnotationRange[]
}

function groupByType(anns: AnnotationRange[]) {
  const map: Record<string, AnnotationRange[]> = {}
  for (const a of anns) {
    if (!map[a.type]) map[a.type] = []
    map[a.type].push(a)
  }
  return map
}

export default function AnnotationRenderer({ plainText, annotations }: RendererProps) {
  const segments = useMemo(() => splitIntoSegments(plainText, annotations), [plainText, annotations])
  const [active, setActive] = useState<Segment | null>(null)

  return (
    <>
      <div className="render-box">
        {segments.map((seg, i) => {
          const { className, tooltip } = deriveSegmentClass(seg)
          return (
            <span
              key={`${seg.start}-${seg.end}-${i}`}
              className={className}
              title={tooltip}
              onClick={() => seg.annotations.length && setActive(seg)}
            >
              {seg.text}
            </span>
          )
        })}
      </div>

      <Modal
        title="标注详情"
        open={!!active}
        onClose={() => setActive(null)}
      >
        {active && (
          <div>
            <div style={{marginBottom: 8}}>选中文本：<strong>“{active.text}”</strong>（{active.start}~{active.end}）</div>
            {active.annotations.length === 0 ? (
              <div>无标注</div>
            ) : (
              Object.entries(groupByType(active.annotations)).map(([type, items]) => (
                <div key={type} style={{marginBottom: 12}}>
                  <div className={`type ${type}`} style={{display:'inline-block', marginBottom: 6}}>{type}</div>
                  {items.map(a => (
                    <div className="ann-item" key={a.id}>
                      <div className="ann-head">
                        <span className={`type ${a.type}`}>{a.type}</span>
                        <span className="kv">ID: {a.id}</span>
                        {typeof a.start === 'number' && typeof a.end === 'number' && (
                          <span className="kv">范围: {a.start}~{a.end}</span>
                        )}
                      </div>
                      {a.payload?.comment && <div className="kv">说明: {a.payload.comment}</div>}
                      {a.payload?.suggestion && <div className="kv">建议: {a.payload.suggestion}</div>}
                      {(a.payload?.original || a.payload?.corrected) && (
                        <div className="kv">原/改: {a.payload?.original ?? ''} → {a.payload?.corrected ?? ''}</div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
