<template>
<el-popover trigger="click" class="p-0" popper-class="emoji-popper" ref="popper">
  <el-tabs tab-position="bottom" type="border-card" v-on:tab-click="onTabClick">
    <el-tab-pane label="emoji" class="emoji-box">
      <span class="emoji" v-for="emoji of emojis" :key="emoji.emoji" :title="emoji.title" v-on:click="$emit('select', emoji.emoji)">{{emoji.emoji}}</span>
    </el-tab-pane>
    <el-tab-pane label="历史" class="emoji-box">
      <ul class="list-style-none flex-row flex-wrap" style="overflow-y: auto" v-if="historyExpressions.length">
        <li class="expression-item text-center flex-column" v-for="expression of historyExpressions" :key="expression.id" v-on:click="onSelectHistoryExpression(expression)">
          <div class="flex-1 d-flex justify-content-center align-items-center">
            <el-image :src="expressionUrl + '/' + expression.title" fit="contains" />
          </div>
          <h4 class="text-ellipsis">{{expression.title}}</h4>
        </li>
      </ul>
      <empty-data v-else />
    </el-tab-pane>
    <el-tab-pane label="全部" class="emoji-box flex-column">
      <el-input size="mini" suffix-icon="el-icon-search" placholder="搜索" v-model="allExpressionKeywords" ref="allExpressionSearchInput" />
      <!--suppress HtmlUnknownAttribute -->
      <ul class="list-style-none flex-1 flex-row flex-wrap" v-infinite-scroll="loadAllExpressionNext" style="overflow-y: auto">
        <template v-if="allExpressions.length">
          <li class="expression-item text-center flex-column mx-2" v-for="expression of allExpressions" :key="expression.id" v-on:click="onSelectAllExpression(expression)">
            <div class="flex-1 d-flex justify-content-center align-items-center">
              <el-image :src="expressionUrl + '/' + expression.title" fit="contains" />
            </div>
            <h4 class="text-ellipsis">{{expression.title}}</h4>
          </li>
        </template>
        <empty-data v-else />
      </ul>
    </el-tab-pane>
  </el-tabs>
  <el-button class="color-text-sub py-1" type="text" slot="reference">
    <font-awesome-icon icon="smile" size="lg" />
  </el-button>
</el-popover>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import {LOCAL_STORAGE_KEY_EXPRESSION_HISTORY} from "@/constants/LocalStorageKeys";
import ExpressionService from "@/service/ExpressionService";
import {ElInput} from "element-ui/types/input";
import {URL_EXPRESSION} from "@/constants/UrlApiExpression";
import ExpressionVo from "@/domain/ExpressionVo";
import {ElTabPane} from "element-ui/types/tab-pane";
import EmptyData from "@/components/EmptyData.vue";

