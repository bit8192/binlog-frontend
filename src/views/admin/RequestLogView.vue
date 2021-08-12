<template>
<div class="px-3 py-4 flex-column" style="height: calc(100% - 3rem)">
  <el-form inline>
    <el-form-item label="ip">
      <el-input label="ip" v-model="queryParam.ip" placeholder="支持%模糊查询" size="small" />
    </el-form-item>
    <el-form-item label="address">
      <el-input label="address" v-model="queryParam.address" placeholder="支持%模糊查询" size="small" />
    </el-form-item>
    <el-form-item label="method">
      <el-select v-model="queryParam.method">
        <el-option value="GET">GET</el-option>
        <el-option value="POST">POST</el-option>
        <el-option value="DELETE">DELETE</el-option>
        <el-option value="PUT">PUT</el-option>
        <el-option value="PATCH">PATCH</el-option>
        <el-option value="OPTIONS">OPTIONS</el-option>
        <el-option value="HEAD">HEAD</el-option>
        <el-option value="TRACE">TRACE</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="host">
      <el-input label="host" v-model="queryParam.host" placeholder="支持%模糊查询" size="small" />
    </el-form-item>
    <el-form-item label="referer">
      <el-input label="referer" v-model="queryParam.referer" placeholder="支持%模糊查询" size="small" />
    </el-form-item>
    <el-form-item label="requestUri">
      <el-input label="requestUri" v-model="queryParam.requestUri" placeholder="支持%模糊查询" size="small" />
    </el-form-item>
    <el-form-item label="userAgent">
      <el-input label="userAgent" v-model="queryParam.userAgent" placeholder="支持%模糊查询" size="small" />
    </el-form-item>
    <el-form-item label="sessionId">
      <el-input label="sessionId" v-model="queryParam.sessionId" size="small" />
    </el-form-item>
    <el-form-item label="clientId">
      <el-input label="clientId" v-model="queryParam.clientId" size="small" />
    </el-form-item>
    <el-form-item label="userId">
      <user-select size="small" v-model="queryParam.userId" />
    </el-form-item>
    <el-form-item label="时间">
      <el-date-picker v-model="dateRange" type="daterange" ranger-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
    </el-form-item>
    <el-form-item>
      <el-button size="small" icon="el-icon-search" v-on:click="refresh" />
    </el-form-item>
  </el-form>
  <el-table :data="requestLogs" border class="flex-1" height="auto">
    <el-table-column type="index" label="序号" width="50" fixed />
    <el-table-column prop="createdDate" label="时间" width="165" fixed />
    <el-table-column prop="id" label="id" width="70"/>
    <el-table-column prop="ip" label="ip" />
    <el-table-column prop="address" label="address" width="200" />
    <el-table-column prop="method" label="method" width="50" />
    <el-table-column prop="host" label="host" width="100" />
    <el-table-column prop="referer" label="referer" width="300" />
    <el-table-column prop="requestUri" label="requestUri" width="250" />
    <el-table-column prop="userAgent" label="userAgent" width="600" />
    <el-table-column prop="sessionId" label="sessionId" width="300" />
    <el-table-column prop="clientId" label="clientId" width="300" />
    <el-table-column prop="userId" label="userId" width="80" />
  </el-table>
  <div class="text-right">
    <el-pagination :current-page="pageIndex" :page-size="pageSize" :page-count="pageCount" :total="totalElements" layout="total, prev, pager, next" v-on:current-change="p=>{pageIndex = p - 1; loadPage()}" />
  </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {RequestLog} from "@/domain/RequestLog";
import RequestLogService from "@/service/RequestLogService";
import UserSelect from "@/components/user/UserSelect.vue";

@Component({
  components: {UserSelect}
})
export default class RequestLogView extends Vue{
  requestLogs: Array<RequestLog>
  pageIndex = 0
  pageSize = 20
  pageCount = 0
  totalElements = 0
  queryParam: RequestLog
  dateRange: [Date, Date]

  data(): any{
    return {
      requestLogs: [],
      queryParam: {
        ip: "",
        address: "",
        host: "",
        referer: "",
        userAgent: "",
        method: "",
        requestUri: "",
        sessionId: "",
        clientId: "",
        userId: null
      },
      dateRange: null,
    }
  }

  mounted(): void{
    this.loadPage()
  }

  async loadPage(): Promise<void>{
    const result = await RequestLogService.page(
        this.queryParam.ip,
        this.queryParam.address,
        this.queryParam.host,
        this.queryParam.referer,
        this.queryParam.userAgent,
        this.queryParam.method,
        this.queryParam.requestUri,
        this.queryParam.sessionId,
        this.queryParam.clientId,
        this.queryParam.userId,
        this.dateRange && this.dateRange[0],
        this.dateRange && this.dateRange[1],
        {page: this.pageIndex, size: this.pageSize}
    );
    this.requestLogs = result.content;
    this.pageCount = result.totalPages;
    this.totalElements = result.totalElements
  }

  async refresh(): Promise<void>{
    this.pageIndex = 0;
    await this.loadPage()
  }
}
</script>

<style scoped>

</style>
