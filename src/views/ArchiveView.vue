<template>
  <main>
    <el-card>
      <el-timeline>
        <el-timeline-item v-for="(archives, month) in archiveMap" :key="month" :timestamp="month" placement="top">
          <ul>
            <li v-for="archive of archives" :key="archive.id">
              <router-link :to="'/article/' + archive.id" class="py-1 flex-row justify-content-between align-items-center">
                <h3>{{archive.title}}</h3>
                <span class="color-secondary">{{DateUtils.formatDate(archive.createdDate)}}</span>
              </router-link>
            </li>
          </ul>
        </el-timeline-item>
      </el-timeline>
      <el-pagination layout="prev,pager,next" :current-page="pageable.page + 1" :page-count="pageCount" @current-change="page=>gotoPage(page - 1)" />
    </el-card>
  </main>
</template>

<script lang="ts">
import ArchiveVo from "@/domain/ArchiveVo";
import {Options, Vue} from "vue-class-component";
import Pageable from "@/domain/Pageable";
import ArchiveService from "@/service/ArchiveService";
import DateUtils from "@/utils/DateUtils";

@Options({
  name: "ArchiveView"
})
export default class ArchiveView extends Vue{
  archiveMap: {[key: string]: ArchiveVo[]}
  pageable: Pageable
  pageCount: number

  data(): any{
    return {
      archiveMap: {},
      pageable: {
        page: 0,
        size: 20
      },
      pageCount: 0,
    };
  }

  mounted(): void{
    this.gotoPage()
  }

  async gotoPage(pageNumber = 0): Promise<void>{
    this.pageable.page = pageNumber
    const page = await ArchiveService.page(this.pageable)
    this.archiveMap = page.content.reduce((map, item)=>{
      const month = DateUtils.formatMonth(item.createdDate);
      if(!map[month]) map[month] = [];
      map[month].push(item);
      return map;
    }, {});
    this.pageCount = page.totalPages;
  }
}
</script>

<style scoped>

</style>
