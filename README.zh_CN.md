# Vite Plugin : Vue Pug Syntax

[![](https://img.shields.io/github/stars/VLTHellolin/vue-pug-syntax?style=flat-square)](https://github.com/VLTHellolin/vue-pug-syntax/stargazers)

[English](https://github.com/VLTHellolin/vue-pug-syntax/blob/master/README.md) | 简体中文 | [繁體中文](https://github.com/VLTHellolin/vue-pug-syntax/blob/master/README.zh_TW.md)

TS 版插件，如果你需要 JS 版本，参考 [vue-pug-plugin](https://github.com/matthewjumpsoffbuildings/vue-pug-plugin)。

## 介绍

这个 Vite 插件可以让你在 Vue 中使用 Pug 语法。

使用前：

``` pug
<template lang="pug">
ul(v-if="showComments")
  li(v-for="comment in comments")
    a(v-if="comment.link !== undefined" :href="comment.link") Link to {{ comment.linkTitle }}
    p(v-else) {{ comment.content }}
template(v-if="showFooter")
  p Copyright since 2022
  p All rights reserved.
</template>
```

使用后：

``` pug
<template lang="pug">
if showComments
  ul
    each comment in comments
      if comment.link !== undefined
        a(:href='comment.link') Link to #{comment.linkTitle}
      else
        p= comment.content
if showFooter
  p Copyright since 2022
  p All rights reserved.
</template>
```

## 安装

``` shell
$ pnpm install -D vue-pug-plugin
```

你也需要安装 `pug` 和 `typescript`。

在 `vite.config.ts` 中加入以下设置：

``` ts
// CJS 语法
const vuePugSyntax = require('vue-pug-syntax');
// ES 语法
import vuePugSyntax from 'vue-pug-syntax';

...

export default {
  plugins: [
    vue({
      template: {
        preprocessOptions: {
          plugins: [vuePugSyntax]
        }
      }
    })
  ]
}
```

## 注意

对于 Vue 属性中的变量，你仍需要将其写在字符串中：

``` pug
//- OK
a(:href="thisIsAVariable + '.com'")
//- Err
a(:href=thisIsAVariable + '.com')
```

你可以使用 [不转义的代码](https://www.pugjs.cn/language/code#unescaped-buffered-code) 或 [不转义的字符串嵌入](https://www.pugjs.cn/language/interpolation#string-interpolation%2C-unescaped) 来在编译期插入变量：

``` pug
<script setup lang="ts">
import { ref } from 'vue';
var x = ref(1);
</script>

<template lang="pug">
- var y = 1;

//- Vue 动态插入，<p>{{ x }}</p>
p= x
//- 编译时插入
p!= y
</template>
```

在一个循环块内，你可以使用 `key` 当作索引变量名，`:key="key"` 属性将会自动加到元素上：

``` pug
each item, key in items
  p= item
each item, key in items
  p Lorem
  p Ipsum
```

会被转换成：

``` pug
p(v-for="(item, key) in items" :key="key") {{ item }}
template(v-for="(item, key) in items" :key="ley")
  p Lorem
  p Ipsum
```