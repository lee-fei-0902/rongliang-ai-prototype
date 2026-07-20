# 容量AI - 无限画布创作工具 PRD

> **版本**: V4.0  
> **创建日期**: 2026-07-13  
> **更新日期**: 2026-07-16  
> **作者**: 产品团队  
> **状态**: 原型迭代中

---

## 一、版本更新记录

| 版本 | 日期 | 修改内容 |
|------|------|---------|
| V1.0 | 2026-07-13 | 初始版本，画布基础能力+节点系统+连线规则 |
| V2.0 | 2026-07-14 | 工作台SPA重构，项目详情页，步骤导航 |
| V3.0 | 2026-07-15 | 工具箱页面，画布资产导入弹窗，参考图上传 |
| V4.0 | 2026-07-16 | 文本节点多状态重构，节点封面文案统一，标题双击编辑，添加节点默认展开 |

---

## 二、背景

### 2.1 业务背景

容量AI系统当前的工作台缺少可视化的AI创作工作流编排能力。随着AI内容创作（短剧、视频、图片）场景日益复杂，用户需要在一个统一的画布中完成从剧本→角色→场景→分镜→视频→成片的全流程编排，而非在多个工具间来回切换。

### 2.2 竞品参考

| 竞品 | 核心能力 | 差异化 |
|------|---------|--------|
| **小云雀短剧Agent 2.0** | 剧本联动动画布，角色/场景一致性锁定，一键成片 | 字节Seedance 2.0引擎，短剧垂直场景深耕 |
| **LibTV (LiblibAI)** | 无限画布+节点式工作流，5种基础节点，20+专业工具 | 模型丰富（20+图像/30+视频），Agent Skill接口 |
| **ComfyUI** | 节点式AI图像生成工作流 | 开源、本地部署、社区节点生态 |
| **infinite-canvas (开源)** | 多画布项目、节点拖拽缩放、MCP协议集成 | 开源、浏览器直连OpenAI兼容接口 |

### 2.3 核心洞察

1. **节点图 > 线性脚本**：节点式工作流天然支持分支复用、局部重跑、依赖可视化
2. **类型化连边**：只有上游输出类型与下游输入类型兼容时才能连线，保证图可执行
3. **DAG + 拓扑排序**：有向无环图保证执行顺序，支持分支与局部重跑
4. **画布即项目**：整张画布 = 一个完整的创作项目，nodes + edges + viewport 持久化

---

## 三、目标

| 目标 | 衡量指标 | 优先级 |
|------|---------|--------|
| 提供可视化AI创作工作流编排能力 | 画布功能完整度 ≥ 竞品90% | P0 |
| 降低多步骤AI创作门槛 | 新用户30分钟内完成首个工作流 | P0 |
| 支持工作流模板化复用 | 模板复用率 ≥ 40% | P1 |
| 与容量AI现有工作台无缝融合 | 从工作台到画布的跳转转化率 ≥ 60% | P0 |

---

## 四、功能模块清单

### FE-01：工作台（index.html）

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 项目管理 | 项目列表、筛选（制作组/创建人/状态）、搜索 | ✅ |
| 快速开始 | 新建项目卡片 | ✅ |
| SPA页面切换 | 工作台/项目详情/工具箱页面切换 | ✅ |
| 步骤导航 | ①资产管理 → ②分镜剧本 → ③视频预览 | ✅ |
| 创建/进入无限画布 | 项目详情顶部入口按钮（Beta） | ✅ |

### FE-02：工具箱（index.html）

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 配音创作 | 功能卡片入口 | ✅ |
| 图片创作 | 功能卡片入口 | ✅ |
| 视频创作 | 功能卡片入口 | ✅ |
| 创建/进入无限画布 | 功能卡片入口，跳转canvas.html | ✅ |

### FE-03：项目详情页（index.html）

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 资产类型垂直导航 | 角色/场景/道具/通用素材 左侧导航 | ✅ |
| 角色列表 | 搜索框+角色卡片（头像+名称+状态数） | ✅ |
| 主视图/三视图切换 | Tab切换，主视图大图预览 | ✅ |
| 图片预览+工具栏 | 编辑/下载/全屏/列数 工具按钮 | ✅ |
| 信息栏 | 来源/模型/时间/设为参考图 | ✅ |
| 生成记录 | 标题+批量生成+缩略图列表 | ✅ |
| AI生图配置面板 | 模型/分辨率/数量/比例/参考图/提示词/确认生图 | ✅ |
| 参考图上传 | hover展开：本地上传/资产库导入/画布资产导入 | ✅ |

