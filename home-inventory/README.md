# 家物仓 · 家庭物品出入库

前后端分离的家庭库存管理系统（入库 / 出库 / 统计）。  
当前阶段：**只准备仓库结构、开发环境与部署骨架，前端业务页面尚未实现。**

## 技术选型

| 层 | 方案 | 说明 |
| --- | --- | --- |
| 前端 | React + Vite + TypeScript | 适合 iPad / 手机浏览器 |
| 后端 | Node.js + Express | 单进程部署简单 |
| 数据库 | SQLite（better-sqlite3） | 家庭场景够用，免运维 |
| 部署 | Docker + Nginx（腾讯云 CVM） | 后续上线使用 |

## 目录结构

```text
home-inventory/
├── client/          # 前端工程（目前仅占位页）
├── server/          # 后端 API
├── deploy/          # 腾讯云 / Docker 部署文件
├── .env.example     # 环境变量模板
├── package.json     # npm workspaces 根配置
└── README.md
```

## 在 iPad 上的推荐开发方式

1. **写代码**：用 Cursor Cloud Agent（当前方式），不依赖本机编译环境。
2. **存代码**：推送到 GitHub（建议新建独立仓库，不要混在 X-SENSE 产品站里）。
3. **上线**：在腾讯云 CVM 上用 Docker 拉取仓库并启动（可用 Termius / a-Shell 做 SSH）。

## 本地 / Cloud Agent 启动

```bash
cd home-inventory
cp .env.example .env   # 按需修改
npm install
npm run dev            # 同时启动 API :3001 与 Vite :5173
```

单独启动：

```bash
npm run dev -w server
npm run dev -w client
```

健康检查：`GET http://127.0.0.1:3001/api/health`

## 已实现的后端能力（骨架）

- 物品 CRUD：`/api/items`
- 出入库：`/api/movements`
- 统计：`/api/stats`
- 可选访问口令：`ACCESS_TOKEN`

## 腾讯云部署（概要）

详细步骤见 [`deploy/README.md`](./deploy/README.md)。核心流程：

1. 购买 / 准备一台 CVM（建议 Ubuntu 22.04）
2. 安装 Docker
3. 克隆本仓库，进入 `home-inventory`
4. 配置 `.env` 中的 `ACCESS_TOKEN`
5. `docker compose -f deploy/docker-compose.yml up -d --build`
6. 安全组放行 80 端口

## 下一步

1. 在 GitHub 新建独立仓库（例如 `home-inventory`），把本目录作为仓库根目录推送
2. 在 Cursor 中绑定该仓库的 Cloud Agent 环境并 Save
3. 再实现前端业务页面（总览 / 物品 / 出入库 / 流水）
