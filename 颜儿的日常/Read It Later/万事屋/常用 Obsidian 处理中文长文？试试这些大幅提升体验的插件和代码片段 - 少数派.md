[[ReadItLater]] [[Article]] #todo 
- [ ] 看这篇文章并整理插件

# [常用 Obsidian 处理中文长文？试试这些大幅提升体验的插件和代码片段 - 少数派](https://sspai.com/post/69628)

常用 Obsidian 处理中文长文？试试这些大幅提升体验的插件和代码片段

如果你经常需要在 Obsidian 中处理文字，尤其是进行中文输入时，也许会遇到这些难处：

-   长段中文内容在行尾的排版上总是参差不齐长短突出，无法整齐排列。
-   需要频繁地在中文和英文、数字内容之间手动输入空格，无法像在 iPhone 上输入时一样自动进行排版规范。
-   想双击选中某个具体的中文词语方便修改，却只能固定选中逗句之间的一整段。
-   想输入一对成对符号如「」《》，每次都要完整地把两边的符号打一遍。
-   想统计某一段文本内容的具体字数，可即使拖拽选中也只会显示整个文档的总字数。  
    ……

是的，原装的 Obsidian 对中文内容的输入支持就是这么差劲，如果不手动进行调整，你的体验要多变扭有多变扭。

自入坑 Obsidian 以来的几个月，我一直在努力创造一个更方便中文写作的环境，经过长时间的尝试找到了不少好用的插件和代码片段。在它们的帮助下，你的 Obsidian 中文输入体验将得到得到质的飞越。还有一些插件虽然不与中文输入直接相关，但能为「码字」这件事带来许多角角落落的细节体验提升，比如「所见即所得」，结构醒目清晰的文件夹侧边栏，保护你的内容隐私等等。本文中，我就为大家介绍这些我发现的优质资源。

**注意：**以下推荐的插件，大部分在 Obsidian 插件市场中搜索名称即可找到，但也存在部分插件在社区中还没有上线，一些代码片段不好找。不过没事，所有的内容我都提供了下载链接。

## 解决中文长文输入痛点的插件

### 更好的中文分词：[Word Splitting for Simplified Chinese in Edit Mode](https://github.com/aidenlx/cm-chs-patch)

Obsidian 默认并不支持中文分词，双击文本往往会选中标点符号之间的一长串。安装这个插件后，编辑模式下的双击会自动选中句中的一个具体词语。