### FE-04：画布资产导入弹窗（index.html）

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 暗色主题 | #1e1e2e 背景 | ✅ |
| 标题 | 画布资产导入 | ✅ |
| 缩放控制 | − 100% + | ✅ |
| 筛选标签 | 全部/角色生成/场景生成/道具生成/图片生成/分镜视频/视频合成 | ✅ |
| 卡片网格 | 按日期分组，缩略图+复选框+名称+类型标签 | ✅ |
| 批量操作栏 | 已选N项/下载/删除/使用/取消选择 | ✅ |
| Tab筛选 | 点击标签过滤对应类型卡片 | ✅ |

### FE-05：无限画布节点系统（canvas.html）

#### 5.1 节点类型

| 节点类型 | 图标 | 输入 | 输出 | 封面文案（空状态） | 状态 |
|---------|------|------|------|------------------|------|
| **文本节点** | 📜 | 无 | script | 双击直接编写，或发起生成 | ✅ |
| **角色生成** | 👤 | script | character | 描述内容，开启角色创作 | ✅ |
| **场景生成** | 🏞️ | script | scene | 描述内容，开启场景创作 | ✅ |
| **道具生成** | 💎 | script,scene | prop | 描述内容，开启道具创作 | ✅ |
| **图片生成** | 🖼️ | script,storyboard | image | 描述内容，开启图片创作 | ✅ |
| **分镜视频** | 🎬 | script,character | storyboard | - | ✅ |
| **视频合成** | ✂️ | storyboard,video | video | - | ✅ |

#### 5.2 节点卡片

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 卡片布局 | 标题栏（图标+可编辑名称+状态+下载+展开）+ 内容区域 | ✅ |
| 标题双击编辑 | 所有节点标题支持双击编辑名称 | ✅ |
| 内容区域 | 有内容显示文本，无内容显示空状态提示 | ✅ |
| 下载按钮 | 文本节点有内容时显示⬇，导出txt格式 | ✅ |
| 添加节点默认展开 | 新增节点 expanded=true | ✅ |

#### 5.3 文本节点多状态

| 状态 | 触发条件 | 界面内容 | 状态 |
|------|---------|---------|------|
| **编辑状态** | 默认/添加节点后 | @提示+文本输入框+模型+⚡1生成 | ✅ |
| **生成中** | 点击生成按钮 | 加载动画+"AI 正在生成中..." | ✅ |
| **生成结果** | 3秒后自动完成 | 编辑面板保持显示（@提示+文本框+模型+⚡1生成），结果通过setDesc显示在卡片内容区 | ✅ |

#### 5.4 角色生成节点

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 封面区域 | 无图时显示👤+"描述内容，开启角色创作" | ✅ |
| 标题编辑 | input可编辑角色名称 | ✅ |
| 生成中动画 | 旋转图标覆盖预览区 | ✅ |
| 完成状态 | 绿色✓标记 | ✅ |

#### 5.5 场景/道具生成节点（VisualNode）

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 封面区域 | 无图时显示对应图标+"描述内容，开启场景/道具创作" | ✅ |
| 标题编辑 | input可编辑名称 | ✅ |
| 底部信息栏 | 已去掉 | ✅ |

#### 5.6 图片生成节点

| 功能项 | 说明 | 状态 |
|--------|------|------|
| 封面区域 | 无图时显示🖼️+"描述内容，开启图片创作" | ✅ |
| 底部信息栏 | 已去掉 | ✅ |

---

## 五、交互说明

### 5.1 页面布局

```
┌──────────────────────────────────────────────────────┐
│  顶部导航栏                                           │
│  [Logo] [工作台] [工具箱] [音色库] [视频超分] [资产库]  │
│  [积分] [通知] [头像]                                 │
├────────┬─────────────────────────────────┬────────────┤
│ 资产   │                                  │ AI生图     │
│ 类型   │       主内容区                    │ 配置面板   │
│ 导航   │                                  │            │
│ ├角色  │   [角色卡片列表]                  │ 模型选择   │
│ ├场景  │   [主视图/三视图]                │ 分辨率     │
│ ├道具  │   [图片预览+工具栏]              │ 数量比例   │
│ └通用  │   [生成记录]                     │ 参考图     │
│        │                                  │ 提示词     │
│ 角色列表│                                  │ 确认生图   │
│ [搜索]  │                                  │            │
│ [角色卡]│                                  │            │
├────────┴─────────────────────────────────┴────────────┤
│  浮动按钮：[重新提取本集资产] [批量生成资产图]           │
└──────────────────────────────────────────────────────┘
```

