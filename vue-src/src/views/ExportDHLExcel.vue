<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="เลือกวันที่">
        <el-date-picker type="date" placeholder="Pick a date" @change="getlistBilling()" v-model="form.selectDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="getData">Export Excel</el-button>
      </el-form-item>
    </el-form>
    <p style="color: red;">{{ result }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "TrackingInfo",
  components: {
  },
  data() {
    return {
      form: {
        selectDate: moment().format("YYYY-MM-DD")
      },
      result: "",
      url: "https://tool.945parcel.com",
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    }
  },
  methods: {
    getData(this: any) {
        this.result = "";
        if (this.form.selectDate == "") {
            this.$alert("กรุณาเลือก วันที่ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else {
            window.open(this.url + "/get-excel-file-unbook?date_check=" + this.form.selectDate);
        }
    },
    dateFormat(strDate: any) {
        return moment(strDate).format("LL HH:mm");
    },
    dateFormatDetail(strDate: any) {
        return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  computed: {
  }
});
</script>

<style>
</style>