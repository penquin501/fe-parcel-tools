<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="ค้นหา tracking">
        <el-input v-model="form.tracking" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getData">Refresh</el-button>
      </el-form-item>
    </el-form>
    <h1>รายการ booking ninja: {{ dateFormat(form.selectDate) }}</h1>
    <el-table :data="filteredResources" style="width: 100%" height="500">
        <el-table-column fixed prop="tracking" label="Tracking" width="150"></el-table-column>
        <el-table-column label="application" width="100">
            <template #default="scope">
                {{ scope.row.raw_data.error.application !== undefined ? scope.row.raw_data.error.application : "" }}
            </template>
        </el-table-column>
        <el-table-column label="code" width="100">
            <template #default="scope">
                {{ scope.row.raw_data.error.code !== undefined ? scope.row.raw_data.error.code : "" }}
            </template>
        </el-table-column>
        <el-table-column label="message" width="500">
            <template #default="scope">
                {{ scope.row.raw_data.error.message !== undefined ? scope.row.raw_data.error.message : "" }}
            </template>
        </el-table-column>
        <el-table-column label="title">
            <template #default="scope">
                {{ scope.row.raw_data.error.title !== undefined ? scope.row.raw_data.error.title : "" }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="status code" width="100"></el-table-column>
        <el-table-column label="record_at">
            <template #default="scope">
                <span style="color: red; font-size: 10px;">{{ dateFromNow(scope.row.record_at) }}</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="Detail" width="80" align="center">
            <template #default="scope">
                <el-button @click.prevent="setStore(scope.row)">
                    <i class="fa fa-bars" aria-hidden="true"></i>
                </el-button>
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
        selectDate: moment().format("YYYY-MM-DD"),
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
        .get(this.url + "/booking-ninja-report")
        .then(response => {
          if (response.data.length === 0) {
            //@ts-ignore
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.data = [];
          } else {
            // this.data = response.data;
            let dataRes = response.data;
            for(let item of dataRes) {
                item.raw_data = JSON.parse(item.raw_data);
                if(item.raw_data.error == undefined){
                    item.raw_data.error = {
                        application: "",
                        code: "",
                        message: item.raw_data.message,
                        title: "",
                    }
                    this.data.push(item);
                } else {
                    this.data.push(item);
                }
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setStore(row: any) {
      //@ts-ignore
      this.$store.commit("ninjaBooking", row);
      this.$router.push({ name: "NinjaBookingDetail" });
    },
    dateFromNow(strDate: any) {
        return moment(strDate).fromNow();
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