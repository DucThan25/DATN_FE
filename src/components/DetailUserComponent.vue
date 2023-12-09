<template>
  <div>
    <div class="profile-banner">
      <div class="profile-banner__cover-image-box">
        <div class="cover-image">
          <img v-if="user?.cover_image" :src="user?.cover_image" alt="">
          <img v-else :src="require('@/assets/images/userdefault.jpg')" alt="">
          <div v-if="(user?.id) && authUser.data.id === user.id" class="p-2 btn-update-cover-image" @click="changeCoverImage">
            <span><i class="el-icon-camera-solid"></i> Chỉnh sửa ảnh bìa1</span>
            <input type="file" ref="changeCoverImage" class="input--hidden" @change="updateCoverImage()">
          </div>
        </div>
        <div class="base-info-box d-flex">
          <div class="avatar-box">
            <img v-if="user?.avatar" :src="user?.avatar" alt="">
            <img v-else :src="require('@/assets/images/userdefault.jpg')" alt="">
            <span v-if="(user?.id) && authUser.data.id === user.id" @click="changeAvatar"><i class="el-icon-camera-solid"></i></span>
            <input type="file" ref="changeAvatar" class="input--hidden" @change="updateAvatar()">
          </div>
          <div class="base-info">
            <h2>{{user?.name}}</h2>
            <small>{{friends.length}} bạn bè</small>
            <button v-if="(user?.id) && authUser.data.id === user.id" class="btn-update-info" @click="openDialogChangeInfo(user)"><b-icon-pencil-fill></b-icon-pencil-fill> Chỉnh sửa thông tin cá nhân</button>
          </div>
        </div>
        <div class="more-option-friend" v-if="user.id !== authUser.data.id">
          <button v-if="checkFriend === STATUS_FRIEND['IRRELEVANT']" class="btn btn-primary btn-action" @click="requestAddFriend(user.id)"><b-icon-person-plus-fill></b-icon-person-plus-fill> Thêm bạn bè</button>
          <button v-if="checkFriend === STATUS_FRIEND['INVITATION_SENT']" class="btn btn-primary btn-action" @click="deleteAddFriend(user?.id)"><b-icon-person-dash-fill></b-icon-person-dash-fill> Huỷ lời mời</button>
          <div v-if="checkFriend === STATUS_FRIEND['INVITED']">
            <button class="btn btn-primary btn-action " @click="confirmFriend(user?.id)"><b-icon-person-check-fill></b-icon-person-check-fill> Xác nhận kết bạn</button>
            <button class="btn btn-secondary btn-action btn-dont-confirm" @click="deleteAddFriend(user?.id)">Huỷ</button>
          </div>
          <button @click="handleRemoveFriend(user)" v-if="checkFriend === STATUS_FRIEND['CONFIRMED']" class="btn btn-primary btn-action"><b-icon-person-x-fill></b-icon-person-x-fill> Huỷ kết bạn</button>
        </div>
        <div class="line-box">
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="profile--content">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane name="first" tabindex="0" label="Bài viết">
          <div class="profile--content__intro">
            <h5>Giới thiệu</h5>
            <div class="intro-detail mt-3">
              <p v-if="user?.introduce">{{user?.introduce}}</p>
              <p v-if="user?.date"><b>Ngày sinh: </b> {{dateFomat(user?.date)}}</p>
              <p v-if="user?.gender"><b>Giới tính: </b> {{user?.gender_text}}</p>
              <p v-if="user?.address"><b>Địa chỉ: </b> {{user?.address}}</p>
              <p v-if="user?.email"><b>Địa chỉ email: </b>{{user?.email}}</p>
            </div>
          </div>
          <div class="profile--content__posts">
            <div class="box__status p-3" v-if="(user?.id) && authUser.data.id === user.id" @click="openDialogCreatePost()">
              <el-row>
                <el-col :span="2">
                  <el-avatar v-if="user?.avatar" :size="44" :src="user?.avatar"></el-avatar>
                  <el-avatar v-else :size="44" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                </el-col>
                <el-col :span="22">
                  <div class="status">{{authUser?.data?.name}} ơi, Bạn đang nghĩ gì thế?</div>
                </el-col>
              </el-row>
            </div>
            <div class="box__status mt-4 mb-2" v-for="(post, index) in userPost" :key = "index">
              <PostComponent @eventLikePost="eventLikePost($event)" @dataPostDetail="openDialogPostDetail($event)"  @postUpdate="editPost($event)" @postDelete="deletePost($event)" :post = post></PostComponent>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="second" tabindex="1" label="Bạn bè">
          <div class="list-friend-container">
            <div class="list-friend-header">
              <h5>Bạn bè</h5>
              <div class="list-friend__option">
                <input type="text"
                       placeholder="Nhập tên để tìm kiếm 1"
                       v-model="searchFriend"
                       v-debounce="500"
                       @change="friendSearch()">
                <span v-if="(user?.id) && authUser.data.id === user.id" class="request--add--friend">Lời mời kết bạn</span>
              </div>
            </div>
            <div class="list-friend__content">
              <div class="item--friend" v-for="(friend, index) in friends" :key="index">
                <div class="d-inline-block item--friend__box">
                  <div class="d-flex item--friend__container">
                    <router-link :to="{name: 'ProfileView', params: {id: friend?.id}}">
                      <div class="item--friend__avatar">
                        <img v-if="friend?.avatar" width="" :src="friend?.avatar" alt="">
                        <img v-else width="" :src="require('@/assets/images/userdefault.jpg')" alt="">
                      </div>
                    </router-link>
                    <div class="d-inline-block info__friend">
                      <router-link :to="{name: 'ProfileView', params: {id: friend?.id}}">
                        <h5>{{friend?.name}}</h5>
                      </router-link>
                      <small>{{friend?.friends_count}} Bạn bè</small>
                    </div>
                  </div>
                </div>
                <div v-if="(user?.id) && authUser.data.id === user.id" class="d-inline-block item--friend__option">
                  <el-tooltip class="item" effect="dark" content="Huỷ kết bạn" placement="top-start">
                    <b-icon-person-x @click="handleRemoveFriend(friend)"></b-icon-person-x>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog width="30%" title="Tạo bài viết" :visible.sync="dialogCreatePost">
      <el-input
          type="textarea"
          autosize
          placeholder="Nhập tiêu đề bài viết"
          v-model="title">
      </el-input>
      <div v-if="this.errorTitle !== '' " class="error">
        <span> {{ errorTitle }} </span>
      </div>
      <div class="my-2"></div>
      <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="Nhập nội dung bài viết"
          v-model="content">
      </el-input>
      <div v-if="this.errorContent !== '' " class="error">
        <span> {{ errorContent }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
          <button class="btn btn-primary" @click="handleCreatePost">Đăng</button>
        </span>
    </el-dialog>
    <el-dialog width="30%" title="Sửa bài viết" :visible.sync="dialogEditPost">
      <el-input
          type="textarea"
          autosize
          placeholder="Nhập tiêu đề bài viết"
          v-model="title">
      </el-input>
      <div v-if="this.errorTitle !== '' " class="error">
        <span> {{ errorTitle }} </span>
      </div>
      <div class="my-2"></div>
      <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="Nhập nội dung bài viết"
          v-model="content">
      </el-input>
      <div v-if="this.errorContent !== '' " class="error">
        <span> {{ errorContent }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
          <button class="btn btn-primary" @click="handleUpdatePost">Lưu bài viết</button>
        </span>
    </el-dialog>
    <el-dialog width="38%" top="3%" :title="'Bài viết của ' + postDetail?.user?.name" :visible.sync="dialogPostDetail" @close="getInfoUser($route.params.id)">
      <DialogPostDetail @eventLikePost="eventLikePost($event)"  :checkMoreOption="checkMoreOption" :postDetail="this.postDetail" @add-comment="handleCreateComment($event)" @eventDeleteComment="handleDeleteComment($event)" @eventUpdateContentComment="handleUpdateComment($event)"></DialogPostDetail>
    </el-dialog>
    <el-dialog title="Đổi thông tin cá nhân" :visible.sync="updateInfo">
      <el-form>
        <div class="mb-2">
          <label for="exampleInputEmail1">Tên <span class="text-danger">*</span></label>
          <input v-model="changeInfo.name" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Nhập tên của bạn">
          <small id="emailHelp" class="form-text"><span class="text-danger">{{infoError.name}}</span></small>
        </div>
        <div class="mb-2">
          <label for="exampleInputEmail1">Địa chỉ</label>
          <el-input
              type="textarea"
              :autosize="{ minRows: 3}"
              placeholder="Nhập địa chỉ của bạn"
              v-model="changeInfo.address">
          </el-input>
        </div>
        <div class="form-row row mb-2">
          <div class="form-group col-6">
            <label for="inputEmail4" class="d-block">Ngày sinh</label>
            <el-date-picker
                v-model="changeInfo.date"
                type="date"
                format="dd/MM/yyyy"
                placeholder="Chọn ngày sinh">
            </el-date-picker>
          </div>
          <div class="form-group col-6">
            <label for="inputPassword4" class="d-block">Giới tính</label>
            <el-select v-model="changeInfo.gender" placeholder="Chọn giới tính">
              <el-option
                  v-for="item in gender"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-2">
          <label for="exampleInputEmail1">Giới thiệu</label>
          <el-input
              type="textarea"
              :autosize="{ minRows: 3}"
              placeholder="Giới thiệu 1 chút về bạn nào"
              v-model="changeInfo.introduce">
          </el-input>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer-info">
        <el-button @click="closeDialogChangeInfo()">Huỷ</el-button>
        <el-button type="primary" @click="handleUpdateInfo">Lưu</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import api from '@/api'
import PostComponent from "@/components/PostComponents";
import DialogPostDetail from "@/components/DialogPostDetail";
import _ from 'lodash'
import {GENDER, STATUS_FRIEND} from "@/utils/constants";
import {dateFormat} from "@/utils/helpers"
import moment from "moment";

export default {
  name: 'DetailUserComponent',
  components: {PostComponent, DialogPostDetail},
  computed: {
    ...mapState("auth", ["authUser"]),
  },

  data() {
    return {
      activeName: 'first',
      checkFriend: '',
      STATUS_FRIEND,
      updateInfo: false,
      searchFriend: '',
      user: [],
      dialogEditPost: false,
      title:'',
      content: '',
      postId:'',
      checkMoreOption: false,
      dialogPostDetail: false,
      postDetail: [],
      dialogCreatePost: false,
      errorTitle:'',
      errorContent: '',
      friends: [],
      userPost: [],
      changeInfo: {
        name: '',
        address: '',
        date: '',
        gender:'',
        introduce:''
      },
      infoError: {
        name: '',
        email: '',
        date: ''
      },
      gender: [{
        value: GENDER['MALE'],
        label: 'Nam'
      }, {
        value: GENDER['FEMALE'],
        label: 'Nữ'
      }],
    }
  },
  methods: {
    requestAddFriend(id)
    {
      api.requestAddFriend(id). then(()=>{
        this.getInfoUser(this.$route.params.id);
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
    deleteAddFriend(id)
    {
      api.deleteAddFriend(id).then(() => {
        this.getInfoUser(this.$route.params.id);
        this.$router.push({name: 'RequestAddFriendView'})
        this.$emit('confirmRequest');
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
        this.getInfoUser(this.$route.params.id);
        this.$router.push({name: 'ListFriendView'})
        this.$emit('confirmFriend');
        this.$message({
          type: 'success',
          message: "Kết bạn thành công"
        })
        this.$router.push({name: 'RequestAddFriendView'})
        this.$emit('confirmRequest');
      }).catch(() => {
        this.$message({
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
          this.getInfoUser(this.$route.params.id);
          this.$router.push({name: 'ListFriendView'})
          this.$emit('confirmFriend');
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
    closeDialogChangeInfo()
    {
      this.resetError()
      this.resetForm()
      this.updateInfo = false
    },
    dateFomat(date)
    {
      return dateFormat(date)
    },
    updateAvatar()
    {
      let formData = new FormData();
      formData.append('name', this.authUser.data.name)
      formData.append('avatar', this.$refs.changeAvatar.files[0])
      api.updateImage(formData).then(() => {
        this.getInfoUser(this.$route.params.id);
        this.$message ({
          type: 'success',
          message: 'Cập nhật ảnh thành công'
        })
      }).catch(()=>{
        this.$message ({
          type: 'error',
          message: 'Có lỗi xảy ra, vui lòng tử lại!'
        })
      })
    },
    changeCoverImage()
    {
      this.$refs.changeCoverImage.click()
    },
    updateCoverImage()
    {
      let formData = new FormData();
      formData.append('name', this.authUser.data.name)
      formData.append('cover_image', this.$refs.changeCoverImage.files[0])
      api.updateImage(formData).then(() => {
        this.getInfoUser(this.$route.params.id);
        this.$message ({
          type: 'success',
          message: 'Cập nhật ảnh thành công'
        })
      }).catch(()=>{
        this.$message ({
          type: 'error',
          message: 'Có lỗi xảy ra, vui lòng tử lại!'
        })
      })
    },
    changeAvatar()
    {
      this.$refs.changeAvatar.click()
    },
    openDialogChangeInfo(user)
    {
      this.changeInfo.name = user.name
      this.changeInfo.address = user.address
      if(user.date) {
        this.changeInfo.date = moment(user.date).format('l')
      }
      this.changeInfo.gender = user.gender
      this.changeInfo.introduce = user.introduce
      this.updateInfo = true
    },
    handleUpdateInfo()
    {
      if(this.changeInfo.name === '') {
        this.infoError.name = 'Tên không được để trống !'
      }else {
        let formData = new FormData()
        formData.append('name', this.changeInfo.name)
        formData.append('address', this.changeInfo.address)
        if(this.changeInfo.date) {
          formData.append('date', moment(this.changeInfo.date).format('DD-MM-YYYY'))
        }
        formData.append('gender', this.changeInfo.gender)
        formData.append('introduce', this.changeInfo.introduce)
        api.updateInfo(formData).then(()=>{
          this.closeDialogChangeInfo()
          this.getInfoUser(this.$route.params.id);
          this.$message({
            type: 'success',
            message: "Đổi thông tin thành công"
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "Có lỗi xảy ra, vui lòng thử lại sau."
          })
        })
      }
    },
    friendSearch()
    {
      let data = {}
      if(this.searchFriend) {
        data.q = this.searchFriend
      }
      api.getProfileUser(this.$route.params.id, data).then((response)=> {
        this.user = _.get(response,'data.data.user',[]);
        this.friends = _.get(response,'data.data.friends',[]);
        this.userPost = _.get(response,'data.data.userPost',[]);
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    openDialogCreatePost()
    {
      this.dialogCreatePost = true
      this.resetForm()
      this.resetError()
    },
    handleUpdateComment(data)
    {
      let params = {
        content: data.commentUpdate
      }
      api.updateComment(params, data.idComment).then(() => {
        this.$message({
          type: 'success',
          message: "Cập nhật bình luận thành công"
        })
        this.detailPost(data.idPost)
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    handleDeleteComment(data)
    {
      api.deleteComment(data.idCommentDelete).then(() => {
        this.$message({
          type: 'success',
          message: "Xoá bình luận thành công"
        })
        this.detailPost(data.idPost)
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    handleCreateComment(dataAddComment)
    {
      if(dataAddComment.contentComment === '') {
        this.$message({
          message: 'Nội dung bình luận không được để trống',
          type: 'error'
        })
      }else {
        let data = {
          content: dataAddComment.contentComment
        }
        api.createComment(dataAddComment.postDetail.id, data). then(() =>{
          this.detailPost(dataAddComment.postDetail.id);
          this.$message({
            message: 'Bình luận thành công',
            type: 'success'
          })
        }).catch((error)=>{
          let errors = _.get(error.response, 'data.error', {});
          let status = _.get(error, "response.status");
          if (status === 400) {
            if (Object.keys(errors).length > 0) {
              this.errorContent = _.get(errors, 'content[0]', "")
              this.$message.error({
                type: 'error',
                message:  this.errorContent
              })
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
    handleUpdatePost()
    {
      if(this.validateCreate()) {
        let data = {
          title: this.title,
          content: this.content
        }
        api.updatePost(data, this.postId).then(() => {
          this.$message({
            message: 'Sửa bài viết thành công',
            type: 'success'
          });
          this.dialogEditPost = false
          this.getInfoUser(this.$route.params.id);
          this.resetError()
          this.resetForm()
        }).catch((error)=>{
          let errors = _.get(error.response, 'data.errors', {});
          let status = _.get(error, "response.status");
          if (status === 422) {
            if (Object.keys(errors).length > 0) {
              this.errorTitle = _.get(errors, 'title[0]', "")
              this.errorContent = _.get(errors, 'content[0]', "")
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
    handleCreatePost()
    {
      if(this.validateCreate()) {
        let data = {
          title: this.title,
          content: this.content
        }
        api.createPost(data).then(() => {
          this.$message({
            message: 'Tạo bài viết thành công',
            type: 'success'
          });
          this.dialogCreatePost = false
          this.getInfoUser(this.$route.params.id);
          this.resetError()
          this.resetForm()
        }).catch((error)=>{
          let errors = _.get(error.response, 'data.errors', {});
          let status = _.get(error, "response.status");
          if (status === 422) {
            if (Object.keys(errors).length > 0) {
              this.errorTitle = _.get(errors, 'title[0]', "")
              this.errorContent = _.get(errors, 'content[0]', "")
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
    validateCreate()
    {
      let error = false
      this.resetError()
      if (this.title.length === 0) {
        error = true;
        this.errorTitle = 'Tiêu đề không được để trống';
      }
      if (this.content.length === 0) {
        error = true;
        this.errorContent = 'Nội dung không được để trống';
      }
      return !error;
    },
    deletePost(postNeedDelete)
    {
      api.deletePost(postNeedDelete.id).then(() => {
        this.$message({
          message: 'Xoá bài viết thành công',
          type: 'success'
        });
        this.getInfoUser(this.$route.params.id);
      }).catch(() => {
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    editPost(postNeedEdit)
    {
      this.dialogEditPost = true;
      this.title = postNeedEdit.title
      this.content = postNeedEdit.content
      this.postId = postNeedEdit.id
      this.resetError();
    },
    detailPost(id)
    {
      api.detailPost(id).then((response) => {
        this.postDetail = _.get(response,'data.data',[]);
      }).catch((error)=>{
        let errors = _.get(error.response, 'data.errors', {});
        if (Object.keys(errors).length === 0) {
          this.$message.error({
            type: 'error',
            message: "Có lỗi xảy ra, vui lòng thử lại sau."
          })
        }

      })
    },
    openDialogPostDetail(dataPostDetail)
    {
      this.checkMoreOption = true
      this.dialogPostDetail = dataPostDetail.openPostDetail
      this.postDetail = dataPostDetail.postDetail
    },
    eventLikePost(post)
    {
      api.likePost(post.id).then(() => {
        this.getInfoUser(this.$route.params.id);
        this.detailPost(post.id)
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getInfoUser(id)
    {
      api.getProfileUser(id).then((response)=> {
        this.user = _.get(response,'data.data.user',[]);
        this.friends = _.get(response,'data.data.friends',[]);
        this.userPost = _.get(response,'data.data.userPost',[]);
        this.checkFriend = _.get(response, 'data.data.checkFriend', '')
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    resetForm()
    {
      this.title = "";
      this.content = '';
      this.postId = ''
      this.changeInfo.name = ''
      this.changeInfo.date = ''
      this.changeInfo.gender = ''
      this.changeInfo.address = ''
      this.changeInfo.introduce = ''
    },
    resetError()
    {
      this.errorTitle = "";
      this.errorContent = '';
      this.infoError.name = ''
      this.infoError.date = ''
      this.infoError.gender = ''
      this.infoError.address = ''
    },
    handleClick() {

    },
  },
  watch: {
    '$route.params': {
      immediate: true,
      handler: function() {
        this.getInfoUser(this.$route.params.id);
        this.activeName = 'first'
      },
    },
    'changeInfo.name': {
      handler: function() {
        this.infoError.name = ''
      },
    },
    title()
    {
      this.errorTitle = ''
    },
    content ()
    {
      this.errorContent = ''
    }
  },
  mounted() {
    this.getInfoUser(this.$route.params.id);
  }
}

</script>

<style lang="scss" scoped>
.profile-banner {
  margin-top: 10px;
  background-image: linear-gradient(to top, #FFFFFF, rgba(255,255,255.9), rgba(255,255,255,.7), rgba(255,255,255,.4), rgba(255,255,255,0));
  .profile-banner__cover-image-box {
    width: 80%;
    margin: auto;
    .cover-image {
      position: relative;
      img {
        width: 100%;
        height: 460px;
        border-radius: 10px;
      }
      .btn-update-cover-image {
        cursor: pointer;
        position: absolute;
        bottom: 20px;
        right: 40px;
        background-color: rgba(0, 0, 0, 0.4);
        display: inline;
        border-radius: 5px;
      }
    }
    .more-option-friend {
      padding: 0 30px;
      width: 100%;
      text-align: right !important;
      margin:0 0 10px 0 !important;
      .btn-action {
        font-weight: 600;
        color: #ffffff;
      }
      .btn-dont-confirm {
        margin-left: 10px;
        padding-left: 20px;
        padding-right: 20px;
      }
    }
    .base-info-box {
      padding: 30px;
      text-align: left;
      height: 160px;
      .avatar-box {
        margin-right: 20px;
        position: relative;
        span {
          cursor: pointer;
          font-size: 20px !important;
          position: absolute;
          bottom: -5px;
          right: 8px;
          width: 35px;
          height: 35px;
          text-align: center;
          line-height: 35px;
          border-radius: 50%;
          background-color: #ccc;
        }
        img {
          position: relative;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 4px solid #ffffff;
          top: -60px;
        }
      }
      .base-info {
        width: calc(100% - 180px);
        display: inline-block;
        h2 {
          font-weight: 700;
        }
        small {
          color: #65676B;
        }
        .btn-update-info {
          border: none;
          background-color: #E4E6EB;
          padding: 5px 10px;
          border-radius: 5px;
          float: right;
        }
      }
    }
    .line-box {
      padding: 0 30px;
    }
    .line {
      width: 100%;
      display: block;
      border-bottom: 1px solid #ccc;
    }
  }
}
.profile--content {
  .el-tabs::v-deep{
    .el-tabs__header{
      margin: 0 0 10px;
      .el-tabs__nav-wrap {
        width: 100%;
        background-color: #ffffff;
        border-bottom: 1px solid #ccc;
        .el-tabs__nav-scroll {
          width: 80%;
          padding: 0 30px;
          background-color: #ffffff !important;
          margin: auto;
          .el-tabs__nav {
            border: unset;
            .el-tabs__item {
              font-weight: 600 !important;
              height: 50px;
              line-height: 50px;
              border: unset;
            }
          }
        }
      }
    }
    .el-tabs__content {
      width: 80%;
      padding: 0 30px;
      margin: auto;
      .el-tab-pane {
        width: 100%;
        display: flex;
        .profile--content__intro {
          height: max-content;
          width: 39.25%;
          margin-right: 0.75%;
          text-align: left;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          background-color: #ffffff;
          border-radius: 10px;
          padding: 15px;
          h5 {
            font-weight: 600;
          }
        }
        .profile--content__posts {
          width: 59.25%;
          margin-left: 0.75%;
          text-align: left;
          .box__status {
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            background-color: #fff;
            text-align: left;
          }
        }
        .list-friend-container {
          width: 100%;
          text-align: left;
          background-color: #ffffff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 10px 15px;
          .list-friend-header {
            border-bottom: 1px solid #ccc;
            height: 50px;
            h5 {
              line-height: 50px;
              font-weight: 600;
              display: inline-block;
            }
            .list-friend__option {
              float: right;
              input {
                width: 250px;
                margin-right: 10px;
                display: inline-block;
                border: 1px solid #ccc;
                padding: 5px 10px;
                outline: none;
              }
              .request--add--friend {
                padding: 10px;
                height: 38px;
                line-height: 38px;
                color: #409EFF;
                border-radius: 5px;
                cursor: pointer;
              }
              .request--add--friend:hover {
                text-decoration: underline;
                background-color: #ccc;
              }
            }
          }
          .list-friend__content {
            padding: 10px 0;
            display: inline-block;
            width: 100%;
            .item--friend {
              padding: 15px;
              display: inline-block;
              width: 49.3%;
              margin: 0.35%;
              border-radius: 10px;
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
              .item--friend__box {
                cursor: pointer;
                width: 80%;
                .item--friend__container {
                  align-items: center;
                  .item--friend__avatar {
                    img {
                      width: 80px;
                      height: 80px;
                      border-radius: 10px;
                      object-fit: cover;
                    }
                  }
                  .info__friend {
                    padding: 15px;
                    h5 {
                      margin-bottom: 0 !important;
                      font-weight: 600;
                      display: block;
                    }
                  }
                }
              }
              .item--friend__option {
                font-size: 22px;
                width: 20%;
                text-align: right;
                svg {
                  cursor: pointer;
                  outline: none;
                }
              }
            }
          }

        }
      }
    }
  }
}
.input--hidden {
  display: none;
}

</style>