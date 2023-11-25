<template>
  <div class="d-flex group--container">
    <div class="group--sidebar d-inline-block">
      <h4>Tạo nhóm 1</h4>
      <el-menu class="">
        <el-menu-item class="">
          <el-avatar :size="37" :src="authUser?.data?.avatar"></el-avatar>
          <div class="d-inline-block infor__admin">
            <p>{{authUser?.data?.name}}</p>
            <i>Quản trị viên</i>
          </div>
        </el-menu-item>
        <ul>
          <li>
            <el-input placeholder="Tên Nhóm" v-model="groupName"></el-input>
            <p class="error">{{errorGroupName}}</p>
          </li>
          <li>
            <el-select v-model="typeGroup" placeholder="Chọn loại nhóm">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <p class="error">{{errorTypeGroup}}</p>
          </li>
          <li>
            <el-input
                type="textarea"
                :rows="2"
                placeholder="Thêm giới thiệu nhóm"
                v-model="introduce"
                :autosize="{ minRows: 3}">
            </el-input>
          </li>
        </ul>
        <div class="upload__image">
          <i>Ảnh đại diện</i>
          <el-upload
              class="avatar-uploader"
              ref="avatarImage"
              action="#"
              :on-change="changeAvatar"
              :auto-upload="false"
              :show-file-list="false">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="error">{{errorAvatar}}</p>
        </div>
        <div class="upload__image">
          <i>Ảnh bìa</i>
          <el-upload
              class="avatar-uploader"
              action="#"
              :on-change="changeCoverImage"
              :auto-upload="false"
              :show-file-list="false">
            <img v-if="coverImageUrl" :src="coverImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="error">{{errorCoverImage}}</p>
        </div>
        <div class="btn btn-primary button__create" @click="handleCreateGroup()">Tạo nhóm</div>
      </el-menu>

    </div>
    <div class="group--content d-inline-block">
      <div class="preview__group">
        <div class="preview__group__content">
          <img v-if="coverImageUrl" width="100%" height="350px" :src="coverImageUrl" alt="">
          <img v-else width="100%" height="350px" :src="require('@/assets/images/userdefault.jpg')" alt="">

          <div class="group__generality">
            <h3 v-if="groupName">{{groupName}}</h3>
            <h3 v-else>Tên nhóm</h3>
            <p>Quyền riêng tư của nhóm <b-icon-dot></b-icon-dot> 1 Thành viên</p>
            <div class="line"></div>
            <ul class="group__generality__nav">
              <li>Bài viết</li>
              <li>Thành viên</li>
            </ul>
          </div>
          <div class="group__generality__intro">
            <div>
              <p>Giới thiệu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {TYPE_GROUP} from "@/utils/constants";
import api from "@/api";
import _ from 'lodash'

export default {
  name: 'CreateGroupView',
  components: {},
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  data() {
    return {
      introduce: '',
      coverImageUrl:'',
      coverImage: '',
      avatarImage: '',
      avatarUrl:'',
      errorGroupName: '',
      errorTypeGroup: '',
      errorCoverImage: '',
      errorAvatar: '',
      disabled: false,
      groupName: '',
      typeGroup:'',
      TYPE_GROUP,
      groupCreateId:'',
      options: [{
        value: TYPE_GROUP['PUBLIC'],
        label: 'Công khai'
      }, {
        value: TYPE_GROUP['PRIVATE'],
        label: 'Không công khai'
      }],
    }
  },
  methods: {
    handleCreateGroup() {
      if(this.isValidate()) {
        let formData = new FormData();
        formData.append('name', this.groupName)
        formData.append('type', this.typeGroup)
        formData.append('introduce', this.introduce)
        formData.append('avatar', this.avatarImage)
        formData.append('cover_image', this.coverImage)
        api.createGroup(formData).then((response) => {
          this.groupCreateId = _.get(response, 'data.data', '')
          this.$router.push({ name: 'GroupDetail', params: { id: this.groupCreateId } });
          this.resetError();
          this.resetForm();
          this.$message({
            message: 'Tạo nhóm thành công',
            type: 'success'
          });
        }).catch((error)=>{
          let errors = _.get(error.response, 'data.error', {});
          let status = _.get(error, "response.status");
          if (status === 400) {
            if (Object.keys(errors).length > 0) {
              this.errorGroupName = _.get(errors, 'name[0]', "")
              this.errorTypeGroup = _.get(errors, 'type[0]', "")
              this.errorCoverImage = _.get(errors, 'cover_image[0]', "")
              this.errorAvatar = _.get(errors, 'avatar[0]', "")
            }
          } else {
            if (Object.keys(errors).length === 0) {
              this.$message.error({
                type: 'error',
                message: "Có lỗi xảy ra, vui lòng thử lại sau."
              })
            }
          }
        })
      }
    },
    changeCoverImage(file) {
      this.coverImageUrl = URL.createObjectURL(file.raw);
      this.coverImage = file.raw
    },
    changeAvatar(file) {
      this.avatarUrl = URL.createObjectURL(file.raw);
      this.avatarImage = file.raw
    },
    isValidate() {
      let error = false;
      this.resetError();
      if(this.groupName === '') {
        error = true;
        this.errorGroupName = 'Tên nhóm không được để trống!'
      }
      if(!this.typeGroup) {
        error = true
        this.errorTypeGroup = 'Kiểu nhóm không được để  trống!'
      }
      if(!this.avatarImage) {
        error = true;
        this.errorAvatar = 'Ảnh đại diện không được để trống!'
      }
      if(!this.coverImage) {
        error = true;
        this.errorCoverImage = 'Ảnh bìa không được để trống!'
      }
      return !error;
    },
    resetForm() {
      this.groupName = '';
      this.typeGroup = '';
      this.avatarImage = '';
      this.coverImage = '';
      this.introduce = '';
      this.coverImageUrl = '';
      this.avatarUrl ='';
    },
    resetError() {
      this.errorGroupName = '';
      this.errorTypeGroup = '';
      this.errorCoverImage = '';
      this.errorAvatar = '';
    }
  },
  watch: {
    groupName() {
      this.errorGroupName = '';
    },
    typeGroup() {
      this.errorTypeGroup = '';
    },
    avatarImage: {
      handler: function() {
        this.errorAvatar = ''
      },
      deep: true
    },
    coverImage: {
      handler: function() {
        this.errorCoverImage = ''
      },
      deep: true
    }
  }
}

