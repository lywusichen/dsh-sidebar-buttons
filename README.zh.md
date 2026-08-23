# dsh-sidebar-buttons

简体中文 · [English](./README.md)

DeepSeek Harness 插件。管理左下侧栏的按钮:调整顺序、隐藏不用的按钮、统一按钮高度。纯客户端实现,不碰 DSH 核心,卸载即还原。

## 功能

- 设置里新增"侧栏按钮设置"页面,列出所有注册在侧栏脚部的按钮,拖动调整顺序,侧栏实时生效
- 每个按钮可单独开关显示;关掉的按钮收进"设置"上方的"更多"按钮(只有存在隐藏按钮时才会出现),点开仍能正常使用
- 不同插件做的按钮高度不一样,可以统一成一个高度,也可以保持原样或自定义像素值

## 截图

![更多按钮位置](assets/sidebar-more.png)

![更多菜单](assets/more-menu.png)

![设置导航位置](assets/settings-nav.png)

![设置页面](assets/settings-page.png)

## 安装

```bash
dsh plugin --profile web add github:lywusichen/dsh-sidebar-buttons
```

重启 DSH 后,打开 设置 → 侧栏按钮设置 即可。

## 构建

```bash
npm install   # esbuild
npm run build # 生成 lib/client.js
```

## 许可证

MIT
