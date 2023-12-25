<template>
  <div class="d-flex group--container">
    <div class="group--sidebar d-inline-block">
      <h4>Bạn bè</h4>
      <el-menu id="my--group" class="nav__menu nav__group nav__list-group" active-text-color="#000000">
        <el-menu-item class="list__nav">
          <router-link :to="{name: 'FriendView'}">
            <span class="icon__my--group"><b-icon-people-fill></b-icon-people-fill></span><span>Trang chủ</span>
          </router-link>
        </el-menu-item>
        <el-menu-item class="list__nav">
          <router-link :to="{name: 'RequestAddFriendView'}">
            <span class="icon__my--group"><b-icon-person-check-fill></b-icon-person-check-fill></span><span>Lời mời kết bạn</span>
          </router-link>
        </el-menu-item>
        <el-menu-item class="list__nav">
          <router-link :to="{name: 'ListFriendView'}">
            <span class="icon__my--group"><b-icon-person-lines-fill></b-icon-person-lines-fill></span><span>Tất cả bạn bè</span>
          </router-link>
        </el-menu-item>
        <el-menu-item class="list__nav">
          <router-link :to="{name: 'ListSuggestView'}">
            <span class="icon__my--group"><b-icon-person-plus-fill></b-icon-person-plus-fill></span><span>Gợi ý</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="empty--card">
    </div>
  <div class="list--request__container">
    <div class="list--request__box">
      <h5>Lời mời kết bạn: </h5>
      <div class="list--request" v-if="listRequestAdd.length > 0">
        <div class="list--request__item" v-for="(request, index) in listRequestAdd" :key="index">
          <el-image v-if="request.avatar"
              style=""
              :src="request.avatar"
              fit="cover">
          </el-image>
          <el-image v-else
              style=""
              :src="require('@/assets/images/userdefault.jpg')"
              fit="cover">
          </el-image>
          <div class="info__user">
            <h6>{{request.name}}</h6>
            <div>
              <button class="btn btn__confirm" @click="confirmFriend(request?.id)">Xác nhận</button>
              <button class="btn btn__delete" @click="deleteAddFriend(request?.id)">Xoá</button>
            </div>
          </div>
        </div>
        <div v-if="listRequestAdd < listRequestAddAll" class="read--more" @click="readMore(authUser.data.id)">Xem thêm <b-icon-caret-down-fill></b-icon-caret-down-fill></div>
      </div>
      <div v-else class="text-center">Bạn không có lời mời kết bạn nào</div>
    </div>
    <div class="list--request__box list-suggest">
      <h5>Gợi ý kết bạn: </h5>
      <div class="list--request" v-if="listSuggestion.length > 0">
        <div class="list--request__item" v-for="(suggestion, index) in listSuggestion" :key="index">
          <el-image v-if="suggestion.avatar"
                    style=""
                    :src="suggestion.avatar"
                    fit="cover">
          </el-image>
          <el-image v-else
                    style=""
                    :src="require('@/assets/images/userdefault.jpg')"
                    fit="cover">
          </el-image>
          <div class="info__user">
            <h6>{{suggestion.name}}</h6>
            <div>
              <button class="btn btn__confirm" @click="requestAddFriend(suggestion.id)">Thêm bạn bè</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import {mapState} from "vuex";
import api from "@/api";
import _ from "lodash"

