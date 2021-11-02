<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="เลือกวันที่">
        <el-date-picker type="date" placeholder="Pick a date" @change="getData()" v-model="form.selectDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="ค้นหารหัสสมาชิก">
        <el-input v-model="form.memberId" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getData">Refresh</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
        <el-form-item label="เลือกสาขา">
          <el-select ref="branch" v-model="selectedBranch" placeholder="สาขา" @change="selectBranch()">
            <el-option v-for="item in dataBranch" :key="item.branch_id" :label="item.branch_name" :value="item.branch_id"></el-option>
          </el-select>
        </el-form-item>
    </el-form>
    <h1>รายการแต่ละสาขา: {{ dateFormat(form.selectDate) }}</h1>
    <el-table :data="filteredResources" style="width: 100%" height="500">
        <el-table-column fixed prop="member_id" label="รหัสสมาชิก"></el-table-column>
        <el-table-column label="ชื่อ-นามสกุล" width="300">
          <template #default="scope">
            <span>{{ scope.row.firstname }} {{ scope.row.lastname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="เบอร์โทรศัพท์" width="100"></el-table-column>
        <el-table-column prop="totalCapture" label="จำนวนทั้งหมด" align="right"></el-table-column>
        <el-table-column prop="countCapture" label="จำนวน Capture" align="right"></el-table-column>
        <el-table-column prop="countAutolabel" label="จำนวน Auto Labeling" align="right"></el-table-column>
        <el-table-column prop="countQl" label="จำนวน QuickLink" align="right"></el-table-column>
        <el-table-column prop="countQQ" label="จำนวน QuickQuick" align="right"></el-table-column>
        <el-table-column label="เวลา Capture เริ่ม-ล่าสุด" align="center" width="150">
          <template #default="scope">
            <span>{{ dateFormatDetail(scope.row.startCapture) }} - {{ dateFormatDetail(scope.row.lastCapture) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="สถานะ" align="center" width="100">
          <template #default="scope">
            <span style="color: green;" v-if="parseInt(scope.row.countQl) + parseInt(scope.row.countQQ) == parseInt(scope.row.totalCapture)">
              <i class="fa fa-circle" aria-hidden="true"></i>
            </span>
            <span style="color: red;" v-else><i class="fa fa-circle" aria-hidden="true"></i></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Detail" width="80" align="center">
          <template #default="scope">
            <el-button @click.prevent="setStore(scope.row)"><i class="fa fa-bars" aria-hidden="true"></i></el-button>
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
  name: "ReportCaptureMonitor",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      data: [],
      dataBranch: [],
      filtered: [],
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        memberId: "",
        selectDate: moment().format("YYYY-MM-DD")
      },
      selectedBranch: null,
      branchInfo: {
        id: 5,
        branch_id: 47,
        prefix_branch: "PC",
        branch_name: "kl2",
        status: "active"
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
      this.getBranch();
      this.getData();
    }
  },
  methods: {
    getData(this: any) {
      axios
        .get(this.url + "/list-capture-monitor?date_check=" + moment(this.form.selectDate).format("YYYY-MM-DD") + "&branch_id=" + this.branchInfo.branch_id)
        .then(response => {
          if (response.data.status !== "SUCCESS") {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.data = [];
          } else {
            if (response.data.data.length === 0) {
              // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
              this.data = [];
            } else {
              this.data = response.data.data;
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
        return moment(strDate).format("HH:mm:ss");
    },
    getBranch(this: any) {
      axios
        .get(this.url + "/branch/branch-info")
        .then(response => {
          if (response.data) {
            this.dataBranch = response.data.data;
          } else {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.dataBranch = [];
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setStore(row: any) {
      let data = {
        memberId: row.member_id,
        phoneNumber: row.phoneNumber,
        memberName: row.firstname + " " + row.lastname,
        dateSelect: moment(this.form.selectDate).format("YYYY-MM-DD")
      };
      //@ts-ignore
      this.$store.commit("reportCaptureMonitor", data);
      this.$router.push({ name: "ListCaptureInfo" });
    },
    selectBranch(this: any, item: any) {
      let object = this.dataBranch.find((d: any) => d.branch_id == this.selectedBranch);
      this.branchInfo = object;
      this.getData();
    },
    setPage(this:any, val: any) {
      this.page = val;
    },
  },
  computed: {
      filteredResources(this: any) {
      if(this.form.memberId == null) return this.data;      
        this.filtered = this.data.filter((item: any) => !this.form.memberId || (item.member_id).toLowerCase().includes(this.form.memberId.toLowerCase()));
        this.total = this.filtered.length;
        return this.filtered.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    }
  }
});
</script>

<style>
</style>