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
    <el-form :inline="true">
        <el-form-item label="เลือก Tools">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check all</el-checkbox>
            <el-checkbox-group v-model="checked" @change="handleCheckedChange">
              <el-checkbox v-for="module in form.type" :label="module" :key="module.id">{{ module }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-form>
    <h1>รายการเครื่องมือที่ใช้: {{ dateFormat(form.selectDate) }}</h1>
    <el-table :data="filteredResources" style="width: 100%" height="500" :default-sort="{prop: 'time_to_system', order: 'ascending'}" >
        <el-table-column type="expand">
            <template #default="props">
                <p><b>รายละเอียดเพิ่มเติม:</b> {{ props.row.remark }}</p>
            </template>
        </el-table-column>
        <el-table-column fixed prop="ref" label="Tracking" width="150"></el-table-column>
        <el-table-column prop="time_to_system" label="เวลา" align="center" width="100">
            <template #default="scope">
                <span>{{ dateFormatDetail(scope.row.time_to_system) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="branch_name" label="สาขา" width="120"></el-table-column>
        <el-table-column prop="billing_no" label="เลขที่บิล" width="250"></el-table-column>
        <el-table-column prop="current_value" label="ค่าปัจจุบัน" width="300"></el-table-column>
        <el-table-column prop="reason" label="เหตุผล" width="250"></el-table-column>
        <el-table-column prop="module_name" label="เครื่องมือที่ใช้" width="250"></el-table-column>
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
        type: []
      },
      checked: [],
      checkAll: true,
      isIndeterminate: false,
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
      this.data = [];
      axios
        .get(this.url + "/log-daily-tool?date_check=" + this.form.selectDate)
        .then(response => {
          if (response.data.length === 0) {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.data = [];
          } else {
            var result = response.data;
            this.form.type = [];
            var moduleInfo: { [key: string]: any } = {};
            for (let item of result) {
              if (!(item.module_name in moduleInfo)) {
                moduleInfo[String(item.module_name)] = [];
              }
              moduleInfo[String(item.module_name)].push(item);
            }
            for (const [key] of Object.entries(moduleInfo)) {
              this.form.type.push(key);
            }
            this.checked = this.checkAll ? this.form.type : this.checked;

            if(this.checked.length == 0) {
              this.data = [];
            } else {
              for (let item of result) {
                for (let selectModule of this.checked) {
                  if (item.module_name == selectModule) {
                    this.data.push(item);
                  }
                }
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
        return moment(strDate).format("HH:mm:ss");
    },
    handleCheckAllChange(val: any) {
      this.checked = val ? this.form.type : [];
      this.isIndeterminate = false;
      this.getData();
    },
    handleCheckedChange(value: any) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.form.type.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.form.type.length;
      this.getData();
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