<template>
    <div class="group--joined__container">
      <div class="group--joined__item" v-for="(group, index) in groups" :key="index">
        <div class="info--group d-flex">
          <el-image v-if="$route.name === 'ListMyGroupView'"
              style="width: 80px; height: 80px; border-radius: 10px"
              :src="group?.avatar"
              fit="cover">
          </el-image>
          <el-image v-if="$route.name === 'ListGroupJoinedView'"
                    style="width: 80px; height: 80px; border-radius: 10px"
                    :src="group?.group?.avatar"
                    fit="cover">
          </el-image>
          <div class="info--group__name">
            <h6 v-if="$route.name === 'ListMyGroupView'">{{group?.name}}</h6>
            <h6 v-if="$route.name === 'ListGroupJoinedView'">{{group?.group?.name}}</h6>
            <small v-if="$route.name === 'ListGroupJoinedView' && group?.created_at">Ngày tham gia: {{dateFormat(group?.created_at)}}</small>
            <small v-if="$route.name === 'ListMyGroupView'">Ngày tạo nhóm: {{dateFormat(group?.created_at)}}</small>
          </div>
        </div>
        <div class="option--group d-flex">
          <router-link v-if="$route.name === 'ListMyGroupView'" :to="{name: 'GroupDetail', params: {id: group?.id}}" class="router-link-group">
            <button class="btn option--group__view">
              Xem nhóm1
            </button>
          </router-link>
          <router-link v-if="$route.name === 'ListGroupJoinedView'" :to="{name: 'GroupDetail', params: {id: group?.group_id}}" class="router-link-group">
            <button class="btn option--group__view">
              Xem nhóm2
            </button>
          </router-link>
          <button v-if="$route.name === 'ListMyGroupView'" @click="leaveGroup(group?.id)" class="btn option--group__out">
            <el-tooltip class="item" effect="dark" content="Rời nhóm" placement="top-start">
              <b-icon-box-arrow-right></b-icon-box-arrow-right>
            </el-tooltip>
          </button>
          <button v-if="$route.name === 'ListGroupJoinedView'" @click="leaveGroup(group?.group_id)" class="btn option--group__out">
            <el-tooltip class="item" effect="dark" content="Rời nhóm" placement="top-start">
              <b-icon-box-arrow-right></b-icon-box-arrow-right>
            </el-tooltip>
          </button>
        </div>
      </div>
    </div>
</template>

<script>
import {dateFormat} from "@/utils/helpers";
import api from "@/api";
export default {
  name: 'CardGroupComponent',
  props: ['groups'],
  methods:{
    dateFormat(date)
    {
      return dateFormat(date)
    },
    leaveGroup(id) {
      this.$confirm('Bạn có chắc chắn rời nhóm?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ',
        type: 'error',
        center: true
      }).then(() => {
        api.leaveGroup(id).then(()=> {
          this.$emit('leaveGroupSuccess')
          this.$message({
            type: 'success',
            message: "Đã rời nhóm"
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
.group--joined__container {
  .group--joined__item {
    display: inline-block;
    margin: 4px;
    width: 390px;
    border-radius: 10px;
    background-color: #ffffff;
    padding: 15px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    .info--group {
      .info--group__name {
        margin-left: 15px;
        margin-top: auto;
        margin-bottom: auto;
        h6 {
          font-weight: 600;
          font-size: 16px;
          display: block;
          margin-bottom: unset;
        }
      }
    }
    .option--group {
      margin-top: 20px;
      .btn {
        border: none;
      }
      .router-link-group {
        width: 85%;
        button {
          background-color: #E7F3FF;
          color: #1877F2;
          width: 100%;
        }
      }
      .option--group__out {
        background-color: #E4E6EB;
        text-align: center;
        width: 13%;
        margin-left: 2%;
      }
    }
  }
}

</style>