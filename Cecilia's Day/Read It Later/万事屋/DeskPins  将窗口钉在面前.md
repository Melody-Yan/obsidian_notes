---
created: 2024-12-07T19:32
updated: 2024-12-07T19:32
---
[[ReadItLater]] [[Article]]

# [DeskPins | 将窗口钉在面前](https://zhuanlan.zhihu.com/p/104495903)

有的人，一边看番，一边却在刷题；

有的人，一边网课，一边却在摸鱼。

---

众所周知，窗口置顶是很常见的一个需求，然而，Windows竟然没有原生支持？

有众多的Windows增强辅助软件内包括了这一功能，通过AutoHotKey脚本也可以自己定制；

然而，如果我不想要臃肿多余的功能，也不会折腾脚本，只想要一个纯粹的置顶功能呢？

---

来来来，有请DeskPins。

![](Read%20It%20Later/百宝箱/resource/v2-029fefe1bf10ec9f4da0b36a542082c4_b.png)

### 介绍

DeskPins是希腊程序员Elias Fotinis (Ηλίας Φωτείνης)开发的窗口置顶软件。它的名称直译过来就是“桌面图钉”，待会从下文的介绍可以看出这个名字非常形象。虽然界面风格有些远古气息，但这不妨碍它功能专一，小巧方便。

## 使用

开始运行之后，除了系统托盘栏的图标之外，几乎没有存在感。内存占用也只有这个时代几乎可以忽略不计的几MB。

![](Read%20It%20Later/百宝箱/resource/v2-bce570eb4c6a63865dfce849ad5aa31d_b.jpg)

这款软件以鼠标操作为主，当你想要将某个窗口置顶时，只要单击托盘图标，鼠标就会变成一个灰色的图钉形状：

![](Read%20It%20Later/百宝箱/resource/v2-c65ab5916b333cb479fe5a7f20414e0b_b.png)

这时你只要在要置顶的窗口上单击，就可以将这个窗口钉在最前端。此时这个窗口的标题栏右侧会有一个图钉标识：

![](Read%20It%20Later/百宝箱/resource/v2-583abe66bb243c463a0951befdef5425_b.png)

标识的颜色可以自己设置。取消置顶也很方便，只要点击一下这个图钉标识即可。

只是有一点，图钉“钉”的位置往往不固定，有时候会挡住按钮，或者出现在一些奇怪的地方。

Tips：在设置中可以调整标识跟随窗口的频率，太高会占用CPU，太低的话在移动窗口的时候图钉标识容易产生残影。

**当然，如果你是键盘流，DeskPins也支持快捷键！~(￣▽￣)~\***

## 兼容性

DeskPins努力适配了大部分类型的窗口：

### 传统标题栏应用软件

![](Read%20It%20Later/百宝箱/resource/v2-9817996971d7467ca082b3001d84c5f7_b.png)

### 大部分国产自绘皮肤软件

![](Read%20It%20Later/百宝箱/resource/v2-9437c8523f46579f42508937ce5c35b5_b.jpg)

![](Read%20It%20Later/百宝箱/resource/v2-90c11bca3811efca032ffbf736b165fb_b.png)

### 多标签应用软件

支持对单独窗口置顶

![](Read%20It%20Later/百宝箱/resource/v2-b338b8e4767d9d85319f07e420aa936a_b.jpg)

### UWP应用

（来自Win10应用市场）

**不完全支持。**有置顶效果但很混乱，有时无法显示图标，往往有错误提示。

## 自动置顶

DeskPins还支持自动置顶。

![](Read%20It%20Later/百宝箱/resource/v2-488617d2b38a5e841204087578d56cb1_r.jpg)

顾名思义，自动置顶就是对于设定规则中类型的窗口自动始终保持在最前端，节约了每次手动置顶的时间。尤其是对于一些始终需要监视的实时信息窗口等非常适用。

## 小结

### 优点

-   操作直观，使用方便
-   界面简洁，存在感低
-   轻便小巧，不占内存

（没错我就是强行四字怪）

### 不足

-   图钉位置难以捉摸
-   许久未更新，不支持UWP
-   有一些奇怪的Bug

## 下载

DeskPins目前只有Windows版本。

以下地址都来自软件作者Elias Fotinis的[个人网站](https://link.zhihu.com/?target=https%3A//efotinis.neocities.org/index.html)。国内大部分汉化版以及大多数软件网站是v1.30版本的，这里最新的版本是v1.32。

-   [直接下载](https://link.zhihu.com/?target=https%3A//efotinis.neocities.org/downloads/DeskPins-1.32-setup.exe)
-   [介绍（官网）](https://link.zhihu.com/?target=https%3A//efotinis.neocities.org/deskpins/)
-   [开源代码](https://link.zhihu.com/?target=https%3A//efotinis.neocities.org/downloads/efotinis-deskpins-e3caef22897e.zip)

既然窗口置顶有了，

选择成为哪种人，

就是你自己的选择了 。

---

本文同步自公众号**一只岚，**[点此获得更佳阅读体验](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/Z1fpPLyn0_xILif2xV_uLQ)