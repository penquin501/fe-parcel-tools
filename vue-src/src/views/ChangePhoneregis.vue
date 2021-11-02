<template>
  <div>
    <h1>เปลี่ยนเบอร์โทรศัพท์ Member</h1>
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
          <el-descriptions-item label="เบอร์โทรศัพท์">{{ changeDoubleSix2Zero(memberInfo.phoneregis) }}</el-descriptions-item>
          <el-descriptions-item label="สถานะ">
              <el-radio-group v-model="selectedStatus" disabled>
                <el-radio label="active"></el-radio>
                <el-radio label="inactive"></el-radio>
              </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 20px;"></div>
        <el-form :inline="true" class="demo-form-inline" ref="formCheck" :model="formCheck">
          <el-form-item label="กรุณาใส่เบอร์โทรศัพท์:">
            <el-input @keypress="onlyNumber(ele, $event)" v-model="formCheck.phoneregis" maxlength="10" clearable>
                {{ changeZero2DoubleSix(formCheck.phoneregis) }}
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.prevent="checkMemberData">ตรวจสอบเบอร์โทรศัพท์</el-button>
          </el-form-item>
          <el-form-item>
            <span>
                <p style="font-size:16px; color: green;" v-if="availablePhone==true">{{ reasonDisplay }}</p>
                <p style="font-size:16px; color: red;" v-else>{{ reasonDisplay }}</p>
            </span>
          </el-form-item>
        </el-form>
        <el-form>
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
        formCheck: {
            phoneregis: ""
        },
        memberInfo: {},
        availablePhone: false,
        reasonDisplay: "",
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
    }
  },
  methods: {
    getData(this: any) {
      if (this.form.memberId == "") {
        this.$alert("กรุณาใส่เลขสมาชิกให้ถูกต้อง", "", { confirmButtonText: "OK" });
        this.memberInfo = {};
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
              } else {
                this.$alert("ไม่พบข้อมูล สมาชิกนี้ในระบบ", "", { confirmButtonText: "OK" });
                this.form.memberId = "";
                this.memberInfo = {};
              }
            } else {
              this.$alert("ไม่พบข้อมูล เนื่องจาก..." + response.data.reason, "", { confirmButtonText: "OK" });
              this.form.memberId = "";
              this.memberInfo = {};
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    checkMemberData(this: any) {
      this.reasonDisplay = "";
      if (!this.memberInfo.member_id) {
        this.$alert("กรุณาใส่รหัสสมาชิกให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formCheck.phoneregis.length !== 10) {
        this.$alert("กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (
        this.formCheck.phoneregis[0] + this.formCheck.phoneregis[1] !== "06" &&
        this.formCheck.phoneregis[0] + this.formCheck.phoneregis[1] !== "08" &&
        this.formCheck.phoneregis[0] + this.formCheck.phoneregis[1] !== "09"
      ) {
        this.$alert("กรุณาใส่เบอร์โทรศัพท์มือถือเท่านั้น", "", { confirmButtonText: "OK" });
      } else if (this.memberInfo.phoneregis == this.formCheck.phoneregis) {
        this.$alert("กรุณาใส่เบอร์โทรศัพท์ใหม่ เนื่องจากเป็นเบอร์ที่ลงทะเบียนปัจจุบัน", "", { confirmButtonText: "OK" });
      } else {
        axios.get(this.url945 + "/parcel/check-member/phoneregis?phoneregis=" + this.changeZero2DoubleSix(this.formCheck.phoneregis))
          .then(response => {
            if (response.data.status == "EXISTED_MEMBER") {
              this.availablePhone = false;
              this.reasonDisplay = "กรุณาใส่เบอร์โทรศัพท์ใหม่ เนื่องจากเบอร์นี้ได้ลงทะเบียนไว้แล้ว";
            } else if (response.data.status == "SUCCESS") {
              this.availablePhone = true;
              this.reasonDisplay = "สามารถใช้เบอร์โทรศัพท์นี้ได้";
            } else {
              this.$alert("ไม่พบข้อมูล เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    confirmData(this: any) {
      if (!this.memberInfo.member_id) {
        this.memberInfo == "";
        this.$alert("กรุณาใส่รหัสสมาชิกให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formCheck.phoneregis.length !== 10) {
        this.$alert("กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (
        this.formCheck.phoneregis[0] + this.formCheck.phoneregis[1] !== "06" &&
        this.formCheck.phoneregis[0] + this.formCheck.phoneregis[1] !== "08" &&
        this.formCheck.phoneregis[0] + this.formCheck.phoneregis[1] !== "09"
      ) {
        this.$alert("กรุณาใส่เบอร์โทรศัพท์มือถือเท่านั้น", "", { confirmButtonText: "OK" });
      } else if (this.memberInfo.phoneregis == this.formCheck.phoneregis) {
        this.$alert("กรุณาใส่เบอร์โทรศัพท์ใหม่ เนื่องจากเป็นเบอร์ที่ลงทะเบียนปัจจุบัน", "", { confirmButtonText: "OK" });
      } else if (this.availablePhone == false) {
        this.$alert("กรุณาใส่เบอร์โทรศัพท์ใหม่ เนื่องจากเบอร์นี้ได้ลงทะเบียนแล้ว", "", { confirmButtonText: "OK" });
      } else {
        var moduleName = "change_phone_regis";
        var dataConfirm = {
          previousValue: this.memberInfo,
          currentValue: {
            memberId: this.memberInfo.member_id,
            phoneRegis: this.changeZero2DoubleSix(this.formCheck.phoneregis)
          },
          user: this.$store.state.userInfo.name,
          moduleName: moduleName
        };
        axios
          .post(this.url + "/tools/change-phoneregis", dataConfirm)
          .then(response => {
            if (response.data.status == "SUCCESS") {
                this.$alert("เปลี่ยนเบอร์โทรศัพท์สมาชิกเรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.form.memberId = "";
                this.memberInfo = {};
                this.formCheck.phoneregis = "";
                this.availablePhone = false;
                this.reasonDisplay = "";
                this.$router.push({ name: "Home" });
            } else {
                this.$alert("เปลี่ยนเบอร์โทรศัพท์สมาชิกได้ เนื่องจาก..." + response.data.reason, "", { confirmButtonText: "OK" });
                this.form.memberId = "";
                this.memberInfo = {};
                this.formCheck.phoneregis = "";
                this.availablePhone = false;
                this.reasonDisplay = "";
                this.$router.push({ name: "Home" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    changeDoubleSix2Zero(phoneInput: string) {
        if(phoneInput !== undefined){
            var phone = "0";
            for (let i = 2; i < phoneInput.length; i++) {
                phone += phoneInput[i];
            }
            return phone;
        }
    },
    changeZero2DoubleSix(phoneInput: string) {
      var phone = "66";
      for (let i = 1; i < phoneInput.length; i++) {
        phone += phoneInput[i];
      }
      return phone;
    },
    onlyNumber(ele: any, event: KeyboardEvent) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        event.preventDefault();
      }
    },
  },
  computed: {}
};
</script>

<style>
</style>