</script>

<style lang="scss" scoped>
.group--container {
  margin-top: 10px;
  .group--sidebar {
    background-color: #ffffff;
    width: 20%;
    text-align: left;
    padding: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    min-height: 93.8vh;
    ul {
      border: none;
      list-style: none;
      padding-left: 0px !important;
      li {
        padding: 0 10px !important;
        margin-bottom: 10px;
        cursor: default; /* remove pointer cursor on hover */
        .el-input::v-deep {
          .el-input__inner {
            height: 50px !important;
          }
        }
        .el-select::v-deep{
          width: 100%;
          .el-input--suffix {
            .el-input__inner {
              height: 50px;
            }
          }
        }
      }
    }
    h4 {
      font-weight: 600;
      padding: 0 10px;
    }
    .search--group {
      padding: 0 10px;
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
    .group--sidebar__navbox {
      width: 100%;
    }
    .group--sidebar__nav {
      background-color: #ffffff;
      pointer-events: none;
    }
    .infor__admin {
      line-height: 22px !important;
      margin-left: 10px;
      p {
        margin: 0 !important;
        font-weight: 600;
      }
    }
    .group__name {
      width: 100%;
    }
  }
  .upload__image {
    padding: 0 10px !important;
    margin-bottom: 20px;
  }
  .button__create {
    margin-left: 10px;
  }
  .group--sidebar ul li:hover,
  .group--sidebar ul li:focus {
    background-color: transparent; /* remove background color on hover, focus, and click */
    color: inherit; /* inherit text color on hover, focus, and click */
    text-decoration: none; /* remove underline on hover, focus, and click */
    outline: none; /* remove outline on focus */
  }
  .list__nav:hover {
    background-color: #ccc !important;
  }
  .group--content {
    width: calc(100% - 20%);
    .preview__group {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      padding: 10px;
      background-color: #ffffff;
      width: 80%;
      height: auto;
      margin: 0 auto;
      .preview__group__content {
        border: 1px solid #ccc;
        border-radius: 10px;
        img {
          border-radius: 10px;
          opacity: 0.5;
        }
        .group__generality {
          color: #bbbbbb;
          pointer-events: unset;
          padding: 20px;
          text-align: left;
          h3 {
            font-weight: 600;
          }
          .line {
            width: 100%;
            border-bottom: 1px solid #ccc;
          }
          .group__generality__nav {
            list-style: none;
            width: 100%;
            padding: 10px;
            margin-bottom: 0 !important;
            li {
              cursor: no-drop;
              text-decoration: none;
              display: inline-block;
              padding: 10px;
              font-weight: 600;
            }
          }
        }
        .group__generality__intro {
          height: 100px;
          background-color: #F2F3F5;
          border-top: 1px solid #ccc;
          padding: 20px;
          div {
            background-color: #ffffff;
            height: 60px;
            line-height: 30px;
            text-align: left;
            padding: 10px;
            p {
              font-weight: 600;
              color: #cccccc;
            }
          }
        }
      }
    }
  }
}
.error {
  color: #ff0000;
}


.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.el-upload:hover {
  border-color: #409EFF !important;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: 1px dashed  #ccc;
  border-radius: 5px;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>