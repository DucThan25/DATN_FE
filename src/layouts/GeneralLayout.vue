<template>
  <div>
    <el-container>
      <!-- navbar -->
      <el-header>
        <el-row>
          <!-- left -->
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div class="box__search">
                <!-- logo -->
                <router-link :to="{name: 'Home'}">
                  <img src="../assets/images/logoheader.png" alt="">
                </router-link>
                <label for="">
                  <div class="autocomplete">
                    <input v-model="userSearch" type="text" placeholder="Nhập tên để tìm kiếm 2" v-debounce="500" @change="getListUser()" @focus="openAutocomplete()">
                    <i class="el-icon-search"></i>
                    <ul class="autocomplete-results" ref="autocomplete">
                      <div class="btn__close"><span class="close__search" @click="offAutocomplete"><i class="el-icon-close"></i></span></div>
                      <li v-for="(user, index) in users" :key="index" @click="detaiUser(user)">
                        <el-avatar v-if="user.avatar" :size="40" :src="user?.avatar"></el-avatar>
                        <el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                        <span>{{user?.name}}</span>
                      </li>
                      <li class="" v-for="(group) in groups" :key="group?.name" @click="detailGroup(group)">
                        <el-image style="width: 40px; height: 40px; margin-left: 10px" v-if="group.avatar" :size="40" :src="group?.avatar"></el-image>
                        <span>{{group?.name}}</span>
                      </li>
                    </ul>
                  </div>
                </label>
              </div>
            </div>
          </el-col>
          <!-- center -->
          <el-col :span="14">
            <el-row>
              <el-col :span="4">
                <div class="grid-content bg-purple"></div>
              </el-col>
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <div class="grid-content bg-purple-light nav__header d-flex p-1">
                    <span>
                      <router-link :to="{name: 'Home'}">
                        <b-icon-house-door font-scale="1.5"></b-icon-house-door>
                      </router-link>
                    </span>
                    <span>
                      <router-link :to="{name: 'FriendView'}">
                        <b-icon-people font-scale="1.5"></b-icon-people>
                      </router-link>
                    </span>
                    <span>
                      <router-link :to="{name: 'ListGroupJoinedView'}">
                        <!-- <i class="el-icon-video-play" style="font-size: 27px;"></i> -->
                        <b-icon-play-btn font-scale="1.5"></b-icon-play-btn>
                      </router-link>
                    </span>
                    
                  </div>
                  
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple"></div>
              </el-col>
            </el-row>
          </el-col>
          <!-- left -->
          <el-col :span="5">
            <div class="grid-content bg-purple box__me">
              <div class="d-flex" >
                <div class="">
                  <!-- danh mục -->
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                       <span class="icon">
                         <i class="el-icon-s-grid"></i>
                       </span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <router-link :to="{name: 'FeedGroupView'}">
                          <div class="text-black text-decoration-none">
                            <b-icon-people-fill></b-icon-people-fill> Nhóm
                          </div>
                        </router-link>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <router-link :to="{name: 'FriendView'}">
                          <div class="text-black text-decoration-none">
                            <b-icon-person-check-fill></b-icon-person-check-fill> Bạn bè
                          </div>
                        </router-link>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- messager -->
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                       <span class="icon">
                         <!-- <i class="el-icon-chat-round"></i> -->
                         <b-icon-messenger></b-icon-messenger>
                       </span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <router-link :to="{name: 'FeedGroupView'}">
                          <div class="text-black text-decoration-none">
                            <b-icon-people-fill></b-icon-people-fill> Nhóm
                          </div>
                        </router-link>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <router-link :to="{name: 'FriendView'}">
                          <div class="text-black text-decoration-none">
                            <b-icon-person-check-fill></b-icon-person-check-fill> Bạn bè
                          </div>
                        </router-link>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- thông báo -->
                    <span class="el-dropdown-link">
                      <span @click="openListNotifies()" class="icon notify">
                         <el-badge :value="countNotifyUnRead" class="item">
                          <i class="el-icon-message-solid"></i>
                         </el-badge>
                      </span>
                      <div v-if="checkNotify" class="list-notify">
                          <h5>Thông báo</h5>
                        <ul class="ul__list--notify" v-if="notifies?.length > 0">
                          <li class="li__list--notify" v-for="(notify, index) in notifies" :key="index">
                            <div class="list--notify__box">
                              <!-- Gửi lời mời kết bạn -->
                              <div class="d-flex notify__item__container" v-if="notify?.type === TYPE_NOTIFY['ADD_FRIEND'] && notify?.check_read === CHECK_READ_NOTIFY['WATCHED']" :style="{opacity : 0.5}">
                                <router-link class="d-flex text-dark" :to="{name: 'RequestAddFriendView'}" @click.native="checkNotify = !checkNotify">
                                  <div class="notify__avatar">
                                    <el-avatar :size="60">
                                      <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                      <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                    </el-avatar>
                                  </div>
                                  <div class="notify__info">
                                    <p>
                                      <b>{{notify.user.name}}</b> đã gửi cho bạn lời mời kết bạn. (đã xem)
                                    </p>
                                  </div>
                                </router-link>
                              </div>
                              <div class="d-flex notify__item__container" v-if="notify?.type === TYPE_NOTIFY['ADD_FRIEND'] && notify?.check_read === CHECK_READ_NOTIFY['NOT_SEEN']">
                                <router-link class="d-flex text-dark" :to="{name: 'RequestAddFriendView'}" @click.native="readNotify(notify?.id)">
                                  <div class="notify__avatar">
                                    <el-avatar :size="60">
                                      <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                      <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                    </el-avatar>
                                  </div>
                                  <div class="notify__info">
                                    <p>
                                      <b>{{notify.user.name}}</b> đã gửi cho bạn lời mời kết bạn
                                    </p>
                                  </div>
                                </router-link>
                              </div>
                              <!-- Xác Nhận add friend -->
                              <div class="d-flex notify__item__container" v-if="notify?.type === TYPE_NOTIFY['CONFIRM_FRIEND'] && notify?.check_read === CHECK_READ_NOTIFY['WATCHED']" :style="{opacity : 0.5}">
                                <router-link class="d-flex text-dark" :to="{name: 'ProfileView', params: {id: notify?.user?.id}}" @click.native="checkNotify = !checkNotify">
                                  <div class="notify__avatar">
                                    <el-avatar :size="60">
                                      <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                      <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                    </el-avatar>
                                  </div>
                                  <div class="notify__info">
                                    <p>
                                      <b>{{notify.user.name}}</b> đã xác nhận lời mời kết bạn của bạn. (đã xem)
                                    </p>
                                  </div>
                                </router-link>
                              </div>
                              <div class="d-flex notify__item__container" v-if="notify?.type === TYPE_NOTIFY['CONFIRM_FRIEND'] && notify?.check_read === CHECK_READ_NOTIFY['NOT_SEEN']">
                                <router-link class="d-flex text-dark" :to="{name: 'ProfileView', params: {id: notify?.user?.id}}" @click.native="readNotify(notify?.id)">
                                  <div class="notify__avatar">
                                    <el-avatar :size="60">
                                      <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                      <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                    </el-avatar>
                                  </div>
                                  <div class="notify__info">
                                    <p>
                                      <b>{{notify.user.name}}</b> đã xác nhận lời mời kết bạn của bạn.
                                    </p>
                                  </div>
                                </router-link>
                              </div>
                              <!-- request Group -->
                              <div class="d-flex notify__item__container" v-if="notify.type === TYPE_NOTIFY['REQUEST_JOIN_GROUP'] && notify?.check_read === CHECK_READ_NOTIFY['WATCHED']"  :style="{opacity : 0.5}">
                                <div class="notify__avatar">
                                  <el-avatar :size="60">
                                    <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                    <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                  </el-avatar>
                                </div>
                                <div class="notify__info">
                                  <p>
                                    <b>{{notify.user.name}}</b> đã xin vào nhóm <b><router-link :to="{name:'GroupDetail',params:{id:notify?.group?.id}}" @click.native="checkNotify = !checkNotify">{{notify?.group?.name}}</router-link></b> của bạn.(đã xem)
                                  </p>
                                </div>
                              </div>
                              <div class="d-flex notify__item__container" v-if="notify.type === TYPE_NOTIFY['REQUEST_JOIN_GROUP'] && notify?.check_read === CHECK_READ_NOTIFY['NOT_SEEN']">
                                <div class="notify__avatar">
                                  <el-avatar :size="60">
                                    <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                    <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                  </el-avatar>
                                </div>
                                <div class="notify__info">
                                  <p>
                                    <b>{{notify.user.name}}</b> đã xin vào nhóm <b><router-link :to="{name:'GroupDetail',params:{id:notify?.group?.id}}" @click.native="readNotify(notify?.id)">{{notify?.group?.name}}</router-link></b> của bạn
                                  </p>
                                </div>
                              </div>
                              <!-- confirm request group -->
                              <div class="d-flex notify__item__container" v-if="notify.type === TYPE_NOTIFY['CONFIRM_JOIN_GROUP'] && notify?.check_read === CHECK_READ_NOTIFY['WATCHED']"  :style="{opacity : 0.5}">
                                <div class="notify__avatar">
                                  <el-avatar :size="60">
                                    <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                    <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                  </el-avatar>
                                </div>
                                <div class="notify__info">
                                  <p>
                                    <b>{{notify.user.name}}</b> đã duyệt yêu cầu vào nhóm <b><router-link :to="{name:'GroupDetail',params:{id:notify?.group?.id}}" @click.native="checkNotify = !checkNotify">{{notify?.group?.name}}</router-link></b> của bạn.(đã xem)
                                  </p>
                                </div>
                              </div>
                              <div class="d-flex notify__item__container" v-if="notify.type === TYPE_NOTIFY['CONFIRM_JOIN_GROUP'] && notify?.check_read === CHECK_READ_NOTIFY['NOT_SEEN']">
                                <div class="notify__avatar">
                                  <el-avatar :size="60">
                                    <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                    <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                  </el-avatar>
                                </div>
                                <div class="notify__info">
                                  <p>
                                    <b>{{notify.user.name}}</b> đã duyệt yêu cầu vào nhóm <b><router-link :to="{name:'GroupDetail',params:{id:notify?.group?.id}}" @click.native="readNotify(notify?.id)">{{notify?.group?.name}}</router-link></b> của bạn
                                  </p>
                                </div>
                              </div>
                              <!-- notifile Like -->
                              <div class="d-flex notify__item__container" v-if="notify?.type === TYPE_NOTIFY['LIKE'] && notify?.check_read === CHECK_READ_NOTIFY['NOT_SEEN'] && notify?.group_id === null">
                                <router-link class="d-flex text-dark" :to="{name:'DetailPostView',params:{id:notify?.post?.id}}" @click.native="readNotify(notify?.id)">
                                  <div class="notify__avatar">
                                    <el-avatar :size="60">
                                      <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                      <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                    </el-avatar>
                                  </div>
                                  <div class="notify__info">
                                    <p>
                                      <b>{{notify.user.name}}</b> đã thích bài viết của bạn : Title bài viết 
                                    </p>
                                  </div>
                                </router-link>
                              </div>

                              <div class="d-flex notify__item__container" v-if="notify?.type === TYPE_NOTIFY['LIKE'] && notify?.check_read === CHECK_READ_NOTIFY['NOT_SEEN'] && notify?.group_id !== null">
                                <router-link class="d-flex text-dark" :to="{name:'DetailPostView',params:{id:notify?.post?.id}}" @click.native="readNotify(notify?.id)">
                                  <div class="notify__avatar">
                                    <el-avatar :size="60">
                                      <img v-if="notify?.user?.avatar" :src="notify?.user?.avatar"/>
                                      <img v-else :src="require('@/assets/images/userdefault.jpg')"/>
                                    </el-avatar>
                                  </div>
                                  <div class="notify__info">
                                    <p>
                                      <b>{{notify.user.name}}</b> đã like bài viết trong nhóm của bạn
                                    </p>
                                  </div>
                                </router-link>
                              </div>

                            </div>
                          </li>
                        </ul>
                      </div>
                    </span>
                  </div>
                <div>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <img v-if="authUser?.data?.avatar" class="avatar-default" :src="authUser?.data.avatar" alt="">
                      <img v-else class="avatar-default" src="../assets/images/userdefault.jpg" alt="">
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <router-link :to="{name: 'ProfileView', params: {id: authUser?.data?.id}}">
                          <div class="text-black text-decoration-none">
                            Xem trang cá nhân
                          </div>
                        </router-link>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="authUser?.data?.type_account == TYPE_ACCOUNT['BASIC']" @click.native="openDialogChangePassword()">
                        Đổi mật khẩu
                      </el-dropdown-item>
                      <el-dropdown-item divided @click.native="logout">
                        Đăng xuất
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <!-- CONTENT -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>

    <!-- modal đổi mật khẩu -->
    <el-dialog width="30%" title="Đổi mật kẩu" :visible.sync="dialogChangePassword">
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
    <button class="btn btn-secondary btn--option--changepass" @click="closeDialogChangePassword()">Huỷ</button>
    <button class="btn btn-primary btn--option--changepass" @click="handleChangePassword()">Đổi mật khẩu</button>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {TYPE_ACCOUNT, TYPE_NOTIFY, CHECK_READ_NOTIFY} from "@/utils/constants";
