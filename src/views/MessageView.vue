<template>
  <el-card class="message-card">
    <div class="message-type-container flex-row align-items-start height-100">
      <ul class="list-style-none m-0 p-0 pr-5 message-type-list">
        <li
            v-for="type of messageTypeList"
            :class="'message-type-btn text-sub p-2' + (currentMsgType === type ? ' active' : '')"
            :key="type.title"
            v-on:click="()=>onSelectMessageType(type)">
          <el-badge v-if="type.unreadMessageCount" :value="type.unreadMessageCount || 0">{{type.title}}</el-badge>
          <span v-else>{{type.title}}</span>
        </li>
      </ul>
      <!--suppress HtmlUnknownAttribute -->
      <div ref="messageList" class="flex-1 height-100 py-1" :v-infinite-scroll="loadMessage" :infinite-scroll-immediate="false" v-on:scroll="onScroll" style="overflow-y: auto">
        <!--    文章评论    -->
        <template v-if="currentMsgType === articleCommentMsgType">
          <template v-if="articleCommentMsgType.messages.length">
            <MessageItem v-for="msg of articleCommentMsgType.messages" :key="msg.id" :message="msg" :data-id="msg.id" :data-is-read="msg.isRead">
              <span class="color-text-sub" slot="user-describe">评论了我的文章</span>
              <template slot="actions">
                <el-button type="text" :class="msg.isAgreed ? '' : 'text-sub'" v-on:click="()=>toggleAgree(msg)">
                  <font-awesome-icon :icon="[msg.isAgreed ? 'fas' : 'far', 'thumbs-up']" />
                </el-button>
                <el-button type="text" class="color-text-sub" v-on:click="currentReplyMessage = msg">
                  <font-awesome-icon :icon="['far', 'comment']" />
                </el-button>
              </template>
              <comment-reply-input v-if="currentReplyMessage === msg" slot="additional" class="mb-3" v-model="currentReplyContent" v-on:submit="submitReply" :placeholder="'回复 @' + currentReplyMessage.fromUser.username + ':'" autofocus />
            </MessageItem>
          </template>
          <empty-data v-else />
        </template>
        <!--    回复消息    -->
        <template v-else-if="currentMsgType === replyMeMsgType">
          <template v-if="replyMeMsgType.messages.length">
            <MessageItem v-for="msg of replyMeMsgType.messages" :key="msg.id" :message="msg" :data-id="msg.id" :data-is-read="msg.isRead">
              <span class="color-text-sub" slot="user-describe">回复了我</span>
              <template slot="actions">
                <el-button type="text" :class="msg.isAgreed ? '' : 'text-sub'" v-on:click="()=>toggleAgree(msg)">
                  <font-awesome-icon :icon="[msg.isAgreed ? 'fas' : 'far', 'thumbs-up']" />
                </el-button>
                <el-button type="text" class="color-text-sub" v-on:click="currentReplyMessage = msg">
                  <font-awesome-icon :icon="['far', 'comment']" />
                </el-button>
              </template>
              <comment-reply-input v-if="currentReplyMessage === msg" slot="additional" class="mb-3" v-model="currentReplyContent" v-on:submit="submitReply" :placeholder="'回复 @' + currentReplyMessage.fromUser.username + ':'" autofocus />
            </MessageItem>
          </template>
          <empty-data v-else />
        </template>
        <!--    @我的消息    -->
        <template v-else-if="currentMsgType === mentionMeMsgType">
          <template v-if="mentionMeMsgType.messages.length">
            <MessageItem v-for="msg of mentionMeMsgType.messages" :key="msg.id" :message="msg" :data-id="msg.id" :data-is-read="msg.isRead">
              <span class="color-text-sub" slot="user-describe">提到了我</span>
              <template slot="actions">
                <el-button type="text" :class="msg.isAgreed ? '' : 'text-sub'" v-on:click="()=>toggleAgree(msg)">
                  <font-awesome-icon :icon="[msg.isAgreed ? 'fas' : 'far', 'thumbs-up']" />
                </el-button>
                <el-button type="text" class="color-text-sub" v-on:click="currentReplyMessage = msg">
                  <font-awesome-icon :icon="['far', 'comment']" />
                </el-button>
              </template>
              <comment-reply-input v-if="currentReplyMessage === msg" slot="additional" class="mb-3" v-model="currentReplyContent" v-on:submit="submitReply" :placeholder="'回复 @' + currentReplyMessage.fromUser.username + ':'" autofocus />
            </MessageItem>
          </template>
          <empty-data v-else />
        </template>
        <!--    收到的赞    -->
        <template v-else-if="currentMsgType === agreeMsgType">
          <template v-if="agreeMsgType.messages.length">
            <MessageItem v-for="msg of agreeMsgType.messages" :key="msg.id" :message="msg" :data-id="msg.id" :data-is-read="msg.isRead">
              <span class="color-text-sub" slot="user-describe">赞了我</span>
            </MessageItem>
          </template>
          <empty-data v-else />
        </template>
        <!--    系统消息    -->
        <template v-else-if="currentMsgType === systemMsgType">
          <template v-if="systemMsgType.messages.length">
            <MessageItem v-for="msg of systemMsgType.messages" :key="msg.id" :message="msg" :data-id="msg.id" :data-is-read="msg.isRead" />
          </template>
          <empty-data v-else />
        </template>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import MessageService from "@/service/MessageService";
