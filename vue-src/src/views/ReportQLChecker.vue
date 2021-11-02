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
    <h1>Report QL Checker: {{ dateFormat(form.selectDate) }}</h1>
    <el-table :data="filteredResources" style="width: 100%" height="500">
        <el-table-column fixed prop="tracking" label="Tracking" width="150"></el-table-column>
        <el-table-column prop="branch_name" label="รหัสสาขา" width="120"></el-table-column>
        <el-table-column label="เวลา" align="center" width="100">
            <template #default="scope">
                <span>{{ dateFormatDetail(scope.row.record_date) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="billing_no" label="เลขที่บิล" width="250"></el-table-column>
        <el-table-column prop="error_code" label="ข้อมูลที่ผิด" width="300">
            <template #default="scope">
                <span v-if="scope.row.error_code == 'error_parcel_type'">ประเภทการจัดส่งไม่ตรงกัน</span>
                <span v-else-if="scope.row.error_code == 'error_zipcode'">รหัสไปรษณีย์ไม่ตรงกัน</span>
                <span v-else-if="scope.row.error_code == 'both'">ทั้ง 2 ส่วนไม่ตรงกัน</span>
                <span v-else>ไม่ได้ระบุ ข้อมูลที่ผิด</span>
            </template>
        </el-table-column>
        <el-table-column prop="current_value" label="สาเหตุ" width="300">
            <template #default="scope">
                <span v-if="scope.row.error_maker == 'key operator'">เจ้าหน้าที่ คีย์ข้อมูล</span>
                <span v-else-if="scope.row.error_maker == 'shop staff'">เจ้าหน้าที่ สาขา</span>
                <span v-else-if="scope.row.error_maker == 'system'">ระบบ</span>
                <span v-else>ไม่ได้ระบุ สาเหตุ</span>
            </template>
        </el-table-column>
        <el-table-column label="รหัสผู้ใช้/เจ้าหน้าที่คีย์ข้อมูล" width="250">
            <template #default="scope">
                <span>{{ scope.row.user_id }} / {{ scope.row.operation_key }}</span>
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
        .get(this.url + "/log-daily-qlchecker?date_check=" + this.form.selectDate)
        .then(response => {
          if (response.data.length === 0) {
            //@ts-ignore
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
    dateFormat(strDate: any) {
        return moment(strDate).format("LL");
    },
    dateFormatDetail(strDate: any) {
        return moment(strDate).format("HH:mm:ss");
    },
    setPage(this:any, val: any) {
      this.page = val;
    },
  },
  computed: {
    filteredResources(this: any) {
      if(this.form.tracking == null) return this.data;      
      this.filtered = this.data.filter((item: any) => !this.form.tracking || (item.tracking).toLowerCase().includes(this.form.tracking.toLowerCase()));
      this.total = this.filtered.length;
      return this.filtered.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    }
  }
});
</script>

<style>
</style>