![](https://cdn.sspai.com/2021/11/02/article/079b1e913a0fa779b6fdb0204fa8361f?imageView2/2/w/1120/q/40/interlace/1/ignore-error/1)

正常模式下的双击选词，图源：项目官网

![](https://cdn.sspai.com/2021/11/02/article/4ca7aeb743378d4ad2198aedc9352620?imageView2/2/w/1120/q/40/interlace/1/ignore-error/1)

安装插件后的双击选词，图源：项目官网

### 一键完成排版修正：[Obsidian Pangu](https://github.com/Natumsol/obsidian-pangu)

这个插件的作用是增加「盘古之白」，即汉字和英文字母之间的空间，对于排版强迫症的人来说是一个福音。如果你需要在网络上进行内容发布，借助这个插件使用快捷键一键完成修正能节省大量时间。

![](Read%20It%20Later/百宝箱/resource/bc195202481021e71dd472e9782f3e7c.png)

修正前后对比，图源：项目官网

### 中文符号自动补齐：[Auto pair chinese symbol](https://github.com/renmu123/obsidian-auto-pair-chinese-symbol)

这个插件可以让你输入单个成对符号如「 后，自动补完输入一对符号「」，并将光标跳转至符号中间——体验类似于把 iPhone 自带的中文输入键盘换成了搜狗输入法。不仅如此，还可以选中文字后在两边插入符号，允许对下单引号和下双引号向前自动补齐。

![](Read%20It%20Later/百宝箱/resource/1f0c02f26c58f217122d595e78ae3c9a.png)

效果展示

### 书写体验全面增强：[Easy Typing](https://github.com/Yaozhuwa/easy-typing-obsidian)

这是我强烈推荐的插件，它不仅整合了上面插件的部分功能（比如 Obsidian pangu），还提供了更多拓展。例如:

-   支持编辑过程中行内自动格式化，自动大写和自动空格；
-   提供部分中英文输入符号的自动转换，让你无需在输入 Markdown 符号时进行语言切换；
-   将行首的全角书名号（》）自动转换成半角（>）方便开启引用内容段落，行首的全角顿号（、）自动转换成半角（/）以配合最近更新的 Slash Commands 功能。

这些功能在设置里有细分的功能开关，可以根据个人习惯是否开启。

补充说明为什么把 Obsidian pangu 和 Easy Typing 分开介绍，尽管部分功能重合：

-   在 Easy Typing 开启状态下，格式规范是实时进行的。我们需要在输入法中输入拼音字母然后选定中文，在这个过程中如果没有选定词语就删除字母，会在原地留下一个空格。
-   Obsidian pangu 的使用场景是在内容输入完成后一键全文规范格式，需要手动操作。

![showfeature.gif](https://cdn.sspai.com/2021/11/02/article/d6e8e859d85d175d4f15e66571b73b65?imageView2/2/w/1120/q/40/interlace/1/ignore-error/1)

Easy Typing 效果展示，图源：项目官网

### 更好的字符统计和脚注：[Better Word Count](https://github.com/lukeleppan/better-word-count) 和 [Better footnote](https://github.com/aidenlx/better-fn)

系统自带的字符统计主要针对分词的西文，对中文统计不准确。Better Word Count 可以更准确地显示选中文本内容的字数。

![](Read%20It%20Later/百宝箱/resource/9472ac60b36158e5810087f24916cb07.gif)

Better Word Count，图源：项目官网

Better footnote 则会在光标悬停在脚注上时自动显示注释内容，让你无需跳转至文末。

![](Read%20It%20Later/百宝箱/resource/c096ab1244a7d39369b9f7a8b58e9357.gif)

Better footnote，图源：项目官网

### 不想被别人看到你在写什么：[Privacy Glasses](https://github.com/jillalberts/privacy-glasses)

这个插件适用于在公共场合，比如图书馆、高铁和飞机上码字的场合。如果不想被陌生人看见自己正在输入的内容，可以打开这个插件，直接玻璃模糊掉光标焦点区域外的所有内容。

注意，如果你安装了一些「所见即所得」的插件，编辑模式下渲染的图片不会被模糊。另外，插件看板的内容也不会被模糊。

![](Read%20It%20Later/百宝箱/resource/865ebe1a662b66efdb7820b2fb600296.png)

### 统一 Markdown 语法：[Markdown prettifier](https://github.com/cristianvasquez/obsidian-prettify)

这个插件可以修复、统一 Markdown 文件到标准语法，并添加诸如「修改日期」等内容。这有助于确保在 Markdown 语言不同的编辑器中（比如 Ulysses）都能正确渲染，也方便在用多个编辑器书写同一个文档后统一格式。

![](Read%20It%20Later/百宝箱/resource/fcbd2042bcd48c0f4b2a8d738184978e.png)

修复前效果

![](Read%20It%20Later/百宝箱/resource/ecceb52db4f14b7fc6aca639bc34b5ba.png)

修复后效果

### 全面完善的「所见即所得」：[Codemirror](https://github.com/nothingislost/obsidian-codemirror-options)

有的用户会嫌正文中出现的 Markdown 记号不太整洁，中文长文中尤其如此。这个插件可以在编辑模式下自动隐藏 Markdown 符号，自动渲染代码块，并在右上方显示一个代码转换选项。伪「所见即所得」。我目前使用下来体验很好，基本没原版预览什么事了。

![](Read%20It%20Later/百宝箱/resource/4192eca64721c3fbd9a2e191ad009c0b.gif)

图源：项目官网

### 记住光标位置：[Remember cursor position](https://github.com/derwish-pro/obsidian-remember-cursor-position)

撰写长文时，我们经常需要不停地来回翻阅几个文件，或是打开一个没有处理完的文档继续工作。Remember cursor position 能自动定位到之前读到一半或是写完停留的地方。

### 自动预览文件：[ZH 多彩预览](https://www.jianshu.com/p/fe5978cbc498)

这款插件在社区里暂时还没有上架，插件作者是国内最大的 Obsidian 企鹅群群主蚕子。我用的最多的功能是在笔记末尾打三个空格，效果是自动以预览模式打开你指定的文稿，类似于将 PPT 保存为 pptx 的格式。配合 Dataview 笔记和 Folder Note 文件夹笔记，打开时自动呈现总览目录。

![](Read%20It%20Later/百宝箱/resource/471b3cf6aeae4b3634627c6a0eda8dba.png)

比如配合 Dataview 做一个「库」的启动页

### 专注于正在输入的内容：[Stille](https://github.com/michaellee/stille)

如果你需要在写作时减少其他内容的干扰，可以尝试这款 Stille 插件。它会突出光标所在的输入行，灰度显示其他行内容。灰度可以自由调节，当它调成 0 的时候效果非常接近 Ulysses 「打字机模式」的「突出显示」。

![](Read%20It%20Later/百宝箱/resource/d9ecd2fa11102436be12fa1e9b2eeb3d.png)

灰度 0 状态下的效果展示

## 优化中文输入体验的代码片段

接下来，我会介绍一些用于渲染 Obsidian 外观的代码片段（code snippets），它们能帮助更好地展示文本内容，提供更多的可能性。

### 如何使用代码片段？

在那之前，如果你不知道如何使用一个代码片段，以下是使用的步骤教程——类似于手动安装插件的过程。

打开你的 Obsidian，打开「设置」>「选项」>「外观」。在最下方的区域「CSS 代码片段」点击文件夹图标，打开代码段所在的文件夹。然后，将后文提供下载的 CSS 文件放入文件夹内（或者将代码内容存储为任意名称的 CSS 后缀文件并放入）。

![](Read%20It%20Later/百宝箱/resource/c281dafa7be2c9e407b031ac19e4252b.png)

  
回到 Obsidian，点击重新加载代码段，在下方选择你喜欢的开启即可。

![](Read%20It%20Later/百宝箱/resource/c8aac5062f84c70c5bd1d78e8f7e33ed.png)

### 整齐排列中文： [「两端对齐」](https://github.com/kmaasrud/awesome-obsidian/blob/master/code/css-snippets/hyphenation-and-justification.css)代码段

中文排版尤其注重两端对齐，而这个代码片段的效果就是将文本两端内容对齐，看起来更美观。

![](Read%20It%20Later/百宝箱/resource/630ee427aa98842d30de04035230730b.png)

默认排版效果，注意每行右侧的行尾

![](Read%20It%20Later/百宝箱/resource/dcba1e3cccf5ebbccea130c61e6a9f69.png)

开启渲染后的效果，赏心悦目

### 黑白，但又不完全黑白：[Minimal-Plus](https://pan.baidu.com/s/1v8Gm2HTolWOm7It-Uo99_g) 代码段（配合 [Minimal](https://github.com/kepano/obsidian-minimal) 主题使用）

原版 Minimal 主题是经典的黑白，柔和适眼。Minimal-Plus 来自社区用户的群聊分享，主要在 Minimal 的基础上，将标题突出显示并渲染彩色，做到了更好的平衡。

![](Read%20It%20Later/百宝箱/resource/dfd26cb3c044aba551c178dc2584759b.png)

加上 Minimal-Plus 后的效果

代码如下：

```
  :root {
    /* Sizes, weights, padding */
    --h1:2em;
    --h2:1.8em;
    --h3:1.6em;
    --h4:1.20em;
    --h5:1em;
    --h6:1em;

    --yellow:#e5b567;
    --green:#b4d273;
    --orange:#e87d3e;
    --purple:#9e86c8;
    --pink:#b05279;
    --blue:#6c99bb;

    --h1-color:var(--pink);
    --h2-color:var(--purple);
    --h3-color:var(--orange);
    --h4-color:var(--blue);
    --h5-color:var(--text-normal);
    --h6-color:var(--text-muted);
}
strong {
    color: rgb(179, 153, 255, 0.95);
    font-weight: 700;
}
  
em {
    color: #d05a63;
}   
```

### 不再有一长串的「###」： [Clutter-free-headings](https://github.com/deathau/obsidian-snippets/blob/main/clutter-free-headings.css) 代码段

这段代码可以使用 H1 H2 H3 等更直观的记号等代替复数个「#」，这样所有标题左侧都会对齐，更直观。

注意：如果你安装了 Codemirror，同时使用这段代码会导致与标题内容重叠，所以也许只能选一个装了。

![](Read%20It%20Later/百宝箱/resource/e18458c818ff9b961a9b2de77bff1c83.gif)

图源：项目官网

### 更多彩的内容展示： [Notation Colour Blocks](https://github.com/deathau/obsidian-snippets/blob/main/notation-colour-blocks.css) 代码段

除了 Obsidian 自带的高亮和加粗，还可以给字体或者段落背景加上 9 种颜色。正常情况下这样的效果会需要用到 HTML 语言，比较繁琐。

![](Read%20It%20Later/百宝箱/resource/2c6586446de6f830c766bd6d12a01c95.png)

图源：项目官网

### 结构醒目分明的侧边栏

**突出文件夹：**下面这则代码段可以让侧边栏中文件夹层级的背景颜色加深，字体变粗，更加醒目，方便管理。效果显著，强烈推荐。代码如下（似乎是从某些主题 css 里提取的，网上暂时没找到出处）：

```
.nav-folder-title {
    font-weight: 900;
    background-color: #c3c3c350;
}
 
.theme-dark .nav-folder-title {
    color:white;
}
 
.theme-light .nav-folder-title {
    color:black;
}
```

[**显示大纲和文件资源管理器的层级参考线**](https://github.com/kmaasrud/awesome-obsidian/blob/master/code/css-snippets/outliner-for-the-outline-and-file-explorer.css)**：**这则代码段将在侧边栏中按照层级关系显示不同缩紧的大纲线。光标经过时，层级大纲线会自动压缩，方便展示更多内容。

![](Read%20It%20Later/百宝箱/resource/0d799c41c237ee2df28285e95b2fcd8b.png)

「突出文件夹」和「大纲和文件资源管理器的大纲线」的共同作用效果

![](Read%20It%20Later/百宝箱/resource/483397f03c567fa5fece59d3dd2c73d8.png)

光标经过时大纲线会收缩

### 更多代码段

如果你对更多的代码片段感兴趣，还可以查阅 Github 上的 [obsidian-snippets](https://github.com/deathau/obsidian-snippets) 项目和 [awesome-obsidian](https://github.com/kmaasrud/awesome-obsidian#css-tweaks) 项目中的「CSS Snippets」一节。

## 结语

读完文章，你是否找到了自己想要的工具呢？那么练习熟悉，把「在 Obsidian 里输入中文」这件事变得更丝滑，把它们融入到日常的工作流中吧。用它去学习，记录，复盘，整理，输出，用它去创造更宏伟的璀璨之物，用它塑造更好的你。

© 本文著作权归作者所有，并授权少数派独家使用，未经少数派许可，不得转载使用。