### 5.2 画布节点交互

| 交互 | 触发方式 | 反馈 |
|------|---------|------|
| 添加节点 | 双击画布/拖拽/右键菜单 | 节点出现在画布，**编辑面板默认展开** |
| 选中节点 | 单击节点 | 节点高亮边框 |
| 编辑名称 | **双击标题** | 标题变为input，全选文字 |
| 下载文本 | 点击⬇按钮 | 导出txt文件（仅text_node有内容时） |
| 展开面板 | 点击节点卡片 | 切换展开/收起 |
| 卡片内容 | 始终显示 | 有内容显示文本，无内容显示空状态提示 |
| 执行生成 | 点击⚡1生成 | 进入生成中状态，3秒后完成 |

### 5.3 文本节点状态流转

```
[添加节点] ──展开──→ [编辑面板]
                        │
                   输入文本+点击⚡1生成
                        ↓
                   [生成中] ──3秒──→ [生成结果]
                        │                │
                   结果写入desc      编辑面板保持显示
                   卡片显示内容       可继续输入再次生成
```

### 5.4 参考图上传交互

```
[参考图区域] ──hover──→ [下拉菜单]
                         ├ 📁 本地上传
                         ├ 🗂️ 资产库导入
                         └ 📐 画布资产导入 ──→ [暗色弹窗]
                                                ├ 筛选标签
                                                ├ 卡片网格(按日期分组)
                                                ├ 复选框选择
                                                ├ 批量操作栏
                                                └ 确认导入
```

---

## 六、数据指标

### 6.1 核心指标

| 指标 | 定义 | 目标值 |
|------|------|--------|
| 画布项目创建数 | 每日新建画布项目数量 | - |
| 工作流完成率 | 创建后完成首次执行的比例 | ≥ 70% |
| 人均节点数 | 每个画布项目的平均节点数量 | ≥ 5 |
| 局部重跑率 | 使用局部重跑的比例 | ≥ 30% |
| 文本节点使用率 | 使用文本节点生成的比例 | ≥ 80% |

### 6.2 埋点需求

| 事件 | 参数 | 用途 |
|------|------|------|
| canvas_create | project_id, source | 项目创建来源 |
| node_add | project_id, node_type, method | 节点创建偏好 |
| node_generate | node_type, model, status | 生成行为分析 |
| text_download | node_id, text_length | 文本下载行为 |
| canvas_asset_import | asset_count, asset_type | 画布资产导入行为 |
| ref_image_upload | source(local/asset/canvas) | 参考图上传来源 |

---

## 七、验收标准

### 7.1 工作台

| # | 验收条件 | EARS类型 |
|---|---------|---------|
| AC-01 | The system shall display project list with filter by team/creator/status | Ubiquitous |
| AC-02 | When user clicks a project, the system shall navigate to project detail page | Event-driven |
| AC-03 | The system shall display step navigation: 资产管理→分镜剧本→视频预览 | Ubiquitous |
| AC-04 | When user clicks "创建/进入无限画布", the system shall navigate to canvas.html | Event-driven |

### 7.2 工具箱

| # | 验收条件 | EARS类型 |
|---|---------|---------|
| AC-05 | When user clicks "工具箱" in nav, the system shall display toolbox page | Event-driven |
| AC-06 | The system shall display 4 function cards: 配音/图片/视频/无限画布 | Ubiquitous |
| AC-07 | When user clicks "创建/进入无限画布" card, the system shall navigate to canvas.html | Event-driven |

### 7.3 项目详情页

| # | 验收条件 | EARS类型 |
|---|---------|---------|
| AC-08 | The system shall display asset type navigation: 角色/场景/道具/通用素材 | Ubiquitous |
| AC-09 | The system shall display character list with search and avatar cards | Ubiquitous |
| AC-10 | The system shall display main view/three view tabs with image preview | Ubiquitous |
| AC-11 | The system shall display AI config panel with model/resolution/ratio/reference/prompt | Ubiquitous |
| AC-12 | When user hovers over reference upload area, the system shall show 3 options: 本地上传/资产库导入/画布资产导入 | Event-driven |
| AC-13 | When user clicks "画布资产导入", the system shall show dark theme modal | Event-driven |

