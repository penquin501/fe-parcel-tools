<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div v-show="!$store.state.is_login">
      <el-container>
        <el-header>
          <div style="text-align: center;">
            <h1 style="padding-top: 10px; padding-bottom: 10px;">Parcel Tools</h1>
          </div>
        </el-header>
        <el-main>
          <el-form :label-position="labelPosition" label-width="100px" :model="loginForm">
            <el-form-item>
              <el-input style="width: 50%;" ref="username" placeholder="Please input username" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input style="width: 50%;" ref="password" placeholder="Please input password" v-model="loginForm.password" show-password></el-input>
            </el-form-item>
            <el-button type="primary" plain @click.prevent="login">Login</el-button>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import axios from "axios";

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      labelPosition: 'top',
      loginForm: {
        username: "",
        password: ""
      },
    };
  },
  mounted: function() {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      this.loginForm.username = "";
      this.loginForm.password = "";
      //@ts-ignore
      this.$refs.username.focus();
    }
  },
  methods: {
    login() {
      if (this.loginForm.password == "") {
        //@ts-ignore
        this.$refs.password.focus();
        return;
      }
      let data = new FormData();
      data.append("username", this.loginForm.username);
      data.append("password", this.loginForm.password);

      axios
        .post("https://945cs.work/login_api", data)
        .then((res: any) => {
          if (res.data.status == false) {
            alert("ไม่มีข้อมูลในระบบ");
            this.loginForm.username = "";
            this.loginForm.password = "";
            //@ts-ignore
            this.$refs.username.focus();
          } else {
            //@ts-ignore
            this.$store.commit("doLogin", res.data);
          }
        })
        .catch((err: any) => {
          console.log(err.response);
        });
    },
    logout() {
      //@ts-ignore
      this.$store.commit("doLogout");
    }
  }
});
</script>
<style scoped>
.home {
  text-align: center;
}
</style>
