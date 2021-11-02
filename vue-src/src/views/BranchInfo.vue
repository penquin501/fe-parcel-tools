<template>
  <div>
    <h1>รายการข้อมูลสาขา</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form">
      <el-form-item>
        <el-button icon="el-icon-plus" @click.prevent="openAddDataBlock()">เพิ่มข้อมูล</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getBranch">Refresh</el-button>
      </el-form-item>
    </el-form>
    <div v-show="openBlock">
        <el-card style="width: 100%">
            <el-descriptions title="ข้อมูลสาขา" :column="3">
                <el-descriptions-item label="รหัสสาขา">
                    <el-input @keypress="onlyNumber(ele, $event)" v-model="formBranch.branch_id" maxlength="4"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="ตัวย่อ">
                    <el-input v-model="formBranch.prefix_branch"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="ชื่อสาขา">
                    <el-input v-model="formBranch.branch_name"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="สถานะ">
                    <el-radio-group v-model="formBranch.status">
                        <el-radio label="active"></el-radio>
                        <el-radio label="inactive"></el-radio>
                    </el-radio-group>
                </el-descriptions-item>
                <el-descriptions-item label="">
                    <el-button @click.prevent="saveData()">บันทึก</el-button>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>
    <el-table :data="filteredResources" style="width: 100%" height="500">
        <el-table-column label="Edit" type="expand">
            <template #default="props">
                <el-form :inline="true" class="demo-form-inline" ref="form" :model="editForm">
                    <el-form-item label="รหัสสาขา">
                        <el-input @keypress="onlyNumber(ele, $event)" v-model="props.row.branch_id" maxlength="4" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="ตัวย่อ">
                        <el-input v-model="editForm.prefix_branch" maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="ชื่อสาขา">
                        <el-input v-model="editForm.branch_name" maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="สถานะ">
                        <el-radio-group v-model="editForm.status">
                            <el-radio label="active"></el-radio>
                            <el-radio label="inactive"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.prevent="updateData(props.row)">บันทึก</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column prop="branch_id" label="รหัสสาขา"></el-table-column>
        <el-table-column prop="prefix_branch" label="ตัวย่อ"></el-table-column>
        <el-table-column prop="branch_name" label="ชื่อสาขา"></el-table-column>
        <el-table-column prop="status" label="สถานะ"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import axios from "axios";
export default {
  data() {
    return {
      dataBranch: [],
      openBlock: false,
      formBranch: {
          branch_id: "",
          prefix_branch: "",
          branch_name: "",
          status: "active"
      },
      editForm: {
          prefix_branch: "",
          branch_name: "",
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
    }
  },
  methods: {
    getBranch(this: any) {
      axios
        .get(this.url + "/branch/branch-info")
        .then(response => {
            if (response.data) {
                this.dataBranch = response.data.data;
            } else {
                this.dataBranch = [];
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    saveData(this: any) {
      if (this.formBranch.branch_id == "") {
        this.$alert("กรุณาใส่รหัสสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formBranch.prefix_branch == "") {
        this.$alert("กรุณาใส่ตัวย่อสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formBranch.branch_name == "") {
        this.$alert("กรุณาใส่ชื่อสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formBranch.status !== "active" && this.formBranch.status !== "inactive") {
        this.$alert("กรุณาเลือกสถานะสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        var data = {
          branch_id: parseInt(this.formBranch.branch_id),
          prefix_branch: this.formBranch.prefix_branch.toUpperCase(),
          branch_name: this.formBranch.branch_name,
          branch_status: this.formBranch.status
        };
        
        axios
            .post(this.url + "/branch/add-branch", data)
            .then(response => {
              if (response.data.status == "success") {
                this.$alert("เพิ่มข้อมูลสาขาเรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.getBranch();
                this.openBlock = false;
              } else {
                this.$alert("ไม่สามารถเพิ่มข้อมูลสาขาได้", "", { confirmButtonText: "OK" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
      }
    },
    updateData(this: any, row: any) {
      if (row.branch_id == "") {
        this.$alert("กรุณาใส่รหัสสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.prefix_branch == "") {
        this.$alert("กรุณาใส่ตัวย่อสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.branch_name == "") {
        this.$alert("กรุณาใส่ชื่อสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.status !== "active" && this.editForm.status !== "inactive") {
        this.$alert("กรุณาเลือกสถานะสาขาให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        var data = {
          branch_id: parseInt(row.branch_id),
          prefix_branch: this.editForm.prefix_branch.toUpperCase(),
          branch_name: this.editForm.branch_name,
          branch_status: this.editForm.status
        };

        axios
        .post(this.url + "/branch/edit-branch", data)
        .then(response => {
            if (response.data.status == "success") {
                this.$alert("บันทึกข้อมูลสาขาเรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.editForm.prefix_branch = "";
                this.editForm.branch_name = "";
                this.editForm.status = "active";
                this.getBranch();
            } else {
                this.$alert("ไม่สามารถแก้ไขข้อมูลได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
            }
        })
        .catch(function(error) {
            console.log(error);
        });
      }
    },
    onlyNumber(ele: any, event: KeyboardEvent) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        event.preventDefault();
      }
    },
    openAddDataBlock(this: any) {
        this.openBlock = !this.openBlock;
    },
  },
  computed: {
    filteredResources(this: any) {
        return this.dataBranch.slice(0).sort((a: any, b: any) => a.branch_id < b.branch_id ? this.sorting : -this.sorting);
    }
  }
};
</script>

<style>
</style>