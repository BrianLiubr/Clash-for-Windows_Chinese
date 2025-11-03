# AI 作文批改 Web 演示（重叠高亮 + 线段切分）

本目录在仓库根目录提供了一个最小可用的 Web 演示，基于 React + Vite + TypeScript 实现，无第三方富文本依赖，通过自定义渲染实现可控的覆盖与交互。

功能概览：
- 加载示例原文与批注数据
- 在原文上渲染三类标注：好词好句(good)、错别字(typo)、病句(sentence_issue)
- 支持区间重叠的“线段切分”算法，合成不可重叠片段并叠加样式
- 悬浮显示提示，点击片段打开详情 Modal，列出所有覆盖该片段的标注
- 调试视图展示切分后的片段与标注
- 含关键算法（区间切分）单元测试

## 启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 即可看到演示页面。

## 核心数据模型

- plainText: string — 原文纯文本（UTF-16 code unit 序列）
- annotations: AnnotationRange[] — 基于偏移的区间标注
  - id: string
  - start: number — 起始偏移（含）
  - end: number — 结束偏移（不含）
  - type: 'good' | 'typo' | 'sentence_issue'
  - color?: string — 可选，若无由前端根据 type 映射
  - payload?: {
      comment?: string
      suggestion?: string
      original?: string
      corrected?: string
    }
- meta?: { score?: number; rating?: string; summary?: string; perspectiveScore?: Record<string, number> }

说明：采用“原文 + 基于偏移的区间”模式，天然与 OCR/后端对齐，易于扩展到句/段/篇层次。

## 重叠标注处理（线段切分）

文件：src/utils/splitIntervals.ts

步骤：
1) 收集所有开始/结束边界（含 0 与文本末尾），排序去重；
2) 以相邻边界形成不重叠片段；
3) 对每个片段，附着所有“覆盖该片段全区间”的标注（即 a.start <= seg.start 且 a.end >= seg.end）。

渲染规则：
- 片段级单层 span 渲染（不使用嵌套 span），根据包含的标注类型组合样式：
  - 字体颜色优先级：sentence_issue(红) > good(绿)
  - 删除线独立：若包含 typo 则始终叠加删除线

## 示例与交互

- 悬浮展示 comment / suggestion 的简要 tooltip（取片段内全部标注的简要信息合并）
- 点击弹出 Modal，展示该片段包含的所有标注，含类型、说明、建议与原/改文本
- 页面底部可开启“调试视图”，查看切分片段与标注绑定情况

## 目录结构（关键）

- src/
  - App.tsx — 页面与交互
  - components/
    - AnnotationRenderer.tsx — 切分与渲染
    - Modal.tsx — 详情弹窗
  - utils/
    - splitIntervals.ts — 线段切分与样式推导
    - splitIntervals.test.ts — 单元测试（Vitest）
  - examples.ts — 示例数据生成（计算偏移）
  - types.ts — 类型定义

## 扩展点

- 富文本：可在保持“片段级”模型前提下扩展为多段/多块渲染
- 分句增强：可在后端提供分句范围，前端按照句级/段落级进行层次渲染
- 后端对接：将当前 DemoData 改为接口返回，渲染逻辑保持不变
- OCR：在此数据模型基础上增加版面结构（页/段/行/字）并映射偏移

## 许可

此 Demo 仅用于演示最小可行的渲染与交互方案，便于后续与实际服务集成。
