<template>
  <el-card shadow="hover" :class="bloggers.length ? '' : 'd-none'">
    <div class="text-center pt-5">
      <div class="position-relative" style="height: 90px">
        <div class="blogger-avatar blogger-avatar-prev" @click="viewPrevBlogger">
          <el-avatar v-if="prevBlogger" :src="prevBlogger.headImg" :size="80"/>
        </div>
        <div class="blogger-avatar" style="z-index: 1">
          <el-avatar :src="viewBlogger ? viewBlogger.headImg : ''" :size="80"/>
        </div>
        <div class="blogger-avatar blogger-avatar-next" @click="viewNextBlogger">
          <el-avatar v-if="nextBlogger" :src="nextBlogger.headImg" :size="80"/>
        </div>
      </div>
      <div>
        <span v-if="viewBlogger">{{ viewBlogger.username }}</span>
      </div>
    </div>
    <div class="flex-row justify-content-center align-items-center">
      <div class="text-center">
        <span class="d-block user-integral">{{ (viewBlogger && viewBlogger.agreedNum) || "-" }}</span>
        <span class="d-block color-text-sub">获赞</span>
      </div>
      <span class="user-state-panel-divider" />
      <div class="text-center">
        <span class="d-block user-integral">{{ (viewBlogger && viewBlogger.commentNum) || "-" }}</span>
        <span class="d-block color-text-sub">评论</span>
      </div>
      <span class="user-state-panel-divider" />
      <div class="text-center">
        <span class="d-block user-integral">{{ (viewBlogger && viewBlogger.articleNum) || "-" }}</span>
        <span class="d-block color-text-sub">文章</span>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {AppProvider} from "@/App.vue";
import UserDetail from "@/domain/UserDetail";
import UserService from "@/service/UserService";
import UserInfo from "@/domain/UserInfo";
import {BinlogStore} from "@/createStore";

@Options({
  inject: ['app'],
  computed: {
    currentUserInfo(){
      return this.$store.state.userInfo;
    }
  }
})
export default class BloggersPanel extends Vue{
  bloggers!: Array<UserDetail>
  prevBlogger: UserDetail
  viewBlogger: UserDetail
  nextBlogger: UserDetail
  viewIndex: number
  currentUserInfo: UserInfo
  app!: AppProvider
  unWatchUserInfo: ()=>void

  data(): any{
    return {
      bloggers: [],
      prevBlogger: null,
      viewBlogger: null,
      nextBlogger: null,
      viewIndex: 0,
    }
  }

  created(): void{
    this.loadBloggers()
  }

  mounted(): void{
    this.unWatchUserInfo = this.$store.watch((state: BinlogStore)=>state.userInfo, this.onUserInfoChange)
  }

  beforeDestroy(): void{
    this.unWatchUserInfo()
  }

  onUserInfoChange(userInfo: UserInfo): void{
    this.currentUserInfo = userInfo
    this.loadBloggers()
  }

  private async loadBloggers(): Promise<void>{
    this.bloggers = (await UserService.getBloggers()).filter(u=>!this.currentUserInfo || u.id !== this.currentUserInfo.id)
    if(this.bloggers.length) {
      this.viewBlogger = this.bloggers[0];
      if(this.bloggers.length > 1){
        this.nextBlogger = this.bloggers[1];
        this.prevBlogger = this.bloggers[this.bloggers.length - 1];
      }
    }
  }

  private viewPrevBlogger(): void{
    if(!this.bloggers.length) return;
    this.viewIndex --;
    if(this.viewIndex < 0){
      this.viewIndex = this.bloggers.length - 1
      this.nextBlogger = this.bloggers[0]
      this.prevBlogger = this.bloggers[this.viewIndex - 1]
    }else if(this.viewIndex < 1){
      this.prevBlogger = this.bloggers[this.bloggers.length - 1]
      this.nextBlogger = this.bloggers[this.viewIndex + 1]
    }else{
      this.prevBlogger = this.bloggers[this.viewIndex - 1]
      this.nextBlogger = this.bloggers[this.viewIndex + 1]
    }
    this.viewBlogger = this.bloggers[this.viewIndex]
  }

  private viewNextBlogger(): void{
    if(!this.bloggers.length) return;
    this.viewIndex ++;
    if(this.viewIndex > this.bloggers.length - 1){//超过倒数第一个
      this.viewIndex = 0
      this.prevBlogger = this.bloggers[this.bloggers.length - 1];
      this.nextBlogger = this.bloggers[this.viewIndex + 1];
    }else if(this.viewIndex > this.bloggers.length - 2){//倒数第一个
      this.prevBlogger = this.bloggers[this.viewIndex - 1];
      this.nextBlogger = this.bloggers[0];
    }else{
      this.prevBlogger = this.bloggers[this.viewIndex - 1];
      this.nextBlogger = this.bloggers[this.viewIndex + 1];
    }
    this.viewBlogger = this.bloggers[this.viewIndex]
  }
}
</script>

<style scoped lang="scss">
.blogger-avatar{
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}
.blogger-avatar-prev{
  cursor: pointer;
  opacity: .8;
  transform: translateX(calc(-50% - 60px)) perspective(100px) translateZ(-30px);
}
.blogger-avatar-next{
  cursor: pointer;
  opacity: .8;
  transform: translateX(calc(-50% + 60px)) perspective(100px) translateZ(-30px);
}
.user-integral{
  font-size: 1.5em;
}
.user-state-panel-divider{
  display: inline-block;
  width: 1px;
  height: 1.2em;
  background-color: #dcdef6;
  margin: 0 1em;
}
.user-state-panel-btns{
  margin-top: 1em;
}
</style>
