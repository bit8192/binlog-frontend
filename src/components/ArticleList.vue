<template>
  <div id="container-article">
    <transition name="transition-from-bottom">
      <template v-if="articleList.length">
        <article-list-item v-for="article in articleList" :key="article.id" :info="article" />
      </template>
      <empty-data v-else />
    </transition>
  </div>
</template>

<script lang="ts">
import ArticleListItem from "@/components/ArticleListItem.vue";
import Article from "@/domain/Article";
import EmptyData from "@/components/EmptyData.vue";

// const pageSize = 20;
interface Data{
  articleList: Article[]
  pageIndex: number
}
export default {
  name: "ArticleList",
  components: {EmptyData, ArticleListItem},
  data() : Data{
    return {
      articleList: [],
      pageIndex: 0
    }
  },
  methods: {
    async loadArticleList(): Promise<void>{
      this.articleList = [
        {
          id: 0,
          title: "深入了解Jvm虚拟机笔记",
          describe: "最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。最近心血来潮，新买了《深入了解Jvm虚拟机》。准备好好提高一下自己。\n大致看了一下目录，主要是描述了jvm的历史和把java源码解析一遍；还有很多需要动手的地方，所以需要你拥有一定的动手能力。",
          cover: "https://tva2.sinaimg.cn/large/0072Vf1pgy1foxkc2jnyej31hc0u04g2.jpg",
          images: ["https://tva2.sinaimg.cn/large/0072Vf1pgy1foxkc2jnyej31hc0u04g2.jpg","https://images.unsplash.com/photo-1616705900481-87d8044f1d3b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"],
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
      ]
    }
  },
  created(): void {
    // this.loadArticleList()
  }

}
</script>
<style scoped lang="scss">
</style>