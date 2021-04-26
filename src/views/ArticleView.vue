<template>
  <div>
    <transition name="el-fade-in" appear>
      <div class="article-cover">
        <el-image :src="info.cover" fit="cover" v-if="info.cover" />
        <div class="article-header">
          <h1 class="article-title">{{info.title}}</h1>
          <div class="article-info">
            <span class="text-article-info">{{ info.author && info.author.name || "未知作者" }}</span>
            <span class="text-article-info">发表于{{ info.createdDate }}</span>
            <span class="text-article-info" v-if="info.isOrigin">原创文章</span>
            <span class="text-article-info" v-if="info.articleClass">
            <font-awesome-icon :icon="['fas', 'bars']" />
            {{info.articleClass.title}}
          </span>
            <div class="text-article-info article-tag-list">
              <font-awesome-icon icon="tag"/>
              <router-link v-for="tag in info.tags" :key="tag.id" :to="'/tag/' + tag.id" class="text-article-tag">
                {{tag.title}}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <el-row type="flex" style="align-items: stretch; margin-top: 5px">
      <el-col :sm="5">
        <div id="article-catalog-container" class="hidden-sm-and-down">
          <article-catalog ref="catalog" id="article-catalog" element="article" />
        </div>
      </el-col>
      <el-col :sm="19" :xs="24">
        <markdown-it-vue id="article" :content="info.content || ''" />
      </el-col>
    </el-row>
    <el-backtop />
  </div>
</template>

<script lang="ts">
import Article from "@/domain/Article";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faTag} from "@fortawesome/free-solid-svg-icons";
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import ArticleCatalog from "@/components/ArticleCatalog.vue";
library.add(faTag)

