# 任务流

基于 Vue 3、Vite、TypeScript、Tailwind CSS 与 Pinia 的个人任务管理看板。

在线使用：[https://task-flow-board-20260922.xiaohwai.chatgpt.site](https://task-flow-board-20260922.xiaohwai.chatgpt.site)

## 功能

- 三列看板与跨列、列内拖拽
- 任务新增、编辑、删除与字段校验
- localStorage 版本化持久化及损坏数据保护
- JSON 原子导入、导出备份
- 浅色 / 深色主题记忆
- 键盘可用的弹窗与表单错误关联
- 保存失败恢复与原始损坏数据备份
- 可安装 PWA，首次打开后支持离线使用
- Windows 桌面应用，数据仍只保存在本机

## 安装

### 网页应用

打开在线地址后，使用浏览器的“安装应用”功能。支持安装的浏览器会在页面顶部显示“安装应用”按钮。

### Windows

从 [GitHub Releases](https://github.com/Hwai123/Task_management_app/releases/latest) 下载 `Task.Flow_1.0.0_x64-setup.exe`。首版暂未购买代码签名证书，Windows SmartScreen 可能显示保护提示；请确认下载地址属于本仓库后再选择“更多信息”并继续运行。

网页版和 Windows 版使用不同的本地存储空间。如需迁移任务，请先在原版本导出 JSON，再在新版本导入。

## 本地运行

```bash
npm install
npm run dev
```

Windows 桌面开发：

```bash
npm run desktop:dev
```

## 验证

```bash
npm test
npm run build
npm run desktop:build
```

## 隐私

任务数据、主题设置和备份内容默认只保存在用户自己的设备上。应用不要求注册账号，也不会把任务上传到服务器。

