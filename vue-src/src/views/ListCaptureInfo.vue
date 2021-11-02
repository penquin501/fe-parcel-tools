<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="ค้นหา Tracking">
        <el-input @keypress="isNumber($event)" v-model="form.tracking" maxlength="13" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getData">Refresh</el-button>
      </el-form-item>
    </el-form>
    <p>ชื่อผู้ส่ง: {{ $store.state.report_capture_monitor.memberName }}</p>
    <el-table :data="filteredResources" style="width: 100%" height="500">
      <el-table-column prop="barcode" label="เลขที่พัสดุ" width="170"></el-table-column>
      <el-table-column label="หน้ากล่อง">
        <template #default="scope">
          <span v-if="scope.row.image_path == '' ">{{ scope.row.image_url }}</span>
          <span v-else>
            <div class="demo-image__preview">
              <el-image style="width: 200px; height: 200px" :src="scope.row.image_url" :preview-src-list="[scope.row.image_url]"></el-image>
            </div>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>
    <div style="text-align: center">
      <el-pagination background layout="prev, pager, next" @current-change="setPage" :page-size="pageSize" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import dayjs from 'dayjs';

import moment from "moment-timezone";
moment.locale("th");
import 'dayjs/locale/th';
dayjs.locale('th');

export default defineComponent({
  name: "ListCaptureInfo",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      data: [],
      filtered: [],
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        tracking: "",
      },
      url: "https://tool.945parcel.com"
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    } else {
      this.getData();
    }
  },
  methods: {
    getData(this: any) {
      this.data = [];
      axios
        .get(this.url + "/list-capture-by-phone?phone_number=" + this.$store.state.report_capture_monitor.phoneNumber + "&date_check=" + this.$store.state.report_capture_monitor.dateSelect)
        .then(response => {
          if (response.data.length === 0) {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.data = [];
          } else {
            this.data = response.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setPage(this:any, val: any) {
      this.page = val;
    },
  },
  computed: {
    filteredResources(this: any) {
        if(this.form.tracking == null) return this.data;      
        this.filtered = this.data.filter((item: any) => !this.form.tracking || (item.barcode).toLowerCase().includes(this.form.tracking.toLowerCase()));
        this.total = this.filtered.length;
        return this.filtered.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    }
  }
});
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>