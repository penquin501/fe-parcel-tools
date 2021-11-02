<template>
  <div>
    <h1>ย้าย Member ไป Shop อื่น</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="กรุณากรอกรหัสสมาชิก">
        <el-input v-model="form.memberId" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click.prevent="getData">ค้นหา</el-button>
      </el-form-item>
    </el-form>
    <div v-show="memberInfo.member_id !== undefined">
      <el-card class="box-card">
        <el-descriptions title="ข้อมูลสมาชิก">
          <el-descriptions-item label="รหัสสมาชิก">{{ memberInfo.member_id }}</el-descriptions-item>
          <el-descriptions-item label="ชื่อ-นามสกุล">{{ memberInfo.firstname }} {{ memberInfo.lastname }}</el-descriptions-item>
          <el-descriptions-item label="ชื่อย่อ">{{ memberInfo.aliasname }}</el-descriptions-item>
          <el-descriptions-item label="เลขที่บัตรประชาชน">{{ memberInfo.citizenid }}</el-descriptions-item>
          <el-descriptions-item label="สาขา">{{ memberInfo.merchantname }}</el-descriptions-item>
          <el-descriptions-item label="เบอร์โทรศัพท์">{{ memberInfo.phoneregis }}</el-descriptions-item>
          <el-descriptions-item label="สถานะ">
              <el-radio-group v-model="selectedStatus">
                <el-radio label="active"></el-radio>
                <el-radio label="inactive"></el-radio>
              </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 20px;"></div>
        <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
          <el-form-item label="กรุณาเลือกสาขา:">
            <el-select ref="branch" v-model="selectedMerId" placeholder="สาขา" @change="selectBranch()">
              <el-option v-for="item in shopInfo" :key="item.takeorderby" :label="item.merchantname" :value="item.takeorderby"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click.prevent="confirmData">บันทึก</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
export default {
  data() {
    return {
      form: {
        memberId: ""
      },
      memberInfo: {},
      shopInfo:[],
      selectedMerId: null,
      branchInfo: {},
      selectedStatus: "",
      url: "https://tool.945parcel.com",
      url945: "https://api-key-tool.945holding.com"
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    } else {
        this.getShopData();
    }
  },
  methods: {
    getData(this: any) {
      if (this.form.memberId == "") {
        this.$alert("กรุณาใส่เลขสมาชิกให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        axios
          .get(this.url945 + "/check/member-info?memberId=" + this.form.memberId.trim())
          .then(response => {
            if (response.data.status == "SUCCESS") {
              var memberInfo = response.data.memberInfo;
              if (memberInfo.length !== 0) {
                this.memberInfo = response.data.memberInfo[0];
                this.selectedStatus = this.memberInfo.status;
                this.changeDoubleSix2Zero();

                let obj = this.shopInfo.find((d: any) => d.takeorderby == this.memberInfo.merid);
                this.branchInfo = obj;
              } else {
                this.$alert("ไม่พบข้อมูล สมาชิกนี้ในระบบ", "", { confirmButtonText: "OK" });
              }
            } else {
              this.$alert("ไม่พบข้อมูล เนื่องจาก..." + response.data.reason, "", { confirmButtonText: "OK" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    getShopData(this: any) {
      axios
        .get(this.url945 + "/select/parcel-shop-info")
        .then(response => {
          if (response.data.status == "SUCCESS") {
            var shopInfo = response.data.parcelShopInfo;
            if (shopInfo.length !== 0) {
                this.shopInfo = shopInfo;
            } else {
              this.$alert("ไม่พบข้อมูล shop ในระบบ", "", { confirmButtonText: "OK" });
            }
          } else {
            this.$alert("ไม่พบข้อมูล เนื่องจาก..." + response.data.reason, "", { confirmButtonText: "OK" });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectBranch(this: any, item: any) {
        let object = this.shopInfo.find((d: any) => d.takeorderby == this.selectedMerId);
        if(object.takeorderby == this.memberInfo.merid) {
            this.$alert("กรุณาเปลี่ยน shop เนื่องจาก สมาชิกอยู่ที่ shop นี้แล้ว", "", { confirmButtonText: "OK" });
        } else {
            this.branchInfo = object;
        }
    },
    confirmData(this: any) {
      if (!this.memberInfo.member_id) {
        this.memberInfo.member_id = "";
        this.$alert("กรุณาระบุ member Id เพื่อทำรายการ", "", { confirmButtonText: "OK" });
      } else if (this.branchInfo == undefined) {
        this.$alert("กรุณาเลือก shop ที่ต้องการเปลี่ยนให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.memberInfo.merid == this.selectedMerId && this.selectedStatus == "active") {
        this.$alert("กรุณาเปลี่ยน shop เนื่องจาก สมาชิกอยู่ที่ shop นี้แล้ว", "", { confirmButtonText: "OK" });
      } else {
        var moduleName = "move_member";
        var dataConfirm = {
          previousValue: this.memberInfo,
          currentValue: {
            memberId: this.memberInfo.member_id,
            merId: this.branchInfo.takeorderby,
            status: this.selectedStatus
          },
          user: this.$store.state.userInfo.name,
          moduleName: moduleName
        };
        axios
          .post(this.url + "/tools/move-member-info", dataConfirm)
          .then(response => {
            if (response.data.status == "SUCCESS") {
                this.$alert("ย้ายเลขสมาชิก : " + response.data.memberInfo.member_id + " ไปยัง " + response.data.memberInfo.merchantname + " เรียบร้อยแล้ว", "บันทึกข้อมูล", { confirmButtonText: "OK" });
                this.form.memberId = "";
                this.memberInfo = {};
                this.selectedMerId = "";
                this.$router.push({ name: "Home" });
            } else {
                this.$alert("ไม่สามารถย้ายเลขสมาชิกได้ เนื่องจาก..." + response.data.reason, "", { confirmButtonText: "OK" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    changeDoubleSix2Zero(this: any) {
      var phone = this.memberInfo.phoneregis;
      this.memberInfo.phoneregis = "0";
      for (let i = 2; i < phone.length; i++) {
        this.memberInfo.phoneregis += phone[i];
      }
    }
  },
  computed: {}
};
</script>

<style>
</style>