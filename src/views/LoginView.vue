<template>
  <div>
    <div class="main">
      <el-row class="d-flex">
        <el-col :span="8" class="mx-auto">
          <div class="box__container">
            <div class="grid-content box__intro">
              <div class="box__intro__introduce">
                <img src="../assets/images/logoheader.png" alt="">
                <!-- <h2>Share giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.</h2> -->
              </div>
              <div class="form-auth">
                <div class="form-group mb-2">
                  <label for="exampleInputEmail1">Email <span class="text-danger">*</span></label>
                  <!-- <input v-model="login.email" type="email" class="form-control" placeholder="Nhập Email đăng nhập"> -->
                  <el-input placeholder="Nhập Email đăng nhập" v-model="login.email" clearable type="email"></el-input>
                  <i id="emailHelp" class="d-block form-text text-danger" v-if="errorLogin.email">{{errorLogin.email}}</i>
                </div>
                <div class="form-group mb-4">
                  <label for="exampleInputPassword1">Mật khẩu <span class="text-danger">*</span></label>
                  <!-- <input v-model="login.password" type="password" class="form-control" placeholder="Nhập mật khẩu của bạn"> -->
                  <el-input  placeholder="Nhập mật khẩu của bạn" v-model="login.password" show-password></el-input>
                  <i id="emailHelp" class="d-block form-text text-danger" v-if="errorLogin.password">{{errorLogin.password}}</i>
                </div>
                <div class="form-group mb-3">
                  <button class="btn btn-success" @click="handleLoginBasic()">Đăng nhập</button>
                </div>
                <div class="more--option--base">
                  <router-link to="">
                    <p @click="openDialogRegister()">Đăng ký tài khoản</p>
                  </router-link>
                </div>
                <div class="more--option--base">
                  <router-link to="">
                    <p @click="openDialogForgot()">Quên mật khẩu?</p>
                  </router-link>
                </div>
              </div>
              <el-button type="primary" class="btn__login" @click="handleLoginFacebook()">Đăng nhập bằng Facebook</el-button>
              <el-button type="danger" class="btn__login" @click="handleLoginGoogle()">Đăng nhập bằng Google</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- đăng ký dialog -->
    <el-dialog width="30%" title="Đăng ký tài khoản" :visible.sync="registerDialog">
      <div class="form-group mb-2">
        <label for="exampleInputEmail1">Tên <span class="text-danger">*</span></label>
        <input v-model="register.name" type="text" class="form-control" placeholder="Nhập tên của bạn">
        <i id="emailHelp" class="d-block form-text text-danger" v-if="errorRegister.name">{{errorRegister.name}}</i>
      </div>
      <div class="form-group mb-2">
        <label for="exampleInputEmail1">Email <span class="text-danger">*</span></label>
        <input v-model="register.email" type="email" class="form-control" placeholder="Nhập Email đăng nhập">
        <i id="emailHelp" class="d-block form-text text-danger" v-if="errorRegister.email">{{errorRegister.email}}</i>
      </div>
      <button class="btn btn-secondary" @click="registerDialog = false">Huỷ</button>
      <button class="btn btn-primary btn__register" @click="handleRegister()">Đăng ký</button>
    </el-dialog>
    <!-- Forgot Dialog -->
    <el-dialog width="30%" title="Quên mật khẩu" :visible.sync="forgotDialog">
      <div class="form-group mb-2">
        <label for="exampleInputEmail1">Email <span class="text-danger">*</span></label>
        <input v-model="forgot.email" type="email" class="form-control" placeholder="Nhập Email của bạn">
        <i id="emailHelp" class="d-block form-text text-danger" v-if="errorForgot.email">{{errorForgot.email}}</i>
      </div>
      <button class="btn btn-secondary" @click="forgotDialog = false">Huỷ</button>
      <button class="btn btn-primary btn__register" @click="handleForgot()">Tiếp tục</button>
    </el-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { isValidEmail } from "@/utils/helpers";