interface Data{
  info: Article
}
export default {
  name: "Article",
  components: {ArticleCatalog, MarkdownItVue},
  data(): Data{
    return {
      info: {}
    }
  },
  updated() :void{
    this.$nextTick(()=>{
      setTimeout(()=>{
        this.$refs.catalog.refresh();
      }, 0)
    })
  },
  methods: {
    async loadArticle(): Promise<void>{
      this.info = {
        id: 0,
        title: "深入了解Jvm虚拟机笔记",
        describe: "最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。",
        cover: "https://tva2.sinaimg.cn/large/0072Vf1pgy1foxkc2jnyej31hc0u04g2.jpg",
        content: `
# markdown-it-vue 你好呀

## Image size and Viewer

![gvf](http://www.aqcoder.com/gvf-project.png =x50)
![ravenq](http://www.aqcoder.com/ravenq-qr.png =50x50)

## GitHub Table of Contents

[toc]

Note: Only \`h2\` and \`h3\` are shown in toc.

## alter

Markup is similar to fenced code blocks. Valid container types are \`success\`, \`info\`, \`warning\` and \`error\`.

::: success
You have got it.
:::

::: info
You have new mail.
:::

::: warning
You have new mail.
:::

::: error
Staying up all night is bad for health.
:::

## mermaid charts

### mermaid Flowchart

[Flowchart Syntax](http://knsv.github.io/mermaid/#flowcharts-basic-syntax)

\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`

\`\`\`
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
\`\`\`

## Definition list

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b

[Definition List Syntax](http://pandoc.org/README.html#definition-lists)


## AsciiMath

Inline AsciiMath: \`@(1/2[1-(1/2)^n])/(1-(1/2))=s_n@\`

\`\`\`AsciiMath
oint_Cx^3 dx+4y^2 dy

2=(((3-x)xx2)/(3-x))

sum_(m=1)^oosum_(n=1)^oo(m^2 n)/(3^m(m3^n+n3^m)
\`\`\`

\`\`\`ASCIIMath
phi_n(kappa) = 1/(4pi^2 kappa^2)
 int_0^oo (sin(kappa R))/(kappa R)
 del/(del R)
[R^2 (del D_n (R))/(del R)] del R
\`\`\`

[AsciiMath Documentation](http://asciimath.org/)

## Subscript: H~2~O

You can also use inline math: \`$H_2O$\`


## Superscript: 29^th^

You can also use inline math: \`$29^{th}$\`


## Emoji: :panda_face: :sparkles: :camel: :boom: :pig:

[Emoji Cheat Sheet](http://www.emoji-cheat-sheet.com/)

## Fontawesome: :fa-car: :fa-flag: :fa-bicycle: :fa-leaf: :fa-heart:

[All the Font Awesome icons](http://fontawesome.io/icons/)

## Echarts

[Documentation for Echarts](http://echarts.baidu.com)

The width and height is the size for chart container.

\`\`\`echarts
{
  "width": 500,
  "height": 400,
  "series": [
    {
      "name": "访问来源",
      "type": "pie",
      "radius": "55%",
      "data": [
        {
          "value": 235,
          "name": "视频广告"
        },
        {
          "value": 274,
          "name": "联盟广告"
        },
        {
          "value": 310,
          "name": "邮件营销"
        },
        {
          "value": 335,
          "name": "直接访问"
        },
        {
          "value": 400,
          "name": "搜索引擎"
        }
      ]
    }
  ]
}
\`\`\`

## code

### c
\`\`\`c
#include <stdio.h>
int main(int argc char* argv[]) {
  printf("Hello, World!");
  return 0;
}
\`\`\`

### json

\`\`\`json
{
  "name": "markdown-it-vue"
}
\`\`\`

### javascript
\`\`\`json
import MarkdownItVue from 'markdown-it-vue'
export default {
  components: {
    MarkdownItVue
  }
}
\`\`\`

### bash
\`\`\`bash
npm install markdown-it-vue
\`\`\`

## table

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

## flowchart.js

\`\`\`flowchart.js
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End:>http://www.google.com
op1=>operation: My Operation|past
op2=>operation: Stuff|current
sub1=>subroutine: My Subroutine|invalid
cond=>condition: Yes
or No?|approved:>http://www.google.com
c2=>condition: Good idea|rejected
io=>inputoutput: catch something...|request
para=>parallel: parallel tasks

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->para
c2(true)->io->e
c2(false)->e

para(path1, bottom)->sub1(left)->op1
para(path2, right)->op2->e

st@>op1({"stroke":"Red"})@>cond({"stroke":"Red","stroke-width":6,"arrow-end":"classic-wide-long"})@>c2({"stroke":"Red"})@>op2({"stroke":"Red"})@>e({"stroke":"Red"})
\`\`\`

      `,
        createdDate: "2021-04-10 09:12",
        lastModifiedDate: "2021-04-10 09:12",
        tags: [
          {
            id: 0,
            title: "笔记"
          },
          {
            id: 1,
            title: "学习"
          },
          {
            id: 2,
            title: "java"
          }
        ],
        articleClass: {
          id: 0,
          title: "笔记"
        },
        isOrigin: true,
        recommend: false,
        top: false,
        orderNum: 0,
        viewingNum: 1,
        agreedNum: 1,
        commentNum: 0,
        forwardingNum: 0,
        author: {
          id: 0,
          name: 'bincker'
        }
      }
      document.title = this.info.title
      this.$nextTick(()=>{
        this.$refs.catalog.refresh()
      })
      setTimeout(()=>this.show = true, 1000)
    }
  },
  created() : void{
    setTimeout(()=>this.loadArticle(), 0)
  },
  beforeRouteUpdate(): void{
    if(this.info && this.info.title) document.title = this.info.title
  }
}
</script>

<style scoped lang="scss">
@import "src/style/var-device-width";
.article-cover{
  position: relative;
  .el-image{
    display: block;
    max-height: 500px;
  }
}
.article-header{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
  background-image: linear-gradient(to bottom, transparent, #333);
  color: white;
}
.article-title{
  font-size: 3em;
}
.text-article-info{
  font-size: .9em;
  color: #e4e6e8;
  margin-right: 2em;
  white-space: nowrap;
}
.article-tag-list{
  display: inline-block;
}
.text-article-tag{
  margin-right: 1em;
}
#article-catalog-container{
  position: -webkit-sticky;
  position: sticky;
  top: 5px;
  bottom: 0;
}
#article-catalog{
  max-height: calc(100vh - 2em);
}
#article{
  margin-left: 5px;
  border-radius: 3px;
  padding: 1em 2em;
  background-color: white;
  overflow-x: auto;
}
@media (max-width: $device-width-xs) {
  .article-title{
    font-size: 2em;
  }
  #article{
    margin-left: 0;
  }
}
</style>