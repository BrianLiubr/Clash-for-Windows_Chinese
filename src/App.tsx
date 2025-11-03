import React, { useMemo, useState } from 'react'
import type { AnnotationRange, DemoData } from './types'
import AnnotationRenderer from './components/AnnotationRenderer'
import { splitIntoSegments } from './utils/splitIntervals'
import { buildExample } from './examples'

export default function App() {
  const [plainText, setPlainText] = useState<string>('')
  const [annotations, setAnnotations] = useState<AnnotationRange[]>([])
  const [meta, setMeta] = useState<DemoData['meta']>()
  const [showDebug, setShowDebug] = useState(false)

  const segments = useMemo(() => splitIntoSegments(plainText, annotations), [plainText, annotations])

  const loadExample = () => {
    const demo = buildExample()
    setPlainText(demo.plainText)
    setAnnotations(demo.annotations)
    setMeta(demo.meta)
  }

  const clearAll = () => {
    setPlainText('')
    setAnnotations([])
    setMeta(undefined)
  }

  return (
    <div className="container">
      <div className="header">
        <h1 style={{margin: 0, fontSize: 18}}>AI 作文批改 Web 演示（重叠高亮）</h1>
        <div className="meta">
          {typeof meta?.score === 'number' && <div className="badge score">总分 {meta.score}</div>}
          {meta?.rating && <div className="badge rating">评级 {meta.rating}</div>}
        </div>
      </div>
      {meta?.summary && (
        <div className="card" style={{marginBottom: 12}}>
          <div style={{fontSize: 14, color: '#374151'}}>{meta.summary}</div>
        </div>
      )}

      <div className="layout">
        <div className="card">
          <h2>输入区</h2>
          <textarea
            className="textarea"
            placeholder="在此粘贴原文，或点击下方“加载示例数据”"
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
          />
          <div className="controls">
            <button className="button" onClick={loadExample}>加载示例数据</button>
            <button className="button secondary" onClick={clearAll}>清空</button>
          </div>
          <div style={{fontSize: 12, color: '#6b7280'}}>
            注：标注区间基于 UTF-16 code unit 偏移，与 JavaScript 字符串 slice 对齐。
          </div>
        </div>

        <div className="card">
          <h2>渲染区</h2>
          <AnnotationRenderer plainText={plainText} annotations={annotations} />
        </div>
      </div>

      <div className="footer">
        <div className="debug-toggle">
          <input id="debug" type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} />
          <label htmlFor="debug">显示调试视图（切分片段与标注）</label>
        </div>
        {showDebug && (
          <div className="card">
            <h2>调试视图</h2>
            <div className="debug">
{JSON.stringify(
  segments.map(s => ({ range: [s.start, s.end], text: s.text, anns: s.annotations.map(a => ({ id: a.id, type: a.type })) })),
  null,
  2
)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
