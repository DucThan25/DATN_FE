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
          <h4>Tất cả bạn bè1</h4>
        </div>
      </div>
      <input class="input__search--friend"
        placeholder="Tìm kiếm bạn bè"
        v-model="searchFriend"
         v-debounce="500"
         @change="getListFriend(authUser.data.id)">
      <div class="line"></div>
      <div class="list--request--add">
        <p class="count--request">{{listFriend.length}} người bạn</p>
        <div class="area__read">
        <el-menu v-if="listFriend.length > 0" class="list--request" active-text-color="">
          <el-menu-item index="1" class="d-block" v-for="(friend, index) in listFriend" :key="index">
            <div class="d-inline-flex">
              <router-link :to="{name: 'ProfileFriend', params: {id: friend.id}}">
                <el-avatar v-if="friend?.avatar" :size="60" :src="friend?.avatar"></el-avatar>
                <el-avatar v-else :size="60" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
              </router-link>
              <div class="friend--info">
                <router-link :to="{name: 'ProfileFriend', params: {id: friend.id}}">
                <h6>{{friend.name}}</h6>
                <small>4 bạn chung</small>
                </router-link>
              </div>
            </div>
            <div class="d-inline-block more--option">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <b-icon-three-dots></b-icon-three-dots>
                </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="handleRemoveFriend(friend)"><b-icon-person-x-fill></b-icon-person-x-fill> Huỷ kết bạn</el-dropdown-item>
                    </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      </div>
    </div>
    <div class="empty--card">
    </div>
    <div class="request--profile">
      <!-- khi click vào avartar hoặc tên sẽ hiển thị thông tin user -->
      <router-view @confirmFriend="handleNotifyParent()"></router-view>  
    </div>
  </div>
</template>
<script>
import api from "@/api";
import _ from 'lodash'
import {mapState} from "vuex";

export default {
  name: 'ListFriendView',
  components: {},
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  data() {
    return {
      searchFriend: '',
      listFriend: [],
    }
  },
  mounted() {
    this.getListFriend(this.authUser.data.id)
  },
  methods:{
    handleNotifyParent() {
      this.getListFriend(this.authUser.data.id)
    },
    getListFriend(id)
    {
      let data = {}
      if(this.searchFriend) {
        data.q = this.searchFriend
      }
      api.getListFriend(data, id).then((response) => {
        this.listFriend = _.get(response,'data.data',[])
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    handleRemoveFriend(friend)
    {
      this.$confirm('Bạn có chắc chắn huỷ kết bạn?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ',
        type: 'error',
        center: true
      }).then(() => {
        api.removeFriend(friend.id).then(()=> {
          this.getListFriend(this.authUser.data.id)
          this.$message({
            type: 'success',
            message: "Đã huỷ kết bạn"
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
      h4 {
        font-weight: bold;
      }
    }
    .input__search--friend {
      width: 100%;
      border-radius: 20px;
      background-color: #F0F2F5;
      padding: 8px;
      outline: none;
      border: 1px solid #ccc;
    }
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
      margin-top: 20px;
    }
    // .area__read::-webkit-scrollbar {
    //   //display: none; /* ẩn thanh cuộn */
    // }
    .area__read {
      max-height: 460px;
      overflow: auto;
      // -ms-overflow-style: none;  /* IE and Edge */
      // scrollbar-width: none;  /* Firefox */
    }
    .list--request--add {
      margin-top: 20px;
      .count--request{
        font-weight: 600;
        margin-bottom: 0 !important;

      }
      .list--request {
        border: none;
        .more--option {
          float: right;
          height: 40px;
          line-height: 40px;
          width: 40px;
          border-radius: 50%;
          text-align: center;
          margin-top: 10px;
        }
        .friend--info {
          line-height: 30px !important;
          margin: auto 0;
          padding-left: 10px;
          h6 {
            font-weight: 600;
            display: block;
            margin-bottom: 0;
            padding-left: 0 !important;
          }
        }
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
      }
    }
  }
}
</style>