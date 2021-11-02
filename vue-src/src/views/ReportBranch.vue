<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="เลือกวันที่">
        <el-date-picker type="date" placeholder="Pick a date" @change="getlistBranch()" v-model="form.selectDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getlistBranch">Refresh</el-button>
      </el-form-item>
    </el-form>
    <h1>รายการแต่ละสาขา: {{ dateFormat(form.selectDate) }}</h1>
    <el-table :data="data" style="width: 100%" height="500" :row-class-name="tableRowClassName">
      <el-table-column prop="branch_name" label="ชื่อสาขา" align="center"></el-table-column>
      <el-table-column prop="c_not_book" label="จำนวนที่ยังไม่ได้ Book" align="right"></el-table-column>
      <el-table-column prop="cBooked" label="จำนวนที่ Book แล้ว" align="right"></el-table-column>
      <el-table-column prop="total" label="จำนวนทั้งหมด" align="right"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "ReportBranch",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      data: [],
      form: {
        billingNo: "",
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
      this.getlistBranch();
    }
  },
  methods: {
    getlistBranch(this: any) {
      axios
        .get(this.url + "/report-branch?date_check=" + this.form.selectDate)
        .then(response => {
          if (response.data.length === 0) {
            //@ts-ignore
            this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
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
    tableRowClassName({row, rowIndex}: any) {
        if (row.c_not_book === 0) {
          return 'success-row';
        }
        return '';
    }
  },
  computed: {
  }
});
</script>

<style>
</style>