import {
  MESSAGE_TYPE_ARTICLE_AGREE,
  MESSAGE_TYPE_ARTICLE_COMMENT, MESSAGE_TYPE_ARTICLE_COMMENT_AGREE, MESSAGE_TYPE_ARTICLE_COMMENT_MENTION,
  MESSAGE_TYPE_ARTICLE_COMMENT_REPLY, MESSAGE_TYPE_ARTICLE_SUB_COMMENT_AGREE, MESSAGE_TYPE_ARTICLE_SUB_COMMENT_MENTION,
  MESSAGE_TYPE_ARTICLE_SUB_COMMENT_REPLY, MESSAGE_TYPE_SYSTEM
} from "@/constants/MessageType";
import Message from "@/domain/Message";
import EmptyData from "@/components/EmptyData.vue";
import MessageItem from "@/components/message/MessageItem.vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faComment, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {faComment as faRegularComment, faThumbsUp as faRegularThumbsUp } from "@fortawesome/free-regular-svg-icons"
import CommentMessage from "@/domain/CommentMessage";
import Throttle from "@/decorators/Throttle";
import {AppProvider} from "@/App.vue";
import UserInfo from "@/domain/UserInfo";
import CommentService from "@/service/CommentService";
import ValueVo from "@/domain/ValueVo";
import CommentReplyInput from "@/components/comment/CommentReplyInput.vue";
library.add(faThumbsUp, faComment, faRegularComment, faRegularThumbsUp)

declare interface MsgTypeData<T>{
  title: string
  unreadMessageCount?: number
  visible: boolean
  messages: T[]
  pageIndex: number
  isLast?: boolean
}

//默认分页数量
const DEFAULT_PAGE_SIZE = 20;
@Component({
  components: {CommentReplyInput, MessageItem, EmptyData},
  inject: ['app'],
  mounted() :void{
    this.refreshUnreadMessageCount()
  },
  created() :void{
    const user = this.app.getLoggedUserInfo();
    if(user && user.isBlogger){
      this.messageTypeList.unshift(this.articleCommentMsgType)
      this.onSelectMessageType(this.articleCommentMsgType)
    }else{
      this.onSelectMessageType(this.replyMeMsgType)
    }
    this.app.addUserInfoChangeListener(this.onUserInfoChange)
  },
  beforeDestroy(): void{
    this.app.removeUserInfoChangeListener(this.onUserInfoChange)
  }
})
export default class MessageView extends Vue{
  app: AppProvider
  unreadMessageCount: {[key:string]: number}
  messageTypeList: MsgTypeData<CommentMessage | Message>[]
  articleCommentMsgType: MsgTypeData<CommentMessage>
  replyMeMsgType: MsgTypeData<CommentMessage>
  mentionMeMsgType: MsgTypeData<CommentMessage>
  agreeMsgType: MsgTypeData<Message>
  systemMsgType: MsgTypeData<Message>
  currentMsgType: MsgTypeData<CommentMessage | Message>
  currentReplyMessage: Message|null//当前正在回复的消息
  currentReplyContent: string//正在回复的内容

