<template>
  <div>
    <h1>List DHL Token</h1>
    <el-table :data="data" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="dhl_token" label="dhl_token"></el-table-column>
        <el-table-column label="record_at">
            <template #default="scope">
                <span>{{ dateFormatDetail(scope.row.record_at) }}</span>
                <span style="color: red; font-size: 10px;">{{ dateFromNow(scope.row.record_at) }}</span>
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
  name: "ListDHLToken",
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
    } else {
        this.getData();
    }
  },
  methods: {
    getData(this: any) {
        axios
            .get(this.url + "/list-dhl-token")
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
        
    },
    dateFromNow(strDate: any) {
        return moment(strDate).fromNow();
    },
    dateFormatDetail(strDate: Date) {
        return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    },
    tableRowClassName({row, rowIndex}: any) {
        if (rowIndex === 0) {
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