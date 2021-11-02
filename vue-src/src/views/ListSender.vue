<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="ค้นหาเบอร์โทรศัพท์ผู้ส่ง">
        <el-input @keypress="isNumber($event)" v-model="form.phoneNumber" maxlength="10" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getlistPhoneNumber">Refresh</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="filteredResourcesPhone" style="width: 100%" height="500">
      <el-table-column type="expand">
        <template #default="props">
            <el-form :inline="true" class="demo-form-inline" ref="form" :model="setPriorityForm">
                <el-form-item label="กำหนด Priority">
                    <el-input v-model="setPriorityForm.priority" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.prevent="setPriority(props.$index, props.row)">บันทึก</el-button>
                </el-form-item>
            </el-form>
            <!-- <p>phoneNumber: {{ props.row.phoneNumber }}</p> -->
            <p>จำนวน Tracking ที่ค้างในระบบ: {{ setPriorityForm.n }}</p>
            <p>จำนวน Tracking ที่กำหนด Priority ใหม่: {{ setPriorityForm.nModified }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="เบอร์โทรศัพท์ผู้ส่ง"></el-table-column>
      <el-table-column prop="count" label="จำนวนที่ค้าง"></el-table-column>
      <el-table-column prop="priority" label="ค่า Priority"></el-table-column>
      <el-table-column fixed="right" label="Detail" width="200" style="text-align: center;">
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
import axios from "axios";
export default {
  data() {
    return {
      listPhone: [],
      filtered: [],
      page: 1,
      pageSize: 10,
      total: 0,
      setPriorityForm: {
        phoneNumber: "",
        priority: 0,
        n: 0,
        nModified: 0,
      },
      form: {
        phoneNumber: ""
      }
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    } else {
      this.getlistPhoneNumber();
    }
  },
  methods: {
    getlistPhoneNumber(this: any) {
      this.setPriorityForm = {
        phoneNumber: "",
        priority: 0,
        n: 0,
        nModified: 0,
      };
      this.listPhone = [];
      axios
        .get("https://key.my945capture.com/v2/api/parcel-capture/tasks/list/phone/number")
        .then(response => {
          if (response.data.status == "ok") {
            this.listPhone = response.data.result;
          } else {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.listPhone = [];
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setPriority(this: any, index: any, row: any) {
      var data = {
        phoneNumber: row.phoneNumber,
        priority: parseInt(this.setPriorityForm.priority)
      };
      axios
        .post("https://key.my945capture.com/v2/api/parcel-capture/tasks/set-priority", data)
        .then(response => {
          this.setPriorityForm.n = response.data.result.n;
          this.setPriorityForm.nModified = response.data.result.nModified;
          this.getlistPhoneNumber();
        });
    },
    setStore(row: any) {
        //@ts-ignore
        this.$store.commit("phoneNumber", row);
        //@ts-ignore
        this.$router.push({ name: "ListNotKey" });
    },
    handleClick(index: any, row: any) {
      console.log("index", index);
      console.log("row", row);
    },
    isNumber: function(evt: any) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    setPage(this:any, val: any) {
      this.page = val;
    },
  },
  computed: {
    filteredResourcesPhone(this: any) {
      if(this.form.phoneNumber == null) return this.listPhone;      
        this.filtered = this.listPhone.filter((item: any) => !this.form.phoneNumber || (item.phoneNumber).toLowerCase().includes(this.form.phoneNumber.toLowerCase()));
        this.total = this.filtered.length;
        return this.filtered.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    }
  }
};
</script>

<style>
</style>