  data(): any{
    this.articleCommentMsgType = {title: '文章评论', visible: true, messages: [], pageIndex: 0}
    this.replyMeMsgType = {title: '回复我的', visible: true, messages: [], pageIndex: 0}
    this.mentionMeMsgType = {title: '@我的', visible: true, messages: [], pageIndex: 0}
    this.agreeMsgType = {title: '收到的赞', visible: true, messages: [], pageIndex: 0}
    this.systemMsgType = {title: '系统通知', visible: true, messages: [], pageIndex: 0}
    return {
      unreadMessageCount: {},
      messageTypeList: [this.replyMeMsgType, this.mentionMeMsgType, this.agreeMsgType, this.systemMsgType],
      currentMsgType: this.articleCommentMsgType,
      currentReplyMessage: null,
      currentReplyContent: ""
    }
  }

  onUserInfoChange(userInfo: UserInfo): void{
    if(userInfo && userInfo.isBlogger){
      if(this.messageTypeList.some(t=>t === this.articleCommentMsgType)) return;
      this.messageTypeList.unshift(this.articleCommentMsgType);
    }else{
      const index = this.messageTypeList.findIndex(t=>t === this.articleCommentMsgType)
      if(index == -1) return;
      this.messageTypeList.splice(index, 1)
    }
  }

