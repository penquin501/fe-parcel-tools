<template>
  <div>
    <h1>DHL Booking LOG</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="กรุณาระบุ Tracking:">
        <el-input v-model="form.tracking" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click.prevent="getData">ค้นหา</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" style="width: 100%">
        <el-table-column fixed prop="tracking" label="tracking"></el-table-column>
        <el-table-column type="expand">
            <template #default="props">
                <p>ข้อมูลที่ส่ง: {{ props.row.prepare_json }}</p>
                <p>ข้อมูลที่ได้รับ: {{ props.row.res_json }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="status" label="status"></el-table-column>
        <el-table-column label="send_record_at">
            <template #default="scope">
                <span>{{ dateFormatDetail(scope.row.send_record_at) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="response_record_at">
            <template #default="scope">
                <span>{{ dateFormatDetail(scope.row.response_record_at) }}</span>
            </template>
        </el-table-column>
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
  name: "CheckBookingLog",
  components: {
  },
  data() {
    return {
      form: {
        tracking: "",
      },
      data: [],
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
        this.result == "";
        if (this.form.tracking == "") {
            this.$alert("กรุณาใส่ tracking ให้ถูกต้อง", "", { confirmButtonText: "OK" });
            this.form.tracking = "";
            this.result = "";
        } else {
            axios
                .get(this.url + "/log-booking-dhl?tracking=" + this.form.tracking.trim())
                .then(response => {
                    if (response.data.length !== 0) {
                        this.data = response.data;
                    } else {
                        this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
                        this.data = [];
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    dateFormat(strDate: Date) {
        return moment(strDate).format("LL HH:mm");
    },
    dateFormatDetail(strDate: Date) {
        return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  computed: {
  }
});
</script>

<style>
</style>