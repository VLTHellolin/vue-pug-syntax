# Vite Plugin : Vue Pug Syntax

[![](https://img.shields.io/github/stars/VLTHellolin/vue-pug-syntax?style=flat-square)](https://github.com/VLTHellolin/vue-pug-syntax/stargazers)

[English](https://github.com/VLTHellolin/vue-pug-syntax/blob/master/README.md) | [简体中文](https://github.com/VLTHellolin/vue-pug-syntax/blob/master/README.zh_CN.md) | 繁體中文

TS 版。如果你需要 JS 版本，參考 [vue-pug-plugin](https://github.com/matthewjumpsoffbuildings/vue-pug-plugin)。

## 介紹

這個 Vite 外掛可以讓你在 Vue 中使用 Pug 語法。

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

使用後：

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

## 安裝

``` shell
$ pnpm install -D vue-pug-plugin
```

你也需要安裝 `pug` 和 `typescript`。

在 `vite.config.ts` 中加入以下設定：

``` ts
// CJS 語法
const vuePugSyntax = require('vue-pug-syntax');
// ES 語法
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

對於 Vue 屬性中的變量，你仍需要將其寫在字串中：

``` pug
//- OK
a(:href="thisIsAVariable + '.com'")
//- Err
a(:href=thisIsAVariable + '.com')
```

你可以使用 [不轉義的程式碼](https://pugjs.org/language/code.html#unescaped-buffered-code) 或 [不轉義的字串嵌入](https://pugjs.org/language/interpolation.html#string-interpolation-unescaped) 來在編譯期間插入變數：

``` pug
<script setup lang="ts">
import { ref } from 'vue';
var x = ref(1);
</script>

<template lang="pug">
- var y = 1;

//- Vue 動態插入
p= x
//- 編譯時插入
p!= y
</template>
```

在一個循環區塊內，你可以使用 `key` 當作索引變數名，`:key="key"` 屬性將會自動加到元素上：

``` pug
each item, key in items
  p= item
each item, key in items
  p Lorem
  p Ipsum
```

會被轉換成：

``` pug
p(v-for="(item, key) in items" :key="key") {{ item }}
template(v-for="(item, key) in items" :key="ley")
  p Lorem
  p Ipsum
```