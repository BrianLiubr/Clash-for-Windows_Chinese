# AI 作文批改 接口文档（MVP / 前端渲染用）

版本：v0.1.0

目标：前端依据本接口的“原文 + 基于偏移的区间标注”返回值进行渲染与交互（重叠高亮、点击详情）。本次仅定义数据结构与示例，不要求真实后端；可使用前端内置的“从 JSON 导入”载入下面示例数据进行验证。

---

一、整体返回结构 DemoData

- plainText: string
  原文纯文本。偏移（start/end）以 UTF-16 code unit 为单位，遵循 JavaScript 字符串 slice 语义。
- annotations: AnnotationRange[]
  对原文的基于偏移的区间标注，允许重叠。
- meta?: MetaInfo
  评分、评级与摘要等额外信息，用于页面顶部展示。

二、AnnotationRange

- id: string
  全局唯一标识，用于前端 diff 与弹窗条目展示。
- start: number（含）
- end: number（不含）
  约束：0 <= start < end <= plainText.length（单位：UTF-16 code unit）。
- type: 'good' | 'typo' | 'sentence_issue'
  - good：好词好句（前端渲染为绿色）
  - typo：错别字/字词规范（在文字上叠加删除线；不改变颜色）
  - sentence_issue：病句/句级问题（前端渲染为红色）
- color?: string
  可选。如果提供，前端可忽略或仅在不与内置规则冲突时使用。
- payload?: object（可选）
  - comment?: string 说明
  - suggestion?: string 修改建议
  - original?: string 原文本（用于 typo 等）
  - corrected?: string 修改后文本（用于 typo 等）

三、MetaInfo（可选）

- score?: number  总分（0-100）
- rating?: string  等级/评级
- summary?: string  概述/点评
- perspectiveScore?: Record<string, number>  各维度分（0-1 或 0-100，约定一致即可）

四、渲染规则（由前端实现）

- 将 annotations 进行线段切分：
  1) 收集所有 start/end 边界（含 0 与 plainText.length），排序去重；
  2) 相邻边界形成不重叠片段；
  3) 每个片段附着“覆盖该片段全区间”的所有标注（a.start <= seg.start 且 a.end >= seg.end）。
- 片段级样式（不嵌套 span）：
  - 颜色优先级：sentence_issue(红) > good(绿)
  - 删除线：若包含 typo 则始终叠加（不影响颜色优先级）
- 交互：
  - hover：tooltip 展示 comment 或 suggestion 简要合并
  - click：弹窗列出片段内所有标注，包含类型、范围、说明、建议与原/改文本

五、示例返回

```json
{
  "plainText": "春风又绿江南岸，明月何时照我还？\n小明今天早上來到学校，他很高兴，因爲他得了第一名。",
  "annotations": [
    {
      "id": "g1",
      "start": 0,
      "end": 4,
      "type": "good",
      "payload": { "comment": "用词生动" }
    },
    {
      "id": "t1",
      "start": 17,
      "end": 18,
      "type": "typo",
      "payload": { "comment": "繁体字", "original": "來", "corrected": "来", "suggestion": "改为“来到”" }
    },
    {
      "id": "t2",
      "start": 33,
      "end": 34,
      "type": "typo",
      "payload": { "comment": "错别字", "original": "爲", "corrected": "为", "suggestion": "改为“因为”" }
    },
    {
      "id": "s1",
      "start": 13,
      "end": 26,
      "type": "sentence_issue",
      "payload": { "comment": "句式略显啰嗦，可合并精炼", "suggestion": "可改为“早上小明来到学校，很高兴，因为……”" }
    },
    {
      "id": "g2",
      "start": 7,
      "end": 15,
      "type": "good",
      "payload": { "comment": "引用诗句，富有文采" }
    }
  ],
  "meta": {
    "score": 88,
    "rating": "良好",
    "summary": "整体表达流畅，文采较好；存在少量错别字与个别句式问题，建议注意规范用字与句式精炼。",
    "perspectiveScore": { "logic": 0.78, "expression": 0.85, "grammar": 0.72 }
  }
}
```

六、OpenAPI（建议）

可由后端实现以下接口（演示无需真实服务）：

- POST /api/v1/essay/correct
  - 请求：{ plainText: string, options?: object }
  - 响应：DemoData（如上）

亦可提供 GET /api/v1/essay/example 返回固定示例，用于联调。

七、注意事项 / 落地规范

- 偏移单位统一为 UTF-16 code unit。后端请基于同一编码规则生成 start/end。
- 保证 0 <= start < end <= plainText.length；非法区间前端会忽略。
- 允许区间重叠；同一片段可能同时包含多条不同类型标注。
- typo 的删除线与颜色相互独立，颜色由是否包含 good / sentence_issue 决定；删除线只取决于是否包含 typo。
- color 字段可选，前端可忽略或仅在不影响规则时使用。

八、前端对接说明

- 本仓库前端（Vite + React + TS）已实现：
  - 线段切分算法与重叠渲染
  - 悬浮 tooltip 与点击弹窗详情
  - 页面底部调试视图
  - “从 JSON 导入/导出”入口，可直接粘贴本接口文档示例验证
- 代码位置：
  - 类型：src/types.ts
  - 算法：src/utils/splitIntervals.ts (+ 单元测试)
  - 渲染：src/components/AnnotationRenderer.tsx
  - 示例：src/examples.ts
  - 页面：src/App.tsx（含 JSON 导入/导出）
