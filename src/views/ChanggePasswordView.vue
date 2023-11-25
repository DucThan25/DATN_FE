<template>
  <div>
    <div class="main">
      <el-row class="d-flex">
        <el-col :span="8" class="mx-auto">
          <div class="box__container">
            <div class="grid-content box__intro">
              <div class="box__intro__introduce">
                <img src="../assets/images/logoheader.png" alt="">
                <h2>Share giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.</h2>
              </div>
              <div class="form-auth">
                <h3>Thay đổi mật khẩu - Lần đầu đăng nhập</h3>
                <div class="form-group mb-2">
                  <label for="exampleInputEmail1">Mật khẩu hiện tại <span class="text-danger">*</span></label>
                  <input v-model="changePassword.current_password" type="password" class="form-control" placeholder="Nhập mật khẩu hiện tại">
                  <i id="emailHelp" class="d-block form-text text-danger" v-if="errorChangePassword.current_password">{{errorChangePassword.current_password}}</i>
                </div>
                <div class="form-group mb-2">
                  <label for="exampleInputEmail1">Mật khẩu mới <span class="text-danger">*</span></label>
                  <input v-model="changePassword.password" type="password" class="form-control" placeholder="Nhập mật khẩu mới">
                  <i id="emailHelp" class="d-block form-text text-danger" v-if="errorChangePassword.password">{{errorChangePassword.password}}</i>
                </div>
                <div class="form-group mb-4">
                  <label for="exampleInputPassword1">Xác nhận mật khẩu <span class="text-danger">*</span></label>
                  <input v-model="changePassword.passwordConfirm" type="password" class="form-control" placeholder="Xác nhận mật khẩu">
                  <i id="emailHelp" class="d-block form-text text-danger" v-if="errorChangePassword.passwordConfirm">{{errorChangePassword.passwordConfirm}}</i>
                </div>
                <div class="form-group mb-3">
                  <button class="btn btn-success" @click="handleChangePassword()">Đổi mật khẩu</button>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import api from "@/api"
export default {
  name: 'ChangePasswordView',
  data() {
    return {
      registerDialog: false,
      urlLoginFaceBook: '',
      changePassword: {
        password: '',
        passwordConfirm: '',
        current_password: ''
      },
      errorChangePassword: {
        password: '',
        passwordConfirm: '',
        current_password: ''
      },
      serverUrl : process.env.VUE_APP_SERVER_URL
    }
  },

  computed: {
    ...mapState("auth", ["authUser","isAuthenticated"]),
  },
  methods: {
    ...mapMutations("auth", ["updateLoginStatus", "updateAccessToken", "updateAuthUser"]),
    handleChangePassword() {
      if(this.isValidData()) {
        let formData = new FormData
        formData.append('password', this.changePassword.password)
        formData.append('re_password', this.changePassword.passwordConfirm)
        formData.append('current_password', this.changePassword.current_password)
        api.changePassword(formData).then(()=>{
          this.logout()
          this.$message({
            type: 'success',
            message: "Đổi mật khẩu thành công, vui lòng đăng nhập lại"
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "Có lỗi xảy ra, vui lòng thử lại"
          })
        })
      }
    },

    logout()
    {
        api.logout().then(()=> {
          this.updateAccessToken('');
          this.updateLoginStatus(false);
          this.updateAuthUser({})
          this.$router.push({ name: "Login" });
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "Đã xảy ra lỗi, thử lại sau"
          })
        })
    },

    isValidData() {
      let error = false;
      this.errorChangePassword.password = "";
      this.errorChangePassword.passwordConfirm = "";
      this.errorChangePassword.current_password = '';
      if (this.changePassword.password.length === 0) {
        error = true;
        this.errorChangePassword.password = "Mật khẩu không được để trống";
      }
      if (this.changePassword.password.length < 6) {
        error = true;
        this.errorChangePassword.password = "Mật khẩu dài hơn 6 ký tự";
      }
      if (this.changePassword.password !== this.changePassword.passwordConfirm) {
        error = true;
        this.errorChangePassword.passwordConfirm = "Mật khẩu xác nhận phải giống mật khẩu";
      }
      if (this.changePassword.current_password.length === 0) {
        error = true;
        this.errorChangePassword.current_password = "Mật khẩu hiện tại không được để trống";
      }
      if (this.changePassword.passwordConfirm.length === 0) {
        error = true;
        this.errorChangePassword.passwordConfirm = "Mật khẩu xác nhận không được để trống";
      }
      return !error;
    },
    resetForm() {
      this.changePassword.password = '';
      this.changePassword.passwordConfirm = '';
      this.changePassword.current_password = ''
    },
    resetError() {
      this.errorChangePassword.password = '';
      this.errorChangePassword.passwordConfirm = '';
      this.errorChangePassword.current_password = '';
    }
  },
  watch: {
    'changePassword.password': {
      handler: function() {
        this.errorChangePassword.password = ''
      },
    },
    'changePassword.current_password': {
      handler: function() {
        this.errorChangePassword.current_password = ''
      },
    },
    'changePassword.passwordConfirm': {
      handler: function() {
        this.errorChangePassword.passwordConfirm = ''
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