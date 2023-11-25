<template>
  <div class="d-flex request__container">
    <div class="request--sidebar d-inline-block">
      <div class="d-flex">
        <router-link :to="{name: 'FriendView'}">
          <div class="btn__back">
            <b-icon-arrow-left></b-icon-arrow-left>
          </div>
        </router-link>
        <div class="title">
          <small class="d-block">Bạn bè</small>
          <h6>Lời mời kết bạn1</h6>
        </div>
      </div>
      <div class="line"></div>
      <div class="list--request--add">
        <p class="count--request">{{listRequestAddFriend?.length}} lời mời kết bạn</p>

        <el-menu class="list--request" active-text-color="" v-if="listRequestAddFriend.length > 0">

          <el-menu-item index="1" class="" v-for="(requestAddFriend, index) in listRequestAddFriend" :key="index">
            <el-row>
              <el-col :span="5">
                <router-link :to="{name: 'ProfileRequestAddFriend', params: {id: requestAddFriend.id}}">
                  <el-avatar v-if="requestAddFriend?.avatar" :size="50" :src="requestAddFriend?.avatar"></el-avatar>
                  <el-avatar v-else :size="50" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                </router-link>
              </el-col>
              <el-col :span="19">
                <router-link :to="{name: 'ProfileRequestAddFriend', params: {id: requestAddFriend.id}}">
                  <h5 class="d-block">{{requestAddFriend?.name}}</h5>
                </router-link>
                <button class="btn btn-primary   " @click="confirmFriend(requestAddFriend?.id)">Xác nhận</button>
                <button class="btn btn-secondary mx-2 " @click="deleteAddFriend(requestAddFriend?.id)">Xoá</button>
              </el-col>
            </el-row>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="empty--card">
    </div>
    <div class="request--profile">
      <router-view @confirmRequest="handleNotifyParent()"></router-view>
    </div>
  </div>
</template>
<script>
import api from "@/api";
import {mapState} from "vuex";
import _ from 'lodash';
export default {
  name: 'RequestAddFriendView',
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  data() {
    return {
      listRequestAddFriend: [],
    }
  },
  methods: {
    handleNotifyParent() {
      this.getListRequestAddFriend(this.authUser.data.id)
    },
    deleteAddFriend(id)
    {
      api.deleteAddFriend(id).then(() => {
        this.getListRequestAddFriend(this.authUser.data.id)
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
    confirmFriend(id)
    {
      api.confirmFriend(id).then(() => {
        this.getListRequestAddFriend(this.authUser.data.id)
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
    getListRequestAddFriend(id)
    {
      api.getListRequestAddFriend(id).then((response) => {
        this.listRequestAddFriend = _.get(response,'data.data',[])
      }).catch(() => {
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
  },
  mounted() {
    this.getListRequestAddFriend(this.authUser.data.id)
  }
}

</script>

<style lang="scss" scoped>
.request__container {
  margin-top: 10px;
  .request--profile {
    width: 80%;
    margin: auto;
    display: block;
  }
  .empty--card {
    width: 20%;
  }
  .request--sidebar {
    background-color: #ffffff;
    width: 20%;
    text-align: left;
    padding: 20px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    min-height: 93.8vh;
    position: fixed;
    left: 0;
    top: 60px;
    .title {
      margin-left: 10px;
      h6 {
        font-weight: bold;
      }
    }
    .btn{
      font-size: 15px;
      width: 90px;
    }
    // p.d-block {
    //   margin-top: -10px;
    // }
    .btn__back {
      display: flex;
      width: 35px;
      height: 35px;
      line-height: 35px;
      border-radius: 50%;
      svg {
        margin: auto;
        font-size: 18px;
      }
    }
    .btn__back:hover {
      background-color: #E4E6EB;
    }
    .line {
      width: 100%;
      border-bottom: 1px solid #ccc;
    }
    .list--request--add {
      margin-top: 20px;
      .count--request{
        font-weight: 600;
        margin-bottom: 0 !important;

      }
      .list--request {
        border: none;
        .el-menu-item {
          border-radius: 10px;
          height: max-content;
          padding: 10px !important;
          h6 {
            font-weight: 600;
            padding-left: 10px;
            font-size: 18px;
          }
        }
        .el-menu-item:hover {
          background-color: #dddddd;
        }
      }
    }
  }
  .list__nav:hover {
    background-color: #ccc !important;
  }
}
</style>