export default {
  name: 'FriendView',
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  mounted() {
    this.getRequestAddFriendLimit(this.authUser.data.id)
    this.getAllRequestAddFriend(this.authUser.data.id)
    this.getListSuggest(this.authUser.data.id)
  },
  data() {
    return {
      listRequestAdd: [],
      listRequestAddAll: [],
      listSuggestion: [],
      page: 1
    }
  },
  methods: {
    requestAddFriend(id) {
      api.requestAddFriend(id). then(()=>{
        this.getListSuggest(this.authUser.data.id)
        this.$message({
          type: 'success',
          message: "gửi lời mời kết bạn thành công"
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    confirmFriend(id)
    {
      api.confirmFriend(id).then(() => {
        this.getAllRequestAddFriend(this.authUser.data.id)
        this.listRequestAdd = this.listRequestAdd.filter(item => item.id !== id);
        this.$message({
          type: 'success',
          message: "Kết bạn thành công"
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },

    deleteAddFriend(id)
    {
      api.deleteAddFriend(id).then(() => {
        this.getAllRequestAddFriend(this.authUser.data.id)
        this.listRequestAdd = this.listRequestAdd.filter(item => item.id !== id);
        this.$message({
          type: 'success',
          message: "Xoá thành công"
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getListSuggest(id) {
      api.getListSuggest(id).then((response) => {
        this.listSuggestion = _.get(response,'data.data',[])
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    readMore(id) {
      this.page += 1
      let data = {}
      data.page = this.page
      api.getRequestAddFriendLimit(data, id).then((response) => {
        this.listRequestAdd = this.listRequestAdd.concat(_.get(response,'data.data',[]))
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getRequestAddFriendLimit(id)
    {
      let data = {}
      data.page = this.page
      api.getRequestAddFriendLimit(data, id).then((response) => {
        this.listRequestAdd = (_.get(response,'data.data',[]))
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getAllRequestAddFriend(id)
    {
      api.getListRequestAddFriend(id).then((response) => {
        this.listRequestAddAll = _.get(response,'data.data',[])
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
  }
}

</script>

<style lang="scss" scoped>
.group--container {
  margin-top: 10px;
  .list--request__container {
    width: 80%;
    margin: auto;
    display: block;
    .list-suggest {
      border-top: 1px solid #ccc;
    }
    .list--request__box {
      padding: 25px;
      text-align: left;
      h5 {
        font-weight: 600;
        margin-left: 5px;
      }
      .list--request {
        .read--more {
          border-radius: 5px;
          width: 100%;
          height: 35px;
          line-height: 35px;
          text-align: center;
          color: #1B74E4;
          font-weight: 600;
          cursor: pointer;
        }
        .read--more:hover {
          background-color: #E4E6EB;
        }
        .list--request__item {
          border: 1px solid #CED0D4;
          border-radius: 10px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          display: inline-block;
          width: 200px;
          margin: 5px;
          .el-image {
            width: 199px;
            height: 200px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border-bottom: 1px solid #ccc;
          }
          .info__user {
            padding: 10px;
            h6 {
              font-weight: 600;
              display: block;
              font-size: 18px;
              margin-bottom: 0 !important;
            }
            .btn {
              width: 100%;
              border: none;
              margin: 4px 0;
            }
            .btn__confirm {
              background-color: #1B74E4;
              color: #ffffff;
            }
            .btn__delete {
              background-color: #E4E6EB;
              color: #000000;
            }
          }
        }
      }
    }
  }
  .empty--card {
    width: 20%;
  }
  .group--sidebar {
    background-color: #ffffff;
    width: 20%;
    text-align: left;
    padding: 5px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    min-height: 93.8vh;
    position: fixed;
    left: 0;
    top: 60px;
    #my--group {
      padding: 0 10px !important;
      background-color: #FFFFFF !important;
    }
    .line {
      border-bottom: 1px solid #ccc;
    }
    h4 {
      font-weight: 600;
      padding: 0 20px;
      margin-top: 20px;
    }
    .create--group {
      margin: 10px 0 20px 0;
      padding: 0 10px;
      .btn--create--group {
        background-color: #E7F3FF;
        font-weight: 600;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 5px;
      }
      input {
        width: 100%;
        height: 35px;
        outline: unset;
        background-color: #ccc;
        border: none;
        border-radius: 20px;
        padding: 0 10px;
      }
    }
    .group__joined {
      margin-top: 30px;
      h6 {
        padding: 0 10px !important;
      }
      .nav__list-group {
        background-color: #ffffff !important;
        .list__nav {
          background-color: #ffffff;
        }
      }
    }
  }
  .list__nav:hover {
    background-color: #ccc !important;
  }
}
.icon__my--group {
  font-size: 22px !important;
  padding-left: 0 !important;
}
.el-menu-item:focus, .el-menu-item:hover {
  outline: 0;
  color: #409EFF;
  background-color: #ffffff;
}
</style>