# 腾讯云部署说明

面向家庭自用的最小部署方案：单机 Docker，反向代理静态前端 + API。

## 前置条件

- 腾讯云 CVM（Ubuntu 22.04 LTS 推荐）
- 公网 IP，安全组放行 `22`（SSH）与 `80`（HTTP）
- 服务器已安装 Docker 与 Docker Compose 插件

## 服务器初始化（首次）

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# 重新登录后生效
```

## 部署

```bash
git clone <你的仓库地址> home-inventory-repo
cd home-inventory-repo/home-inventory   # 若仓库根已是本项目，则 cd 到根目录即可
cp .env.example .env
# 编辑 .env：设置强随机 ACCESS_TOKEN
docker compose -f deploy/docker-compose.yml up -d --build
```

访问：`http://<公网IP>/`

## 更新版本

```bash
git pull
docker compose -f deploy/docker-compose.yml up -d --build
```

## 数据持久化

SQLite 数据挂载在 Docker volume `inventory-data`，重建容器不会丢库存。

备份示例：

```bash
docker compose -f deploy/docker-compose.yml cp app:/data/inventory.db ./backup-inventory.db
```

## 安全建议

- 生产环境务必设置 `ACCESS_TOKEN`
- 有域名后可再加 HTTPS（腾讯云 CLB 或 Caddy / Certbot）
- 不要把 `.env` 提交到 GitHub
