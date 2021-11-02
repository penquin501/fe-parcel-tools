<template>
  <div>
    <h1>รายการข้อมูล Size</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form">
      <el-form-item>
        <el-button icon="el-icon-plus" @click.prevent="openAddDataBlock()">เพิ่มข้อมูล</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-connection" @click.prevent="syncSize()" v-loading.fullscreen.lock="fullscreenLoading">Sync Size</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getSize">Refresh</el-button>
      </el-form-item>
    </el-form>
    <div v-show="openBlock">
        <el-card style="width: 100%">
            <el-descriptions title="ข้อมูล Size" :column="2">
                <el-descriptions-item label="ขนาด">
                    <el-input v-model="formSize.alias_size"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="พื้นที่">
                    <el-radio-group v-model="formSize.location_zone">
                        <el-radio label="BKK"></el-radio>
                        <el-radio label="UPC"></el-radio>
                    </el-radio-group>
                </el-descriptions-item>
                <el-descriptions-item label="zone">
                    <el-input @keypress="onlyNumber(ele, $event)" v-model="formSize.zone"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="ราคาขาย">
                    <el-input @keypress="onlyNumber(ele, $event)" v-model="formSize.parcel_price"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="ราคาทุน">
                    <el-input @keypress="onlyNumber(ele, $event)" v-model="formSize.parcel_cost"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="sold to account id">
                    <el-input v-model="formSize.sold_to_account_id"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="pickup account id">
                    <el-input v-model="formSize.pickup_account_id"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="customer account id">
                    <el-input v-model="formSize.customer_account_id"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="global product id (NORMAL)">
                    <el-input v-model="formSize.global_product_id_normal"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="global product id (COD)">
                    <el-input v-model="formSize.global_product_id_cod"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="">
                    <el-button @click.prevent="saveData()">บันทึก</el-button>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>
    <el-form :inline="true">
        <el-form-item label="เลือก Zone">
            <el-radio-group v-model="selectedZone" @change="selectZone()">
              <el-radio v-for="item in listZone" :label="item.zone" :key="item.id">{{ item.zone }}</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
    <el-table :data="dataSize" style="width: 100%" height="500">
        <el-table-column prop="size_name" label="ชื่อ size"></el-table-column>
        <el-table-column prop="alias_size" label="ชื่อย่อ"></el-table-column>
        <el-table-column prop="location_zone" label="พื้นที่"></el-table-column>
        <el-table-column prop="zone" label="Zone"></el-table-column>
        <el-table-column fixed="right" label="Detail" width="80" align="center">
        <template #default="scope">
          <el-button @click.prevent="setStore(scope.row)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import axios from "axios";
export default {
  data() {
    return {
      dataSize: [],
      listZone: [],
      selectedZone: 0,
      sizeId: 0,
      openBlock: false,
      formSize: {
          alias_size: "",
          location_zone: "",
          zone: "",
          parcel_price: "",
          parcel_cost: "",
          sold_to_account_id: "",
          pickup_account_id: "",
          customer_account_id: "",
          global_product_id_normal: "",
          global_product_id_cod: ""
      },
      fullscreenLoading: false,
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
      this.getSize();
    }
  },
  methods: {
    getSize(this: any) {
      axios
        .get(this.url + "/size/size-info")
        .then(response => {
            if (response.data) {
            var dataSize = response.data.data;

            this.listZone = [];
            var zoneInfo: { [key: string]: any } = {};
            for (let item of dataSize) {
              if (!(item.zone in zoneInfo)) {
                zoneInfo[String(item.zone)] = [];
              }
              zoneInfo[String(item.zone)].push({ zone: item.zone });
            }
            for (const [key] of Object.entries(zoneInfo)) {
              this.listZone.push({ zone: key });
            }

            if (this.selectedZone == 0) {
              this.dataSize = dataSize;
            } else {
              let listSizeZone = [];
              for (let item of dataSize) {
                if (item.zone == this.selectedZone) {
                  listSizeZone.push(item);
                }
              }
              this.dataSize = listSizeZone;
            }
          } else {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.dataSize = [];
            this.listZone = [];
          }
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    saveData(this: any) {
      if (this.formSize.alias_size == "") {
        this.$alert("กรุณาใส่ขนาดให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.location_zone == "") {
        this.$alert("กรุณาระบุพื้นที่ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.parcel_price == "" && parseInt(this.formSize.parcel_price) == 0) {
        this.$alert("กรุณาระบุราคาขายให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.parcel_cost == "" && parseInt(this.formSize.parcel_cost) == 0) {
        this.$alert("กรุณาระบุราคาทุนให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.sold_to_account_id == "") {
        this.$alert("กรุณาใส่รหัส sold to account id ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.pickup_account_id == "") {
        this.$alert("กรุณาใส่รหัส pickup account id ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.customer_account_id == "") {
        this.$alert("กรุณารหัส customer account idให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.zone == 0) {
        this.$alert("กรุณาระบุ zone ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.global_product_id_normal == "") {
        this.$alert("กรุณาใส่ global product id สำหรับ Normal ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formSize.global_product_id_cod == "") {
        this.$alert("กรุณาใส่ global product id สำหรับ COD ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        this.formSize.data_size_id = 0;
        this.formSize.parcel_price = parseInt(this.formSize.parcel_price);
        this.formSize.parcel_cost = parseInt(this.formSize.parcel_cost);
        
        axios
            .post(this.url + "/size/add-size", this.formSize)
            .then(response => {
              if (response.data.status == "success") {
                this.$alert("เพิ่มข้อมูล Size เรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.getSize();
                this.openBlock = false;
              } else {
                this.$alert("ไม่สามารถเพิ่มข้อมูล Size ได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
      }
    },
    syncSize(this: any) {
      this.fullscreenLoading = true;
      axios
        .get(this.url + "/size/sync-global-size")
        .then(response => {
          if (response.data.status !== undefined) {
            if(response.data.status == "SUCCESS" ) {
              this.getSize();
              this.fullscreenLoading = false;
            } else {
              this.$alert("ไม่สามารถ sync size ได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
            }
          } else {
            this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.getSize();
            this.fullscreenLoading = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectZone(this: any) {
      this.getSize();
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
    setStore(row: any) {
      //@ts-ignore
      this.$store.commit("editSizeInfo", row);
      //@ts-ignore
      this.$router.push({ name: "EditSize" });
    },
  },
  computed: {
  }
};
</script>

<style>
</style>