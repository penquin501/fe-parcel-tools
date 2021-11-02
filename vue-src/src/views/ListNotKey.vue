<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="ค้นหา Tracking">
        <el-input @keypress="engOnly($event)" v-model="form.tracking" maxlength="13" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getlistTracking">Refresh</el-button>
      </el-form-item>
    </el-form>
    <p>เบอร์โทรศัพท์ผู้ส่ง: {{ $store.state.phoneNumber }}</p>
    <el-table :data="filteredResources" style="width: 100%">
      <el-table-column prop="tracking" label="Tracking"></el-table-column>
      <el-table-column fixed="right" label="Operations" width="200" style="text-align: center;">
        <template #default="scope">
            <el-button @click.prevent="getTracking(scope.$index, scope.row)">
                <i class="fa fa-keyboard-o" aria-hidden="true"></i>
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
import { defineComponent } from 'vue';

import axios from 'axios';

export default defineComponent({
  name: 'ListNotKey',
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
      sorting: -1,
      form: {
        phoneNumber: "",
        tracking: "",
        priority: 0
      }
    }
  },
  mounted: function(this:any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
        //@ts-ignore
        this.$route.push({ path: "/" });
    } else {
        this.getlistTracking();
    }
  },
  methods: {
    getlistTracking() {
      this.data = [];
      //@ts-ignore
      axios.get("https://key.my945capture.com/v2/api/parcel-capture/tasks/tracking/by-phone/" + this.$store.state.phoneNumber + "/" + parseInt(this.$store.state.priority))
      .then(response => {
        if (response.data.status == "ok") {
          this.data = response.data.results;
        } else {
          //@ts-ignore
          // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
          this.data = [];
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    getTracking(index: number, row: any) {
      window.open("https://key.my945capture.com/v2/api/parcel-capture/tasks/manual/pick/" + row.tracking);
    },
    engOnly(event: KeyboardEvent) {
      var englishAlphabetAndWhiteSpace = /[A-Za-z | 0-9]/g;
      // let keyCode = $event.keyCode ? $event.keyCode : $event.which;

      var key = String.fromCharCode(event.which);
      if (event.keyCode == 8 || event.keyCode == 37 || englishAlphabetAndWhiteSpace.test(key)) {
        return true;
      }
      event.preventDefault();
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