const EMOJIS = [{"emoji":"😀","title":"grinning face"},{"emoji":"😃","title":"grinning face with big eyes"},{"emoji":"😄","title":"grinning face with smiling eyes"},{"emoji":"😁","title":"beaming face with smiling eyes"},{"emoji":"😆","title":"grinning squinting face"},{"emoji":"😅","title":"grinning face with sweat"},{"emoji":"🤣","title":"rolling on the floor laughing"},{"emoji":"😂","title":"face with tears of joy"},{"emoji":"🙂","title":"slightly smiling face"},{"emoji":"🙃","title":"upside-down face"},{"emoji":"🫠","title":"melting face"},{"emoji":"😉","title":"winking face"},{"emoji":"😊","title":"smiling face with smiling eyes"},{"emoji":"😇","title":"smiling face with halo"},{"emoji":"🥰","title":"smiling face with hearts"},{"emoji":"😍","title":"smiling face with heart-eyes"},{"emoji":"🤩","title":"star-struck"},{"emoji":"😘","title":"face blowing a kiss"},{"emoji":"😗","title":"kissing face"},{"emoji":"☺️","title":"smiling face"},{"emoji":"☺","title":"smiling face"},{"emoji":"😚","title":"kissing face with closed eyes"},{"emoji":"😙","title":"kissing face with smiling eyes"},{"emoji":"🥲","title":"smiling face with tear"},{"emoji":"😋","title":"face savoring food"},{"emoji":"😛","title":"face with tongue"},{"emoji":"😜","title":"winking face with tongue"},{"emoji":"🤪","title":"zany face"},{"emoji":"😝","title":"squinting face with tongue"},{"emoji":"🤑","title":"money-mouth face"},{"emoji":"🤗","title":"hugging face"},{"emoji":"🤭","title":"face with hand over mouth"},{"emoji":"🫢","title":"face with open eyes and hand over mouth"},{"emoji":"🫣","title":"face with peeking eye"},{"emoji":"🤫","title":"shushing face"},{"emoji":"🤔","title":"thinking face"},{"emoji":"🫡","title":"saluting face"},{"emoji":"🤐","title":"zipper-mouth face"},{"emoji":"🤨","title":"face with raised eyebrow"},{"emoji":"😐","title":"neutral face"},{"emoji":"😑","title":"expressionless face"},{"emoji":"😶","title":"face without mouth"},{"emoji":"🫥","title":"dotted line face"},{"emoji":"😶‍🌫️","title":"face in clouds"},{"emoji":"😶‍🌫","title":"face in clouds"},{"emoji":"😏","title":"smirking face"},{"emoji":"😒","title":"unamused face"},{"emoji":"🙄","title":"face with rolling eyes"},{"emoji":"😬","title":"grimacing face"},{"emoji":"😮‍💨","title":"face exhaling"},{"emoji":"🤥","title":"lying face"},{"emoji":"😌","title":"relieved face"},{"emoji":"😔","title":"pensive face"},{"emoji":"😪","title":"sleepy face"},{"emoji":"🤤","title":"drooling face"},{"emoji":"😴","title":"sleeping face"},{"emoji":"😷","title":"face with medical mask"},{"emoji":"🤒","title":"face with thermometer"},{"emoji":"🤕","title":"face with head-bandage"},{"emoji":"🤢","title":"nauseated face"},{"emoji":"🤮","title":"face vomiting"},{"emoji":"🤧","title":"sneezing face"},{"emoji":"🥵","title":"hot face"},{"emoji":"🥶","title":"cold face"},{"emoji":"🥴","title":"woozy face"},{"emoji":"😵","title":"knocked-out face"},{"emoji":"😵‍💫","title":"face with spiral eyes"},{"emoji":"🤯","title":"exploding head"},{"emoji":"🤠","title":"cowboy hat face"},{"emoji":"🥳","title":"partying face"},{"emoji":"🥸","title":"disguised face"},{"emoji":"😎","title":"smiling face with sunglasses"},{"emoji":"🤓","title":"nerd face"},{"emoji":"🧐","title":"face with monocle"},{"emoji":"😕","title":"confused face"},{"emoji":"🫤","title":"face with diagonal mouth"},{"emoji":"😟","title":"worried face"},{"emoji":"🙁","title":"slightly frowning face"},{"emoji":"☹️","title":"frowning face"},{"emoji":"☹","title":"frowning face"},{"emoji":"😮","title":"face with open mouth"},{"emoji":"😯","title":"hushed face"},{"emoji":"😲","title":"astonished face"},{"emoji":"😳","title":"flushed face"},{"emoji":"🥺","title":"pleading face"},{"emoji":"🥹","title":"face holding back tears"},{"emoji":"😦","title":"frowning face with open mouth"},{"emoji":"😧","title":"anguished face"},{"emoji":"😨","title":"fearful face"},{"emoji":"😰","title":"anxious face with sweat"},{"emoji":"😥","title":"sad but relieved face"},{"emoji":"😢","title":"crying face"},{"emoji":"😭","title":"loudly crying face"},{"emoji":"😱","title":"face screaming in fear"},{"emoji":"😖","title":"confounded face"},{"emoji":"😣","title":"persevering face"},{"emoji":"😞","title":"disappointed face"},{"emoji":"😓","title":"downcast face with sweat"},{"emoji":"😩","title":"weary face"},{"emoji":"😫","title":"tired face"},{"emoji":"🥱","title":"yawning face"},{"emoji":"😤","title":"face with steam from nose"},{"emoji":"😡","title":"pouting face"},{"emoji":"😠","title":"angry face"},{"emoji":"🤬","title":"face with symbols on mouth"},{"emoji":"😈","title":"smiling face with horns"},{"emoji":"👿","title":"angry face with horns"},{"emoji":"💀","title":"skull"},{"emoji":"☠️","title":"skull and crossbones"},{"emoji":"☠","title":"skull and crossbones"},{"emoji":"💩","title":"pile of poo"},{"emoji":"🤡","title":"clown face"},{"emoji":"👹","title":"ogre"},{"emoji":"👺","title":"goblin"},{"emoji":"👻","title":"ghost"},{"emoji":"👽","title":"alien"},{"emoji":"👾","title":"alien monster"},{"emoji":"🤖","title":"robot"},{"emoji":"😺","title":"grinning cat"},{"emoji":"😸","title":"grinning cat with smiling eyes"},{"emoji":"😹","title":"cat with tears of joy"},{"emoji":"😻","title":"smiling cat with heart-eyes"},{"emoji":"😼","title":"cat with wry smile"},{"emoji":"😽","title":"kissing cat"},{"emoji":"🙀","title":"weary cat"},{"emoji":"😿","title":"crying cat"},{"emoji":"😾","title":"pouting cat"},{"emoji":"🙈","title":"see-no-evil monkey"},{"emoji":"🙉","title":"hear-no-evil monkey"},{"emoji":"🙊","title":"speak-no-evil monkey"}]
@Component({
  components: {EmptyData},
  mounted(): void{
    ((this.$refs.allExpressionSearchInput as ElInput).$refs.input as HTMLElement).addEventListener("keydown", this.onAllExpressionSearchInputKeydown)
  },
  beforeDestroy(): void{
    ((this.$refs.allExpressionSearchInput as ElInput).$refs.input as HTMLElement).removeEventListener("keydown", this.onAllExpressionSearchInputKeydown)
  }
})
export default class EmojiPopover extends Vue{
  emojis: Array<{emoji: string, title: string}>
  allExpressions: Array<ExpressionVo>
  allExpressionIsLast: boolean
  allExpressionPageIndex: number
  allExpressionKeywords: string
  historyExpressions: Array<ExpressionVo>
  expressionUrl: string