import api from '@/api'
import _ from 'lodash'

export default {
  name: "GeneralLayout",
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  mounted() {
    this.getListNotifies()
  },
  data() {
    return {
      checkNotify: false,
      CHECK_READ_NOTIFY,
      TYPE_ACCOUNT,
      TYPE_NOTIFY,
      dialogChangePassword: false,
      q: '',
      userSearch: '',
      users: [],
      groups: [],
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
      notifies: [],
      countNotifyUnRead: '',
    }
  },
  methods: {
    ...mapMutations("auth", ["updateLoginStatus", "updateAccessToken", "updateAuthUser"]),
    readNotify(id) {
      api.readNotify(id).then(() =>{
        this.checkNotify = !this.checkNotify
        this.getListNotifies()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại"
        })
      })
    },
    openListNotifies() {
      this.checkNotify = !this.checkNotify
      if(this.checkNotify == true) {
        this.getListNotifies()

      }
    },
    getListNotifies() {
      api.listNotifies().then((response)=>{
        this.notifies = _.get(response,'data.data.notifies',[])
        this.countNotifyUnRead = _.get(response, 'data.data.countNotifyUnRead')
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại"
        })
      })
    },
    closeDialogChangePassword() {
      this.resetError()
      this.resetForm()
      this.dialogChangePassword = false
    },
    openDialogChangePassword() {
      this.resetError()
      this.resetForm()
      this.dialogChangePassword = true
    },
    handleChangePassword() {
      if(this.isValidData()) {
        let formData = new FormData
        formData.append('password', this.changePassword.password)
        formData.append('re_password', this.changePassword.passwordConfirm)
        formData.append('current_password', this.changePassword.current_password)
        api.changePassword(formData).then(()=>{
          this.autoLogout()
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
    },

    detaiUser(user){
      if((this.$route.name === 'ProfileView' && this.$route.params.id != user.id) || this.$route.name !== 'ProfileView'){
        this.$router.push({ name: "ProfileView", params: {id: user.id}});
        this.offAutocomplete()
      } else {
        this.offAutocomplete()
      }
    },
    detailGroup(group){
      if ((this.$route.name === 'GroupDetail' && this.$route.params.id != group.id) || this.$route.name !== 'GroupDetail') {
        this.$router.push({name: "GroupDetail", params: {id: group.id}});
        this.offAutocomplete()
      } else {
        this.offAutocomplete()
      }
    },
    logout()
    {
      this.$confirm('Bạn có chắc chắn đăng xuất?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ',
        type: 'error',
        center: true
      }).then(() => {
        api.logout().then(()=> {
          this.updateAccessToken('');
          this.updateLoginStatus(false);
          this.updateAuthUser({})
          this.$router.push({ name: "Login" });
          this.$message({
            type: 'success',
            message: "Đã đăng xuất"
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "Đã xảy ra lỗi, thử lại sau"
          })
        })
      }).catch(() => {

      });
    },

    autoLogout()
    {
        api.logout().then(()=> {
          this.updateAccessToken('');
          this.updateLoginStatus(false);
          this.updateAuthUser({})
          this.$router.push({ name: "Login" });
          this.$message({
            type: 'success',
            message: "Đã đăng xuất"
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "Đã xảy ra lỗi, thử lại sau"
          })
        })
    },
    getListUser()
    {
      let data = {}
      if(this.userSearch) {
        data.q = this.userSearch
      }
      api.getListUser(data).then((response) => {
        this.users = _.get(response,'data.data',[])
      })
    },
    getListGroupAll()
    {
      let data = {}
      if(this.userSearch) {
        data.q = this.userSearch
      }
      api.getListGroupAll(data).then((response) => {
        this.groups = _.get(response,'data.data',[])
      })
    },
    openAutocomplete() {
      this.getListUser()
      this.getListGroupAll()
      this.$refs.autocomplete.style.display = 'block'
    },
    offAutocomplete(){
      this.userSearch = ''
      this.$refs.autocomplete.style.display = 'none'
      this.users = []
      this.groups = []
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
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.el-header {
  text-align: center;
  border-bottom: 1px solid #ccc;
  position: fixed;
  z-index: 1000;
  right: 0;
  left: 0;
  background-color: #fff;

  .el-row {
    height: 60px;

    div {
      height: 60px;
      line-height: 60px;
    }
  }
}

.box__search {
  height: 60px;
  line-height: 60px;
  position: relative;

  img {
    width: 43px;
  }

  label {
    position: absolute;
    top: 2%;
    left: 16%;
    //transform: translate(-58%, -50%);
    .autocomplete {
      input {
        width: 225px;
        height: 40px;
        border-radius: 20px;
        //border: none;
        background: #E8E8E8;
        padding-left: 35px;
        outline: none;
      }

      i {
        position: absolute;
        right: 87%;
        top: 36%;
        font-weight: bold;
      }
      .autocomplete-results {
        position: absolute;
        width: 300px;
        z-index: 1;
        top: 87%;
        left: -69px;
        right: -31px;
        margin: 0;
        list-style-type: none;
        background-color: #f1f1f1;
        border-top: none;
        border-radius: 10px;
        padding: 0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        max-height: 450px;
        overflow-y: auto;
        display: none;
        .btn__close{
          width: 100%;
          text-align: right;
          padding: 0 10px !important;
          line-height: 25px;
          height: 25px;
          font-size: 25px;
          font-weight: 900;
          span {
            cursor: pointer;
          }
          .close__search {
            i {
              position: unset !important;
            }
          }
          .close__search:hover {
            color: #ff0000;
          }
        }
        li {
          padding: 0 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          span {
            font-weight: 600;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.autocomplete li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.grid-content {
  height: 60px;
  text-align: left;
  border-radius: 4px;
}

.nav__header {
  span:hover {
    background-color: #f4f4f4;
  }
  span {
    padding: 0px 74px;
    i {
      font-size: 33px;
      color: #3578E5;
      line-height: 52px;
    }
  }
}

.box__me {
  text-align: right;
  line-height: 60px;
  margin: 3px 0;
  div {
    justify-content: right;
    div {
      span {
        margin-right: 6px;
      }
    }
  }

  .icon {
    padding: 14px 9px 9px 9px;
    border-radius: 50%;
    background-color: #ccc;
    color: #000000 !important;
    i {
      font-size: 23px;
    }
    svg {
      font-size: 23px;
    }
  }
}

.avatar-default {
  width: 39px;
  margin-top: -7px;
  height: 40px;
  border-radius: 50%;
}
.autocomplete-results::-webkit-scrollbar-track
{
  border-radius: 10px;
  background-color: #F0F2F5;
}

.autocomplete-results::-webkit-scrollbar
{
  width: 8px;
  background-color: #F0F2F5;
}

.autocomplete-results::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #ccc;
}
a {
  text-decoration: none !important;
}
.btn--option--changepass {
  display: inline-block;
  width: max-content;
  margin-left: 10px;
}
.notify::v-deep {
  position: relative;
  .el-badge {
    .el-badge__content {
      top: 5px !important;
      right: 5px !important;
    }
  }
}
.list-notify::-webkit-scrollbar-track
{
  border-radius: 10px;
  background-color: #F0F2F5;
}

.list-notify::-webkit-scrollbar
{
  width: 8px;
  background-color: #F0F2F5;
}

.list-notify::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #ccc;
}
.list-notify {
  padding: 10px;
  text-align: left;
  width: 360px;
  height: auto !important;
  max-height: 93vh !important;
  overflow-y: auto;
  background-color: #ffffff;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 55px;
  right: 5px;
  border-radius: 8px;
  h5 {
    font-weight: 600;
    padding: 10px;
  }
  .ul__list--notify {
    list-style: none;
    padding-left : 0 ;
    .li__list--notify:hover {
      background-color: #F2F3F5;
      cursor: pointer;
    }
    .li__list--notify {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 0;
      .list--notify__box {
        height: auto;
        .notify__item__container {
          padding: 5px;
          height: max-content;
          .notify__avatar {
            width: 20%;
          }
          .notify__info {
            height: max-content;
            width: 80%;
            line-height: 23px;
            p {
              margin-bottom: 10px;
            }
            .button__option {
              height: max-content;
              line-height: 23px;
              .btn__confirm {
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>