# Vite Plugin : Vue Pug Syntax

[![](https://img.shields.io/github/stars/VLTHellolin/vue-pug-syntax?style=flat-square)](https://github.com/VLTHellolin/vue-pug-syntax/stargazers)

English | [简体中文](https://github.com/VLTHellolin/vue-pug-syntax/blob/master/README.zh_CN.md) | [繁體中文](https://github.com/VLTHellolin/vue-pug-syntax/blob/master/README.zh_TW.md)

This plugin is the TS version of [vue-pug-plugin](https://github.com/matthewjumpsoffbuildings/vue-pug-plugin), if you need a JS plugin, use it instead of this.

## Intro

This plugin allows you to use Pug syntax in Vue.

Before:

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

After:

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

## Installation

In your project:

``` shell
$ pnpm install -D vue-pug-plugin
```

You also need `pug` and `typescript`.

In your `vite.config.ts`:

``` ts
// CJS syntax
const vuePugSyntax = require('vue-pug-syntax');
// ES syntax
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

## Notes

For Vue attribute variables you should still write them in string literals:

``` pug
//- OK
a(:href="thisIsAVariable + '.com'")
//- Err
a(:href=thisIsAVariable + '.com')
```

You can use [unescaped code](https://pugjs.org/language/code.html#unescaped-buffered-code) or [unescaped string interpolation](https://pugjs.org/language/interpolation.html#string-interpolation-unescaped) to insert a variable at compile time:

``` pug
<script setup lang="ts">
import { ref } from 'vue';
var x = ref(1);
</script>

<template lang="pug">
- var y = 1;

//- Dynamically insert via Vue
p= x
//- Insert at compile-time
p!= y
</template>
```

Inside a loop block, you can use `key` as the index variable name, and `:key="key"` attribute will be added to the element:

``` pug
each item, key in items
  p= item
each item, key in items
  p Lorem
  p Ipsum
```

Will be translated to:

``` pug
p(v-for="(item, key) in items" :key="key") {{ item }}
template(v-for="(item, key) in items" :key="ley")
  p Lorem
  p Ipsum
```