<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="เลือกวันที่">
        <el-date-picker type="date" placeholder="Pick a date" @change="getData()" v-model="form.selectDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="ค้นหา tracking">
        <el-input v-model="form.tracking" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getData">Refresh</el-button>
      </el-form-item>
    </el-form>
    <h1>รายการเปลี่ยนเลขที่จัดส่ง: {{ dateFormat(form.selectDate) }}</h1>
    <el-table :data="filteredResources" style="width: 100%" height="500" :default-sort="{prop: 'time_to_system', order: 'ascending'}">
        <el-table-column type="expand">
            <template #default="props">
                <p><b>รายละเอียดเพิ่มเติม:</b> {{ props.row.remark }}</p>
            </template>
        </el-table-column>
        <el-table-column fixed prop="ref" label="Tracking" width="120"></el-table-column>
        <el-table-column prop="time_to_system" sortable label="วันที่/เวลา" align="center" width="170">
            <template #default="scope">
                <span>{{ dateFormatDetail(scope.row.time_to_system) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="branch_name" label="สาขา" width="150"></el-table-column>
        <el-table-column prop="billing_no" label="เลขที่บิล" width="220"></el-table-column>
        
        <el-table-column prop="current_value" label="ค่าปัจจุบัน" width="300"></el-table-column>
        <el-table-column prop="reason" label="เหตุผล" width="500">
            <template #default="scope">
                <span v-if="scope.row.reason == 'change_cod_to_normal'">เปลี่ยนประเภท COD เป็น NORMAL</span>
                <span v-else-if="scope.row.reason == 'change_normal_to_cod'">เปลี่ยนประเภท NORMAL เป็น COD</span>
                <span v-else-if="scope.row.reason == 'change_codvalue'">เปลี่ยนมูลค่า COD</span>
                <span v-else-if="scope.row.reason == 'change_address'">เปลี่ยนที่อยู่</span>
                <span v-else-if="scope.row.reason == 'close_status_early_due'">ปิดสถานะก่อนกำหนด</span>
                <span v-else>ไม่ได้ระบุ เหตุผล</span>
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
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "ReportRelabel",
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
        selectDate: moment().format("YYYY-MM-DD")
      },
      sorting: -1,
      url: "https://tool.945parcel.com",
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
      axios
        .get(this.url + "/log-relabel-tool?date_check=" + this.form.selectDate)
        .then(response => {
          if (response.data.length === 0) {
            //@ts-ignore
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.data = [];
          } else {
            for (let e of response.data) {
                if (e.module_name == "relabeling_tracking") {
                    this.data.push(e);
                }
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    dateFormat(strDate: any) {
        return moment(strDate).format("LL");
    },
    dateFormatDetail(strDate: any) {
        return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    },
    setPage(this:any, val: any) {
      this.page = val;
    },
  },
  computed: {
    filteredResources(this: any) {
      if(this.form.tracking == null) return this.data;      
        this.filtered = this.data.filter((item: any) => !this.form.tracking || (item.ref).toLowerCase().includes(this.form.tracking.toLowerCase()));
        this.total = this.filtered.length;
        return this.filtered.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    }
  }
});
</script>

<style>
</style>