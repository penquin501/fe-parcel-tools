<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form">
      <el-form-item>
        <h1>รายการ QL Checker</h1>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getlistTracking">Refresh</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listTracking" stripe style="width: 100%">
      <el-table-column label="Tracking" align="center">
        <template #default="scope">
          <span @click.prevent="setStore(scope.row)">
            <el-button @click.prevent="setStore(scope.row)" type="text">{{ scope.row.branch_name }}({{ scope.row.total }})</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";

export default defineComponent({
  name: "ListPending",
  components: {
  },
  data() {
    return {
      listTracking: [],
      url: "https://tool.945parcel.com",
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    } else {
        this.getlistTracking();
    }
  },
  methods: {
    getlistTracking(this: any) {
        axios
        .get(this.url + "/tools/list-pending-tracking")
        .then(response => {
            if (response.data.status == "SUCCESS") {
            this.listTracking = response.data.listTracking;
          } else {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.listTracking = [];
          }
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    setStore(row: any) {
      //@ts-ignore
      this.$store.commit("qlchecker", row);
      this.$router.push({ name: "ConfirmQLChecker" });
    }
  },
  computed: {
  }
});
</script>

<style>
</style>