  data(): any{
    const historyExpressionStr = localStorage.getItem(LOCAL_STORAGE_KEY_EXPRESSION_HISTORY);
    let historyExpressions: Array<ExpressionVo> = []
    if (historyExpressionStr) {
      try {
        historyExpressions = JSON.parse(historyExpressionStr)
      } catch (e) {
        console.log("历史表情解析失败, content=" + historyExpressionStr, e);
        localStorage.removeItem(LOCAL_STORAGE_KEY_EXPRESSION_HISTORY)
      }
    }
    return {
      emojis: EMOJIS,
      allExpressions: [],
      allExpressionIsLast: false,
      allExpressionPageIndex: 0,
      allExpressionKeywords: "",
      historyExpressions,
      expressionUrl: URL_EXPRESSION
    }
  }

  /**
   * 更新popper的位置
   */
  updatePopper(): void{
    (this.$refs.popper as any).updatePopper()
  }

  /**
   * tab点击事件
   */
  onTabClick(panel: ElTabPane): void{
    this.$nextTick(this.updatePopper)
    if(panel.label === "全部" && !this.allExpressions.length && !this.allExpressionIsLast){
      this.reloadAllExpression().then(this.updatePopper)
    }
  }

  /**
   * 加载所有表情下一页
   */
  async loadAllExpressionNext(): Promise<void>{
    if(this.allExpressionIsLast) return;
    const result = await ExpressionService.getExpressionPage(this.allExpressionKeywords, [], {page: this.allExpressionPageIndex, size: 20});
    this.allExpressions.push(...result.content)
    this.allExpressionPageIndex ++
    this.allExpressionIsLast = result.last
  }

  /**
   * 重新加载表情
   */
  async reloadAllExpression(): Promise<void>{
    this.allExpressionPageIndex = 0;
    this.allExpressionIsLast = false
    await this.loadAllExpressionNext()
  }

  /**
   * 输入框按键事件
   */
  onAllExpressionSearchInputKeydown(e: KeyboardEvent): void{
    if(e.key !== "Enter") return;
    this.reloadAllExpression()
  }

  /**
   * 选中历史表情
   */
  onSelectHistoryExpression(expression: ExpressionVo): void{
    const itemIndex = this.historyExpressions.findIndex(e=>e.id === expression.id);
    if(itemIndex !== -1){
      this.historyExpressions.splice(itemIndex, 1)
    }
    this.historyExpressions.unshift({id: expression.id, title: expression.title} as ExpressionVo);
    if(this.historyExpressions.length > 50){
      this.historyExpressions.splice(50)
    }
    this.$emit("select", "[" + expression.title + "]")
    localStorage.setItem(LOCAL_STORAGE_KEY_EXPRESSION_HISTORY, JSON.stringify(this.historyExpressions))
  }

  /**
   * 所有表情列表被选中
   */
  onSelectAllExpression(expression: ExpressionVo): void{
    this.onSelectHistoryExpression(expression)
  }
}
</script>

<style lang="scss">
@import "src/style/var-device-width";
.emoji-popper{
  padding: 0;
  max-width: 500px;
}
.emoji-box{
  max-height: 150px;
  overflow-y: auto;
  user-select: none;
}
.emoji{
  margin-left: 1em;
  margin-right: 1em;
  line-height: 2em;
  font-size: 1.3em;
  cursor: pointer;
}
.expression-item{
  min-height: 100px;
  flex: 1 0 15%;
  cursor: pointer;
}
@media (max-width: $device-width-md) {
  .emoji-popper{
    max-width: 90%;
  }
}
</style>
