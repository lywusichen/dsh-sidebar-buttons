# dsh-sidebar-buttons

一个管理 DeepSeek Harness 左下侧栏按钮的插件：调整顺序、隐藏不用的按钮、统一按钮高度。

![更多按钮](assets/sidebar-more.png)
*有按钮被隐藏时，"更多"会出现在"设置"上方。*

![更多菜单](assets/more-menu.png)
*被隐藏的按钮收进"更多"菜单，点开还能正常用。*

## 功能

- **排序**：设置里的"侧栏按钮设置"页面会列出所有注册在侧栏脚部的按钮，拖动即可调整顺序，侧栏实时生效。
- **显隐**：每个按钮可以单独开关。关掉的按钮会收进"设置"上方的"更多"按钮（只有存在隐藏按钮时它才出现），在菜单里点开仍能使用。
- **统一高度**：不同插件做的按钮高度不一样，可以在设置里给所有按钮选一个统一高度，也可以保持原样或自定义像素值。

![设置导航](assets/settings-nav.png)
*"侧栏按钮设置"位于"通用设置"和"模型"之间。*

![设置页面](assets/settings-page.png)
*拖动排序、开关显隐、调整高度都在这里。*

## 原理

插件把每个侧栏按钮以更低的优先级重新注册一份"镜像"，复用原来的组件和参数，按钮行为完全不变；顺序、显隐、尺寸由一份持久化的配置控制。全部在客户端完成，不碰 DSH 核心，卸载插件即可完全还原。

## 安装

```bash
dsh plugin --profile web add github:lywusichen/dsh-sidebar-buttons
```

本地开发安装：

```bash
dsh plugin --profile web add link:G:/github/dsh-sidebar-buttons
```

重启 DSH 后，打开 **设置 → 侧栏按钮设置** 即可。

## 开发

```bash
npm install   # prepare 钩子会自动构建 lib/client.js
npm run build # 从 src/client.jsx 重新生成 lib/client.js
```

`lib/client.js` 是发布产物，需要提交。

## 许可证

MIT
