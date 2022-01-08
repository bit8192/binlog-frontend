<template>
  <div class="p-4">
    <div class="flex-row mb-4">
      <el-card class="flex-1 mr-2" :body-style="{padding: '5px 8px'}">
        <template #header>
          <span class="number-span-title color-text-sub">访问量</span>
          <div class="text-center">
            <span class="number-span">{{binlogStatus.totalVisitNum || '-'}}</span>
          </div>
        </template>
        <ul class="list-style-none">
          <li class="number-compare-item flex-row justify-content-between">
            <span>今天</span>
            <span>{{binlogStatus.todayVisitNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.todayVisitNum > binlogStatus.yesterdayVisitNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.todayVisitNum > binlogStatus.yesterdayVisitNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.yesterdayVisitNum ? ((binlogStatus.todayVisitNum - binlogStatus.yesterdayVisitNum)/binlogStatus.yesterdayVisitNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本周</span>
            <span>{{binlogStatus.thisWeekVisitNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisWeekVisitNum > binlogStatus.lastWeekVisitNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisWeekVisitNum > binlogStatus.lastWeekVisitNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastWeekVisitNum ? ((binlogStatus.thisWeekVisitNum - binlogStatus.lastWeekVisitNum)/binlogStatus.lastWeekVisitNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本月</span>
            <span>{{binlogStatus.thisMonthVisitNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisMonthVisitNum > binlogStatus.lastMonthVisitNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisMonthVisitNum > binlogStatus.lastMonthVisitNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastMonthVisitNum ? ((binlogStatus.thisMonthVisitNum - binlogStatus.lastMonthVisitNum)/binlogStatus.lastMonthVisitNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>今年</span>
            <span>{{binlogStatus.thisYearVisitNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisYearVisitNum > binlogStatus.lastYearVisitNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisYearVisitNum > binlogStatus.lastYearVisitNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastYearVisitNum ? ((binlogStatus.thisYearVisitNum - binlogStatus.lastYearVisitNum)/binlogStatus.lastYearVisitNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
        </ul>
      </el-card>
      <el-card class="flex-1 mr-2" :body-style="{padding: '5px 8px'}">
        <template #header>
          <span class="number-span-title color-text-sub">接口访问量</span>
          <div class="text-center">
            <span class="number-span">{{binlogStatus.totalRequestNum || '-'}}</span>
          </div>
        </template>
        <ul class="list-style-none">
          <li class="number-compare-item flex-row justify-content-between">
            <span>今天</span>
            <span>{{binlogStatus.todayRequestNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.todayRequestNum > binlogStatus.yesterdayRequestNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.todayRequestNum > binlogStatus.yesterdayRequestNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.yesterdayRequestNum ? ((binlogStatus.todayRequestNum - binlogStatus.yesterdayRequestNum)/binlogStatus.yesterdayRequestNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本周</span>
            <span>{{binlogStatus.thisWeekRequestNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisWeekRequestNum > binlogStatus.lastWeekRequestNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisWeekRequestNum > binlogStatus.lastWeekRequestNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastWeekRequestNum ? ((binlogStatus.thisWeekRequestNum - binlogStatus.lastWeekRequestNum)/binlogStatus.lastWeekRequestNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本月</span>
            <span>{{binlogStatus.thisMonthRequestNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisMonthRequestNum > binlogStatus.lastMonthRequestNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisMonthRequestNum > binlogStatus.lastMonthRequestNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastMonthRequestNum ? ((binlogStatus.thisMonthRequestNum - binlogStatus.lastMonthRequestNum)/binlogStatus.lastMonthRequestNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>今年</span>
            <span>{{binlogStatus.thisYearRequestNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisYearRequestNum > binlogStatus.lastYearRequestNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisYearRequestNum > binlogStatus.lastYearRequestNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastYearRequestNum ? ((binlogStatus.thisYearRequestNum - binlogStatus.lastYearRequestNum)/binlogStatus.lastYearRequestNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
        </ul>
      </el-card>
      <el-card class="flex-1 mr-2" :body-style="{padding: '5px 8px'}">
        <template #header>
          <span class="number-span-title color-text-sub">用户量</span>
          <div class="text-center">
            <span class="number-span">{{ binlogStatus.totalUserNum || '-' }}</span>
          </div>
        </template>
        <ul class="list-style-none">
          <li class="number-compare-item flex-row justify-content-between">
            <span>今天</span>
            <span>{{binlogStatus.todayAddUserNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.todayAddUserNum > binlogStatus.yesterdayAddUserNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.todayAddUserNum > binlogStatus.yesterdayAddUserNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.yesterdayAddUserNum ? ((binlogStatus.todayAddUserNum - binlogStatus.yesterdayAddUserNum)/binlogStatus.yesterdayAddUserNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本周</span>
            <span>{{binlogStatus.thisWeekAddUserNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisWeekAddUserNum > binlogStatus.lastWeekAddUserNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisWeekAddUserNum > binlogStatus.lastWeekAddUserNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastWeekAddUserNum ? ((binlogStatus.thisWeekAddUserNum - binlogStatus.lastWeekAddUserNum)/binlogStatus.lastWeekAddUserNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本月</span>
            <span>{{binlogStatus.thisMonthAddUserNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisMonthAddUserNum > binlogStatus.lastMonthAddUserNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisMonthAddUserNum > binlogStatus.lastMonthAddUserNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastMonthAddUserNum ? ((binlogStatus.thisMonthAddUserNum - binlogStatus.lastMonthAddUserNum)/binlogStatus.lastMonthAddUserNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>今年</span>
            <span>{{binlogStatus.thisYearAddUserNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisYearAddUserNum > binlogStatus.lastYearAddUserNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisYearAddUserNum > binlogStatus.lastYearAddUserNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastYearAddUserNum ? ((binlogStatus.thisYearAddUserNum - binlogStatus.lastYearAddUserNum)/binlogStatus.lastYearAddUserNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
        </ul>
      </el-card>
      <el-card class="flex-1" :body-style="{padding: '5px 8px'}">
        <template #header>
          <span class="number-span-title color-text-sub">登录用户量</span>
          <div class="text-center">
            <span class="number-span">{{binlogStatus.totalLoginNum || '-'}}</span>
          </div>
        </template>
        <ul class="list-style-none">
          <li class="number-compare-item flex-row justify-content-between">
            <span>今天</span>
            <span>{{binlogStatus.todayLoginNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.todayLoginNum > binlogStatus.yesterdayLoginNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.todayLoginNum > binlogStatus.yesterdayLoginNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.yesterdayLoginNum ? ((binlogStatus.todayLoginNum - binlogStatus.yesterdayLoginNum)/binlogStatus.yesterdayLoginNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本周</span>
            <span>{{binlogStatus.thisWeekLoginNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisWeekLoginNum > binlogStatus.lastWeekLoginNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisWeekLoginNum > binlogStatus.lastWeekLoginNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastWeekLoginNum ? ((binlogStatus.thisWeekLoginNum - binlogStatus.lastWeekLoginNum)/binlogStatus.lastWeekLoginNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>本月</span>
            <span>{{binlogStatus.thisMonthLoginNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisMonthLoginNum > binlogStatus.lastMonthLoginNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisMonthLoginNum > binlogStatus.lastMonthLoginNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastMonthLoginNum ? ((binlogStatus.thisMonthLoginNum - binlogStatus.lastMonthLoginNum)/binlogStatus.lastMonthLoginNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
          <li class="number-compare-item flex-row justify-content-between">
            <span>今年</span>
            <span>{{binlogStatus.thisYearLoginNum}}</span>
            <span>
              同比
              <span :class="binlogStatus.thisYearLoginNum > binlogStatus.lastYearLoginNum ? 'color-primary' : 'color-warning'">
                <font-awesome-icon :icon="binlogStatus.thisYearLoginNum > binlogStatus.lastYearLoginNum ? 'long-arrow-alt-up' : 'long-arrow-alt-down'" />
                {{binlogStatus.lastYearLoginNum ? ((binlogStatus.thisYearLoginNum - binlogStatus.lastYearLoginNum)/binlogStatus.lastYearLoginNum*100).toFixed(2) + '%' : '100%'}}
              </span>
            </span>
          </li>
        </ul>
      </el-card>
    </div>
    <div>
      <el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" v-model="dateRange" @change="onDatePickerChange" class="mr-2" />
      <el-button type="text" @click="setDateRange('今天')">今天</el-button>
      <el-button type="text" @click="setDateRange('昨天')">昨天</el-button>
      <el-button type="text" @click="setDateRange('本周')">本周</el-button>
      <el-button type="text" @click="setDateRange('上周')">上周</el-button>
      <el-button type="text" @click="setDateRange('本月')">本月</el-button>
      <el-button type="text" @click="setDateRange('上个月')">上个月</el-button>
      <el-button type="text" @click="setDateRange('今年')">今年</el-button>
      <el-button type="text" @click="setDateRange('去年')">去年</el-button>
    </div>
    <el-tabs active-name="visit" @tab-click="onTabClick" ref="statisticsTabs">
      <el-tab-pane label="浏览量" name="visit">
        <div ref="visitLineChart" style="height: 300px" />
      </el-tab-pane>
      <el-tab-pane label="区域" name="area">
        <div ref="areaBarChart" style="height: 300px" />
      </el-tab-pane>
      <el-tab-pane label="平台" name="platform">
        <div ref="platformBarChart" style="height: 300px" />
      </el-tab-pane>
      <el-tab-pane label="浏览器" name="browser">
        <div ref="browserBarChart" style="height: 300px" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as echarts from "echarts/core"
import {GridComponent, TitleComponent, TooltipComponent} from "echarts/components";
import {BarChart, LineChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import {EChartsOption} from "echarts";
import OverviewService from "@/service/OverviewService";
import BinlogStatus from "@/domain/BinlogStatus";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faLongArrowAltDown, faLongArrowAltUp} from "@fortawesome/free-solid-svg-icons";
import DateUtils from "@/utils/DateUtils";
echarts.use([GridComponent, LineChart, CanvasRenderer, TitleComponent, TooltipComponent, BarChart]);
library.add(faLongArrowAltUp, faLongArrowAltDown)

@Options({})
export default class Overview extends Vue{
  binlogStatus: BinlogStatus
  dateRange: [Date, Date]
  visitLineChart: echarts.EChartsType
  areaBarChart: echarts.EChartsType
  platformBarChart: echarts.EChartsType
  browserBarChart: echarts.EChartsType
  currentTabName = "visit"
  chartIsNeedUpdate = {
    visit: true,
    area: true,
    platform: true,
    browser: true
  }

  data(): any{
    return {
      binlogStatus: {},
      dateRange: [DateUtils.thisMonth(), DateUtils.tomorrow()]
    }
  }

  mounted(): void{
    this.loadData()
  }

  /**
   * 配置浏览量
   */
  async updateVisitLineChart(): Promise<void>{
    if(!this.$refs.visitLineChart) return;
    if(!this.visitLineChart) this.visitLineChart = echarts.init(this.$refs.visitLineChart as HTMLElement);
    const data = await OverviewService.getVisitStatistics(this.dateRange[0], this.dateRange[1])
    this.visitLineChart.setOption({
      grid: {
        left: "5%"
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.map(i=>i.key),
      },
      yAxis: {},
      series: [
        {
          type: 'line',
          data: data.map(i=>i.value)
        }
      ]
    } as EChartsOption)
    this.chartIsNeedUpdate.visit = false;
  }

  /**
   * 区域Chart配置
   */
  async updateAreaBarChart(): Promise<void>{
    if(!this.$refs.areaBarChart) return;
    if(!this.areaBarChart) this.areaBarChart = echarts.init(this.$refs.areaBarChart as HTMLElement);
    const data = await OverviewService.getAreaStatistics(this.dateRange[0], this.dateRange[1])
    this.areaBarChart.setOption({
      grid: {
        left: "5%"
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.map(i=>i.key),
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: data.map(i=>i.value)
        }
      ]
    } as EChartsOption)
    this.chartIsNeedUpdate.area = false;
  }

  /**
   * 平台Chart配置
   */
  async updatePlatformBarChart(): Promise<void>{
    if(!this.$refs.platformBarChart) return;
    if(!this.platformBarChart) this.platformBarChart = echarts.init(this.$refs.platformBarChart as HTMLElement);
    const data = await OverviewService.getPlatformStatistics(this.dateRange[0], this.dateRange[1])
    this.platformBarChart.setOption({
      grid: {
        left: "5%"
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.map(i=>i.key),
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: data.map(i=>i.value)
        }
      ]
    } as EChartsOption)
    this.chartIsNeedUpdate.platform = false;
  }

  /**
   * 浏览器Chart配置
   */
  async updateBrowserBarChart(): Promise<void>{
    if(!this.$refs.browserBarChart) return;
    if(!this.browserBarChart) this.browserBarChart = echarts.init(this.$refs.browserBarChart as HTMLElement);
    const data = await OverviewService.getBrowserStatistics(this.dateRange[0], this.dateRange[1])
    this.browserBarChart.setOption({
      grid: {
        left: "5%"
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.map(i=>i.key),
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: data.map(i=>i.value)
        }
      ]
    } as EChartsOption)
    this.chartIsNeedUpdate.browser = false;
  }

  async loadData(): Promise<void>{
    this.binlogStatus = await OverviewService.getBinlogStatus();
    await this.updateVisitLineChart();
  }

  async setDateRange(type: string): Promise<void>{
    switch (type) {
      case "今天":
        this.dateRange = [DateUtils.today(), DateUtils.tomorrow()];
        break;
      case "昨天":
        this.dateRange = [DateUtils.yesterday(), DateUtils.today()];
        break;
      case "本周":
        this.dateRange = [DateUtils.thisMonday(), new Date(DateUtils.thisMonday().getTime() + 7 * DateUtils.INTERVAL_1_DAY)];
        break;
      case "上周":
        this.dateRange = [DateUtils.lastMonday(), DateUtils.thisMonday()];
        break;
      case "本月":
        this.dateRange = [DateUtils.thisMonth(), new Date(DateUtils.thisMonth().getTime() + DateUtils.getMonthDateNum(new Date().getFullYear(), new Date().getMonth()) * DateUtils.INTERVAL_1_DAY)]
        break;
      case "上个月":
        this.dateRange = [DateUtils.lastMonth(), DateUtils.thisMonth()];
        break;
      case "今年":
        this.dateRange = [DateUtils.thisYear(), new Date(DateUtils.thisYear().getTime() + (DateUtils.isLeapYear(new Date().getFullYear()) ? 366 : 365) * DateUtils.INTERVAL_1_DAY)]
        break;
      case "去年":
        this.dateRange = [DateUtils.lastYear(), DateUtils.thisYear()];
        break;
    }
    this.chartIsNeedUpdate.visit = true;
    this.chartIsNeedUpdate.area = true;
    this.chartIsNeedUpdate.platform = true;
    this.chartIsNeedUpdate.browser = true;
    await this.updateChart(this.currentTabName);
  }

  /**
   * 时间范围被改变刷新数据
   */
  async onDatePickerChange(): Promise<void>{
    this.chartIsNeedUpdate.visit = true;
    this.chartIsNeedUpdate.area = true;
    this.chartIsNeedUpdate.platform = true;
    this.chartIsNeedUpdate.browser = true;
    await this.updateChart(this.currentTabName);
  }

  onTabClick(tabPanel: any): void{
    this.currentTabName = tabPanel.name;
    this.$nextTick(()=>this.updateChart(tabPanel.name));
  }

  async updateChart(name: string): Promise<void>{
    switch (name){
      case "visit":
        if(this.chartIsNeedUpdate.visit) await this.updateVisitLineChart()
        break;
      case "area":
        if(this.chartIsNeedUpdate.area) await this.updateAreaBarChart();
        break;
      case "platform":
        if(this.chartIsNeedUpdate.platform) await this.updatePlatformBarChart();
        break;
      case "browser":
        if(this.chartIsNeedUpdate.browser) await this.updateBrowserBarChart();
        break;
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/style/var-color";
.number-span{
  font-size: 2em;
}
.number-compare-item{
  color: $color-text-sub;
  font-size: .8em;
}
</style>
