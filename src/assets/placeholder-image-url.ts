/**
 * 原 Figma Make 导出使用 `figma:asset/…`，仓库内无对应二进制文件时统一用此静态路径。
 * 部署时 `public/images/placeholder.png` 会原样拷贝到站点根路径。
 * 若有真实切图，可放到 `public/images/` 并改为按文件分别 import 具体路径。
 */
export default "/images/placeholder.png";