### 7.4 画布资产弹窗

| # | 验收条件 | EARS类型 |
|---|---------|---------|
| AC-14 | The system shall display asset cards in dark theme (#1e1e2e) grouped by date | Ubiquitous |
| AC-15 | The system shall display filter tabs: 全部/角色生成/场景生成/道具生成/图片生成/分镜视频/视频合成 | Ubiquitous |
| AC-16 | When user clicks a filter tab, the system shall filter cards by type | Event-driven |
| AC-17 | When user selects cards, the system shall show batch action bar with count | Event-driven |
| AC-18 | When user clicks "使用", the system shall import selected assets and close modal | Event-driven |

### 7.5 节点系统

| # | 验收条件 | EARS类型 |
|---|---------|---------|
| AC-19 | When user adds a new node, the system shall expand the editing panel by default | Event-driven |
| AC-20 | When user double-clicks a node title, the system shall enable inline editing | Event-driven |
| AC-21 | The system shall display empty state prompts on node cards: text_node→双击直接编写, character→描述内容开启角色创作, scene→描述内容开启场景创作, prop→描述内容开启道具创作, image→描述内容开启图片创作 | Ubiquitous |
| AC-22 | When text node has content (desc), the system shall display content text on the card | State-driven |
| AC-23 | When text node has content, the system shall display ⬇ download button in the card header | State-driven |
| AC-24 | When user clicks download, the system shall export content as .txt file | Event-driven |

### 7.6 文本节点多状态

| # | 验收条件 | EARS类型 |
|---|---------|---------|
| AC-25 | When user adds a text node, the system shall display edit panel with @hint + textarea + model + ⚡1 generate button | Event-driven |
| AC-26 | When user clicks "⚡1 生成", the system shall display loading animation with "AI 正在生成中..." | Event-driven |
| AC-27 | When generation completes (3s), the system shall write result to desc and display on card, keeping edit panel visible | Event-driven |
| AC-28 | While text node is in edit/result state, the system shall keep @hint + textarea + model + ⚡1 generate visible | State-driven |

### 7.7 角色/场景/道具/图片节点

| # | 验收条件 | EARS类型 |
|---|---------|---------|
| AC-29 | The system shall display empty state text on character node: "描述内容，开启角色创作" | Ubiquitous |
| AC-30 | The system shall display empty state text on scene node: "描述内容，开启场景创作" | Ubiquitous |
| AC-31 | The system shall display empty state text on prop node: "描述内容，开启道具创作" | Ubiquitous |
| AC-32 | The system shall display empty state text on image node: "描述内容，开启图片创作" | Ubiquitous |
| AC-33 | The system shall not display bottom info bar on character/scene/prop/image nodes | Ubiquitous |
| AC-34 | When user double-clicks scene/prop node title, the system shall enable inline editing | Event-driven |

---

## 八、待确认问题

1. **模型接入**：文本节点模型选项（Lux Gem 3.0等）需要确认接入哪些LLM
2. **生成结果存储**：文本生成结果是否需要持久化到服务端
3. **画布资产数据源**：画布资产导入弹窗的数据从哪个接口获取
4. **多选上限**：参考图上传显示(0/12)，12是否为硬限制
5. **生成时间**：当前3秒模拟，实际生成时间需对接后端
6. **权限体系**：画布项目的查看/编辑/分享权限设计

---

## 九、技术备注

### 9.1 文件结构

| 文件 | 说明 | 行数 |
|------|------|------|
| `index.html` | 工作台+项目详情+工具箱+画布资产弹窗 | ~900 |
| `canvas.html` | 无限画布编辑器（React+ReactFlow） | ~3500 |

### 9.2 关键组件

| 组件 | 文件 | 说明 |
|------|------|------|
| `TextNodePanel` | canvas.html | 文本节点编辑面板（多状态） |
| `CustomNode` | canvas.html | 通用节点（文本/分镜/合成） |
| `CharacterNode` | canvas.html | 角色生成节点 |
| `VisualNode` | canvas.html | 场景/道具生成节点 |
| `ImageNode` | canvas.html | 图片生成节点 |
| 画布资产弹窗 | index.html | 暗色主题卡片网格弹窗 |

### 9.3 部署

- GitHub Pages 永久托管（lee-fei-0902/rongliang-ai-prototype）
- Cloudflare Tunnel 临时预览
- GitHub Token 无 repo 写权限，需手动 `git push`