import {CHECK_CHANGE_PASS} from '@/utils/constants'
import _ from 'lodash'
import api from "../api";
export default {
  name: 'LoginView',
  data() {
    return {
      CHECK_CHANGE_PASS,
      registerDialog: false,
      forgotDialog:false,
      urlLoginFaceBook: '',
      login: {
        email: '',
        password: ''
      },
      errorLogin: {
        email: '',
        password: ''
      },
      register: {
        name: '',
        email: '',
      },
      errorRegister: {
        name: '',
        email: '',
      },
      forgot:{
        email:''
      },
      errorForgot: {
        email: '',
      },
      serverUrl : process.env.VUE_APP_SERVER_URL
    }
  },
  computed: {
    ...mapState("auth", ["authUser","isAuthenticated"]),
  },
  methods: {
    ...mapMutations("auth", ["updateLoginStatus", "updateAccessToken", "updateAuthUser"]),
    handleLoginBasic() {
      if (this.isValidLogin()) {
        let data = {
          email: this.login.email,
          password: this.login.password,
        }
        api.login(data)
            .then((response) => {
              if (response) {
                this.updateAccessToken(_.get(response, "data.access_token"));
                this.updateLoginStatus(true);
                this.getAuthUser();
              }
            }).catch((error) => {
          let errors =  _.get(error, 'response.data', {})
          if (Object.keys(errors).length > 0) {
            if(errors['message']['error_active']){
              this.$message({
                message: "Tài khoản của bạn chưa kích hoạt",
                type: "error",
              });
            } else{
              this.$message({
                message: "Thông tin tài khoản hoặc mật khẩu không chính xác",
                type: "error",
              });
            }
          }
        });
      }
    },
    isValidLogin() {
      let error = false;
      this.errorLogin.email = "";
      this.errorLogin.password = "";

      if (!isValidEmail(this.login.email)) {
        error = true;
        this.errorLogin.email = "Email sai định dạng, vui lòng nhập lại";
      }
      if (this.login.email.length === 0) {
        error = true;
        this.errorLogin.email = "Email không được để trống";
      }
      if (this.login.password.length === 0) {
        error = true;
        this.errorLogin.password = "Mật khấu không được để trống";
      }
      return !error;
    },
    isValidData() {
      let error = false;
      this.errorRegister.email = "";
      this.errorRegister.name = "";

      if (!isValidEmail(this.register.email)) {
        error = true;
        this.errorRegister.email = "Email sai định dạng, vui lòng nhập lại";
      }
      if (this.register.email.length === 0) {
        error = true;
        this.errorRegister.email = "Email không được để trống";
      }
      if (this.register.name.length === 0) {
        error = true;
        this.errorRegister.name = "Tên không được để trống";
      }
      return !error;
    },
    isValidForgot() {
      let error = false;
      this.errorRegister.email = "";

      if (!isValidEmail(this.forgot.email)) {
        error = true;
        this.errorForgot.email = "Email sai định dạng, vui lòng nhập lại";
      }
      if (this.forgot.email.length === 0) {
        error = true;
        this.errorForgot.email = "Email không được để trống";
      }
      return !error;
    },
    
    handleRegister() {
      if (this.isValidData()) {
        let data = {
          email: this.register.email,
          name: this.register.name,
        }
        api.register(data). then(() => {
          this.$message({
            message: 'Đã đăng ký! vui lòng vào email để xác thực tài khoản!',
            type: 'success'
          });
          this.resetForm()
          this.resetError()
          this.registerDialog = false
        }).catch(error => {
          let errors = _.get(error, 'response.data.errors', {})
          if (Object.keys(errors).length > 0) {
            this.errorRegister.name = _.get(errors, 'name[0]', "");
            this.errorRegister.email = _.get(errors, 'email[0]', "");
          }
        });
      }
    },
    handleForgot() {
      if (this.isValidForgot()) {
        let data = {
          email: this.forgot.email,
        }
        api.forgot(data). then(() => {
          this.$message({
            message: 'vui lòng vào email để xác thực tài khoản!',
            type: 'success'
          });
          this.resetForm()
          this.resetError()
          this.forgotDialogDialog = false
        })
        .catch(error => {
          let errors = _.get(error, 'response.data.errors', {})
          if (Object.keys(errors).length > 0) {
            this.errorForgot.email = _.get(errors, 'email[0]', "");
          }
        });
      }
    },

    handleLoginFacebook()
    {
      window.location.href = this.serverUrl +'auth/facebook/redirect'
    },
    handleLoginGoogle()
    {
      window.location.href = this.serverUrl +'auth/google/redirect'
    },
    handleFacebookCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('token')) {
        const token = urlParams.get('token');
        this.updateAccessToken(token);
        this.updateLoginStatus(true);
        this.getAuthUser();
      }
    },
    async getAuthUser()
    {
      await api.getAuthUser().then(async ( response) => {
       await this.updateAuthUser(_.get(response, 'data'))
        await this.$router.push({name: 'Home'})
        })
    },
    openDialogRegister() {
      this.registerDialog = true
    },
    openDialogForgot() {
      this.forgotDialog = true
    },
     resetForm() {
      this.login.email = '';
      this.login.password = '';
      this.register.name = '';
      this.register.email = '';
      this.forgot.email = '';
     },
    resetError() {
      this.errorRegister.name = '';
      this.errorRegister.email = '';
      this.errorLogin.email = '';
      this.errorLogin.password = '';
      this.errorForgot.email = '';
    }
  },
  created() {
    this.handleFacebookCallback();
  },
  watch: {
    'login.email': {
      handler: function() {
        this.errorLogin.email = ''
      },
    },
    'login.password': {
      handler: function() {
        this.errorLogin.password = ''
      },
    },
    'register.name': {
      handler: function() {
        this.errorRegister.name = ''
      },
    },
    'register.email': {
      handler: function() {
        this.errorRegister.email = ''
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.text-danger {
  color: #ff0000 !important;
}
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.main {
  .el-row {
    height: 100vh;
    align-items: center;
  }
}
.box__container {
  align-items: center;
  background-color: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1);
  box-sizing: border-box;
  margin: 40px 0 0;
  padding: 20px 30px 28px
}
.box__intro {
  width: 100%;
  .form-auth {
    width: 95%;
    padding: 20px 20px 0 20px;
    margin: auto;
    text-align: left;
    button {
      width: 100%;
    }
    .more--option--base {
      width: 100%;
      display: inline-block;
      a {
        display: inline-block;
      }
      .forgot--password {
        float: right !important;
      }
    }
  }
  .box__intro__introduce {
    margin-bottom: 10px;
    width: 100%;
    img {
      width: 100px;
    }
  }
  h2 {
    font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;
    text-align: center;
    font-size: 27px;
    font-weight: normal;
    line-height: 32px;
  }
}
.box__form {
  align-items: center;
  background-color: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 20px 12px rgba(0, 0, 0, 0.1), 0 23px 60px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 40px auto 0;
  padding: 20px 0 28px;
  width: 396px;
}
.btn__login {
  margin: 0 25px !important;
  width: 230px;
  text-align: center;
}
.btn__register {
  float: right;
}

</style>