  /**
   * 刷新未读消息数量
   */
  async refreshUnreadMessageCount(): Promise<void>{
    this.unreadMessageCount = await MessageService.unreadCount()
    this.articleCommentMsgType.unreadMessageCount = this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_COMMENT] || 0
    this.replyMeMsgType.unreadMessageCount = (this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_COMMENT_REPLY] || 0) + (this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_SUB_COMMENT_REPLY] || 0)
    this.mentionMeMsgType.unreadMessageCount = (this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_COMMENT_MENTION] || 0) + (this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_SUB_COMMENT_MENTION] || 0)
    this.agreeMsgType.unreadMessageCount = (this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_AGREE] || 0) + (this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_COMMENT_AGREE] || 0) + (this.unreadMessageCount[MESSAGE_TYPE_ARTICLE_SUB_COMMENT_AGREE] || 0)
    this.systemMsgType.unreadMessageCount = this.unreadMessageCount[MESSAGE_TYPE_SYSTEM] || 0
  }

  onSelectMessageType(type: MsgTypeData<CommentMessage | Message>): void{
    this.currentMsgType = type
    if(!type.messages.length) this.loadMessage()
  }

  /**
   * 根据当前选择的消息类型加载消息
   */
  async loadMessage(): Promise<void>{
    if(this.currentMsgType.isLast) return
    switch (this.currentMsgType) {
      case this.articleCommentMsgType:
        await this.loadArticleCommentMessage()
        break;
      case this.replyMeMsgType:
        await this.loadReplyMessage()
        break;
      case this.mentionMeMsgType:
        await this.loadMentionMessage()
        break;
      case this.agreeMsgType:
        await this.loadAgreeMessage()
        break;
      case this.systemMsgType:
        await this.loadSystemMessage()
        break;
    }
    await this.setViewedMessageRead()
  }

  /**
   * 加载文章评论消息
   */
  async loadArticleCommentMessage(): Promise<void>{
    const result = await MessageService.getArticleCommentMessagePage({page: this.articleCommentMsgType.pageIndex, size: DEFAULT_PAGE_SIZE})
    this.articleCommentMsgType.messages.push(...result.content)
    this.articleCommentMsgType.pageIndex ++
    this.articleCommentMsgType.isLast = result.last
  }

  /**
   * 加载回复消息
   */
  async loadReplyMessage(): Promise<void>{
    const result = await MessageService.getReplyMessagePage({page: this.replyMeMsgType.pageIndex, size: DEFAULT_PAGE_SIZE})
    this.replyMeMsgType.messages.push(...result.content)
    this.replyMeMsgType.pageIndex ++
    this.replyMeMsgType.isLast = result.last
  }

  /**
   * 加载@我的消息
   */
  async loadMentionMessage(): Promise<void>{
    const result = await MessageService.getMentionMessagePage({page: this.mentionMeMsgType.pageIndex, size: DEFAULT_PAGE_SIZE})
    this.mentionMeMsgType.messages.push(...result.content)
    this.mentionMeMsgType.pageIndex ++
    this.mentionMeMsgType.isLast = result.last
  }

  /**
   * 加载获得的赞消息
   */
  async loadAgreeMessage(): Promise<void>{
    const result = await MessageService.getAgreeMessagePage({page: this.agreeMsgType.pageIndex, size: DEFAULT_PAGE_SIZE})
    this.agreeMsgType.messages.push(...result.content)
    this.agreeMsgType.pageIndex ++
    this.agreeMsgType.isLast = result.last
  }

  /**
   * 加载系统消息
   */
  async loadSystemMessage(): Promise<void>{
    const result = await MessageService.getSystemMessagePage({page: this.systemMsgType.pageIndex, size: DEFAULT_PAGE_SIZE})
    this.systemMsgType.messages.push(...result.content)
    this.systemMsgType.pageIndex ++
    this.systemMsgType.isLast = result.last
  }

  /**
   * 消息列表滚动后设置消息已读
   */
  @Throttle(1000)
  onScroll(): void{
    this.setViewedMessageRead()
  }

  /**
   * 设置已读
   */
  async setViewedMessageRead(): Promise<void>{
    const currentMsgType = this.currentMsgType
    const messageList = this.$refs.messageList as HTMLElement;
    const unreadIdArr = [...messageList.children]
        .filter((d: HTMLElement)=> {
          if(!d.dataset.id || d.dataset['is-read']) return false;
          const messageItemBottom = d.offsetTop - messageList.offsetTop + d.clientHeight//消息条目底部相对列表的滚动位置
          return messageItemBottom > messageList.scrollTop && messageItemBottom <= messageList.scrollTop + messageList.clientHeight;
        })
        .map((d: HTMLElement)=>d.dataset.id);
    const unreadIdSet = new Set(unreadIdArr);
    const unreadMessages = currentMsgType.messages.filter(m=>unreadIdSet.has(m.id.toString()) && !m.isRead);
    if(!unreadMessages.length) return;
    unreadMessages.forEach(m=>m.isRead = true);//先设置为已读，防止重复设置已读
    currentMsgType.unreadMessageCount -= unreadMessages.length
    try {
      await MessageService.setRead(unreadIdArr)
    }catch(e){
      unreadMessages.forEach(m=>m.isRead = false);//抛出异常则设置回来
      currentMsgType.unreadMessageCount += unreadMessages.length
      throw e;
    }
  }

  /**
   * 点赞
   */
  async toggleAgree(msg: CommentMessage): Promise<void>{
    let result: ValueVo<boolean>
    switch (msg.type){
      case MESSAGE_TYPE_ARTICLE_COMMENT:
        result = await CommentService.toggleCommentAgree(msg.relevantId)
        break;
      case MESSAGE_TYPE_ARTICLE_COMMENT_REPLY:
      case MESSAGE_TYPE_ARTICLE_SUB_COMMENT_REPLY:
        result = await CommentService.toggleSubCommentAgree(msg.relevantId)
        break;
    }
    msg.isAgreed = result.value
  }

  /**
   * 提交回复
   */
  async submitReply(): Promise<void>{
    await CommentService.submitSubComment(this.currentReplyMessage.relevantId, this.currentReplyContent)
    this.currentReplyMessage = null
    this.currentReplyContent = ""
  }
}
</script>

<style lang="scss">
@import "src/style/var-layout";
@import "src/style/var-color";
@import "src/style/var-device-width";

.message-card{
  height: calc(#{$router-view-height} - 2px);//card有1px的边框
}
.message-card>.el-card__body{
  height: calc(100% - 40px);
}
.message-type-btn{
  cursor: pointer;
  font-weight: bold;
}
.message-type-btn.active{
  color: $color-primary;
}
.message-type-btn:hover{
  color: $color-primary;
}
@media (max-width: $device-width-md) {
  .message-type-container{
    flex-direction: column;
  }
  .message-type-list{
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    padding-bottom: 1em;
  }
  .message-type-list>li{
    display: inline-block;
  }
}
</style>
