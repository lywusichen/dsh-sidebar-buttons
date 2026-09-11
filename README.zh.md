# dsh-sidebar-buttons

简体中文 · [English](./README.md)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件。
接管左下侧栏的按钮：拖动调整顺序，给每个按钮设置三种显示状态之一，并统一按钮高度。

## 兼容性

在 **DSH 0.1.5-rc.1**（web profile）上实测通过，0.1.2-rc.1 上也能正常运行。
这两个版本就是 `package.json` 里 `dsh.engines.dsh` 声明的范围，宿主和插件管理器
不必解析这份文档就能读到同样的信息。

所有逻辑都在浏览器侧。插件只是在 `sidebar.footer.action` 这个公开槽位里重新注册
条目，不碰 DSH 本体，也不改别的插件的文件，所以卸载后侧栏就回到原样。

## 安装

1. 安装插件：

   ```bash
   dsh plugin --profile web add github:lywusichen/dsh-sidebar-buttons
   ```

2. 重启 DSH。

3. 打开 **设置 → 侧栏按钮设置**。

## 功能

- 列出当前注册在侧栏底部的全部按钮。拖动行即可调整顺序，松手后侧栏立即生效。
- 每个按钮有三种显示状态：
  - **显示** —— 照常固定在侧栏里。
  - **折叠到更多** —— 收进"设置"上方的"更多"按钮。只有当存在折叠项时"更多"按钮
    才会出现，折叠进去的按钮在菜单里功能完整。
  - **完全隐藏** —— 侧栏和"更多"菜单里都没有，只有设置页能恢复。
- 不同插件的按钮高度不一样。可以统一成一个高度，也可以保持各自原样，或直接填
  自定义像素值。

## 截图

![更多按钮位置](assets/sidebar-more.png)

![更多菜单](assets/more-menu.png)

![设置导航位置](assets/settings-nav.png)

![设置页面](assets/settings-page.png)

## 实现方式

侧栏底部是一个 list 槽位，同一个 id 允许注册多个条目，渲染时按 `priority` 排序。
本插件把每个已有条目用 `priority: -1` 重新注册一份，让它排到原条目前面，再包一层
自己的组件去渲染原来那个。顺序、显隐、尺寸都由包装组件读取的共享 store 决定
（CSS `order` 加上 `--dsh-sbf-size` 变量）。整个过程不注销任何东西，所以关掉插件
就立刻交还给原条目。

有一类按钮不吃这套：槽位条目只是挂载锚点，真正的按钮由插件自己渲染到侧栏别处，
换个容器重新渲染搬不动它。这类按钮直接搬真实节点，组件常驻，节点按状态在侧栏、
"更多"菜单和隐藏区之间移动。

## 已知限制

- 槽位条目只是挂载锚点、按钮由插件自己画在侧栏别处时，本插件靠 `data-plugin-entry`
  标记或内置的声明表找到那个真实节点。两者都没有就认不出来，管不到。
- 顺序调整和"更多"菜单依赖 `slots.entries` 与 `slots.subscribe`，插件靠它们跟上
  自己加载之后才发生的注册。如果将来 DSH 改了 list 槽位的契约，本插件需要跟着更新。
- 三种状态按按钮 id 存储。两个插件注册同一个 id 时会共用一份状态。

## 构建

```bash
npm install   # esbuild
npm run build # 生成 lib/client.js
```

请把 `lib/client.js` 提交进仓库。git 方式安装直接消费构建产物。

## 许可

[MIT](LICENSE)
