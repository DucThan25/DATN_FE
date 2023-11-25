<template>
  <div class="d-flex group--container">
    <div class="group--sidebar d-inline-block">
      <h4>Nhóm</h4>
      <el-menu id="my--group" class="nav__menu nav__group nav__list-group" active-text-color="#000000">
        <el-menu-item class="list__nav">
          <router-link :to="{name: 'FeedGroupView'}">
            <span class="icon__my--group"><b-icon-grid1x2-fill></b-icon-grid1x2-fill></span><span>Bảng feed của bạn grouplayout</span>
          </router-link>
        </el-menu-item>
        <el-menu-item class="list__nav">
          <router-link :to="{name: 'ListGroupJoinedView'}">
            <span class="icon__my--group"><b-icon-people-fill></b-icon-people-fill></span><span>Nhóm đã tham gia grlu</span>
          </router-link>
        </el-menu-item>
      </el-menu>
      <div class="create--group">
        <router-link to="/groups/create">
          <div class="btn--create--group"><i class="el-icon-plus"></i>Tạo nhóm mới</div>
        </router-link>
      </div>
      <div class="line"></div>
      <div class="group__joined">
        <div class="list__group">
          <div class="list__group__description">
            <h6>Nhóm của bạn</h6>
            <span class="view__all">
              <router-link :to="{name: 'ListMyGroupView'}">
               <a>Xem tất cả</a>
              </router-link>
            </span>
          </div>
          <el-menu v-if="myGroups.length > 0" class="nav__menu nav__group nav__list-group" active-text-color="#000000">
            <el-menu-item class="list__nav" v-for="(myGroup,index) in myGroups" :key="index">
              <router-link :to="{name: 'GroupDetail', params: {id: myGroup?.id}}" class="router-link-group">
                <el-image
                    :src="myGroup.avatar"
                    class="nav__avatar__group"></el-image>
                <span>{{myGroup.name}}</span>
              </router-link>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
    <div class="empty--card"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState} from "vuex";
import api from "@/api";
import _ from 'lodash'

export default {
  name: 'FeedGroupView',
  components: {},

  computed: {
    ...mapState("auth", ["authUser"]),
  },
  mounted() {
    this.getListMyGroup(this.authUser.data.id)
  },
  data() {
    return {
      dialogPostDetail: false,
      dialogEditPost: false,
      searchGroup: '',
      coverImageUrl: '',
      groupName: '',
      myGroups: [],
      listPost: [],
      title: '',
      content: '',
      errorTitle: '',
      errorContent: '',
      postDetail: [],
      postId: '',
      checkMoreOption: false
    }
  },
  methods: {
    getListMyGroup() {
      api.getMyGroup().then((response) => {
        this.myGroups = _.get(response,'data.data',[]);
      })
    },
  }
}

</script>

<style lang="scss" scoped>
.group--container {
  margin-top: 10px;
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
      margin-top: 20px
    ;
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