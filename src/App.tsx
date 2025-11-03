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
  const [jsonText, setJsonText] = useState<string>('')

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

  const loadFromJson = () => {
    try {
      const data = JSON.parse(jsonText)
      if (!data || typeof data !== 'object') throw new Error('JSON 必须为对象')
      if (typeof data.plainText !== 'string') throw new Error('缺少 plainText 字段')
      if (!Array.isArray(data.annotations)) throw new Error('缺少 annotations 数组')
      setPlainText(data.plainText)
      setAnnotations(data.annotations)
      setMeta(data.meta)
      alert('JSON 已载入')
    } catch (e: any) {
      alert('解析 JSON 失败：' + (e?.message || e))
    }
  }

  const exportJson = async () => {
    const obj: DemoData = { plainText, annotations, meta }
    const text = JSON.stringify(obj, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板')
    } catch {
      // 兼容不可用时，直接展示
      setJsonText(text)
      alert('无法写入剪贴板，已填入下方文本框，可自行复制')
    }
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

          <details style={{marginTop: 8}}>
            <summary style={{cursor: 'pointer'}}>从 JSON 导入/导出（遵循接口文档）</summary>
            <div style={{marginTop: 8}}>
              <textarea
                className="textarea"
                style={{minHeight: 120, fontFamily: 'monospace'}}
                placeholder='粘贴符合接口文档的 JSON，如 { "plainText": "...", "annotations": [ ... ], "meta": { ... } }'
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
              />
              <div className="controls">
                <button className="button" onClick={loadFromJson}>载入 JSON</button>
                <button className="button ghost" onClick={exportJson}>导出当前数据</button>
              </div>
            </div>
          </details>
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
