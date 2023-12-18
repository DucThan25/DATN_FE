<template>
  <div class="home__container">
    <label for="">
      <span class="label" title="Chat room">
        <span class="icon">
          <router-link :to="{name: 'ChatRoomView'}">
            <i class="el-icon-edit-outline" style="color: crimson;" ></i>
          </router-link>
        </span>
      </span>
    </label>
    
    <el-row>
      <el-col :span="5">
        <div class="grid-content"><p> </p></div>
      </el-col>
      <el-col :span="6" class="nav__left">
        <div class="">
          <el-menu class="nav__menu">
            <el-menu-item index="1" class="list__nav">
              <el-avatar v-if="authUser?.data?.avatar" :size="37" :src="authUser?.data?.avatar"></el-avatar>
              <el-avatar v-else :size="37" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
              <router-link :to="{ name: 'ProfileView', params: {id: authUser?.data?.id} }">
                <span>{{authUser?.data?.name}}</span>
              </router-link>
            </el-menu-item>
            <div class="border__buttom__nav"></div>
            <div class="list__group">
              <div class="list__group__description">
                <el-menu-item index="1" class="list__nav">
                  <!-- <b-icon-people-fill></b-icon-people-fill> -->
                  <router-link :to="{name: 'FriendView'}">
                    <b-icon-people-fill style="margin-left: 10px;" font-scale="1.3"></b-icon-people-fill>
                    <h6> Bạn bè</h6>
                  </router-link>
                </el-menu-item>
              </div>
              <div class="list__group__description">
                <el-menu-item index="1" class="list__nav">
                 
                  <router-link :to="{name: 'ListGroupJoinedView'}">
                    <b-icon-people-fill style="margin-left: 10px;" font-scale="1.3"></b-icon-people-fill>
                    <h6>Nhóm</h6>
                  </router-link>
                </el-menu-item>
              </div>
              <!-- <div class="border__buttom__nav"></div> -->
              <!-- <div class="list__group__description">
                <h6>Lời mời kết bạn</h6>
                <span class="view__all">
                  <router-link :to="{name: 'RequestAddFriendView'}">
                  <a>Xem tất cả</a>
                </router-link>
                </span>
              </div>
              <el-menu v-if="listRequestAddFriend" class="nav__menu nav__group nav__list-friend nav__list--add--friend" active-text-color="#000000">
                <el-menu-item index="1" class="list__nav add__friend" v-for="(requestAddFriend, index) in listRequestAddFriend" :key="index">
                  <el-row>
                    <el-col :span="5">
                      <router-link :to="{ name: 'ProfileView', params: {id: requestAddFriend?.id} }">
                        <el-avatar v-if="requestAddFriend?.avatar" :size="60" :src="requestAddFriend?.avatar"></el-avatar>
                        <el-avatar v-else :size="60" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                      </router-link>
                    </el-col>
                    <el-col :span="19">
                      <router-link :to="{ name: 'ProfileView', params: {id: requestAddFriend?.id} }">
                        <span class="d-block">{{requestAddFriend?.name}}</span>
                      </router-link>
                      <button class="btn btn-primary px-4 py-1 mx-2" @click="confirmFriend(requestAddFriend?.id)">Xác nhận</button>
                      <button class="btn btn-secondary px-4 py-1" @click="deleteAddFriend(requestAddFriend?.id)">Xoá</button>
                    </el-col>
                  </el-row>
                </el-menu-item>
              </el-menu> -->

              <div class="border__buttom__nav"></div>
              
              <!-- <div class="list__group__description">
                <h6>Danh sách bạn bè của bạn</h6>
                <span class="view__all">
                   <router-link :to="{name: 'ListFriendView'}">
                  <a>Xem tất cả bạn bè</a>
                </router-link>
                </span>
              </div>
              <el-menu v-if="listFriend" class="nav__menu nav__group nav__list-friend" active-text-color="#000000">
                <el-menu-item index="1" class="list__nav" v-for="(friend,index) in listFriend" :key="index">
                  <router-link :to="{ name: 'ProfileView', params: {id: friend?.id} }">
                    <el-avatar v-if="friend?.avatar" :size="37" :src=friend?.avatar></el-avatar>
                    <el-avatar v-else :size="37" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                    <span>{{friend?.name}}</span>
                  </router-link>
                </el-menu-item>
              </el-menu> -->

              <div class="list__group__description">
                <h6>Nhóm đã tham gia</h6>
                <!-- <router-link :to="{name: 'ListGroupJoinedView'}">
                  <span class="view__all"><a href="">Xem tất cả</a></span>
                </router-link> -->
              </div>
              <div class="area__read1">
              <el-menu v-if="groupJoined" class="nav__menu nav__group nav__list-group" active-text-color="#000000">
                <el-menu-item v-for="(item, index) in groupJoined" :key="index" class="list__nav">
                  <router-link :to="{name: 'GroupDetail', params: {id: item?.group_id}}">
                  <el-image
                      :src="item?.group?.avatar"
                      class="nav__avatar__group"></el-image>
                  <span>{{item?.group?.name}}</span>
                  </router-link>
                </el-menu-item>
              </el-menu>
              </div>

              <div class="border__buttom__nav"></div>
            </div>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="14">
        <el-row>
          <el-col :span="4">
            <div class="grid-content"><p> </p></div>
          </el-col>
          <el-col :span="16">
            <div class="box__status p-3" @click="openDialogCreatePost()">
              <el-row>
                <el-col :span="2">
                  <el-avatar v-if="authUser?.data?.avatar" :size="44" :src="authUser?.data?.avatar"></el-avatar>
                  <el-avatar v-else :size="44" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                </el-col>
                <el-col :span="22">
                  <div class="status">{{authUser?.data?.name}} ơi, Bạn đang nghĩ gì thế?</div>
                </el-col>
              </el-row>
              <div class="border__status__nav"></div>
              <el-row>
                <el-col :span="8" style="text-align: center;">
                  <b-icon-camera-video-fill style="color:red ;"></b-icon-camera-video-fill> Video trực tiếp
                </el-col>
                <el-col :span="8" style="text-align: center;">
                  <b-icon-images style="color:green ;"></b-icon-images> Ảnh/Video
                </el-col>
                <el-col :span="8" style="text-align: center;">
                  <b-icon-emoji-smile style="color:yellow ;"></b-icon-emoji-smile> Cảm xúc
                </el-col>
              </el-row>
            </div>
            <div class="box__status box__post mt-4 mb-2" v-for="(post, index) in listPost" :key = "index">
              <PostComponent @eventLikePost="eventLikePost($event)" @dataPostDetail="openDialogPostDetail($event)"  @postUpdate="editPost($event)" @postDelete="deletePost($event)" :post = post></PostComponent>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content"><p> </p></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5" class="nav__right">
        <div class="list__group mt-1">
          <div class="list__group__description">
            <h6>Lời mời kết bạn</h6>
            <span class="view__all">
              <router-link :to="{name: 'RequestAddFriendView'}">
              <a>Xem tất cả</a>
            </router-link>
            </span>
          </div>
          <div class="area__read">
          <el-menu v-if="listRequestAddFriend" class="nav__menu nav__group nav__list-friend nav__list--add--friend" active-text-color="#000000">
            <el-menu-item index="1" class="list__nav add__friend" v-for="(requestAddFriend, index) in listRequestAddFriend" :key="index">
              <el-row>
                <el-col :span="5">
                  <router-link :to="{ name: 'ProfileView', params: {id: requestAddFriend?.id} }">
                    <el-avatar v-if="requestAddFriend?.avatar" :size="60" :src="requestAddFriend?.avatar"></el-avatar>
                    <el-avatar v-else :size="60" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                  </router-link>
                </el-col>
                <el-col :span="19">
                  <router-link :to="{ name: 'ProfileView', params: {id: requestAddFriend?.id} }">
                    <h6 class="d-block">{{requestAddFriend?.name}}</h6>
                  </router-link>
                  <button class="btn btn-primary  mx-3" @click="confirmFriend(requestAddFriend?.id)">Xác nhận</button>
                  <button class="btn btn-secondary " @click="deleteAddFriend(requestAddFriend?.id)">Xoá</button>
                </el-col>
              </el-row>
            </el-menu-item>
          </el-menu>
        </div>

          <div class="border__buttom__nav"></div>
          <!-- <div class="list__group__description">
            <h6>Nhóm đã tham gia home</h6>
            <router-link :to="{name: 'ListGroupJoinedView'}">
              <span class="view__all"><a href="">Xem tất cả</a></span>
            </router-link>
          </div>
          <el-menu v-if="groupJoined" class="nav__menu nav__group nav__list-group" active-text-color="#000000">
            <el-menu-item v-for="(item, index) in groupJoined" :key="index" class="list__nav">
              <router-link :to="{name: 'GroupDetail', params: {id: item?.group_id}}">
              <el-image
                  :src="item?.group?.avatar"
                  class="nav__avatar__group"></el-image>
              <span>{{item?.group?.name}}</span>
              </router-link>
            </el-menu-item>
          </el-menu> -->
          <div class="list__group__description">
            <h6>Người liên hệ</h6>
          </div>
          <div class="area__read2">
            <el-menu v-if="chats" class="nav__menu nav__group nav__list-group" active-text-color="#000000">
                <el-menu-item v-for="(chat, index) in chats"   :key="index" index="1" class="list__nav">
                <router-link :to="{name: 'ChatPrivateView'}" @click="OpentChat()" v-for="participant in chat.participants" :key="participant.id">
                        <span v-if="authUser?.data?.id != participant.id" >
                          <div class='avatar__comment'>
                            <el-avatar v-if="participant?.avatar" :size="40" :src="participant?.avatar"></el-avatar>
                            <el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                          </div>
                          {{ participant.name }}
                        </span>
                  </router-link>
                </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div class="border__buttom__nav"></div>
        <!-- <div class="list__group">
          <div class="list__group__description">
            <h6>Nhóm của bạn</h6>
            <router-link :to="{name: 'ListMyGroupView'}">
              <span class="view__all"><a href="">Xem tất cả</a></span>
            </router-link>
          </div>
          <div class="area__read1">
          <el-menu v-if="myGroups" class="nav__menu nav__group nav__list-group" active-text-color="#000000">
              <el-menu-item v-for="(myGroup, index) in myGroups" :key="index" index="1" class="list__nav">
                <router-link :to="{name: 'GroupDetail', params: {id: myGroup.id}}">
                <el-image
                    :src="myGroup?.avatar"
                    class="nav__avatar__group"></el-image>
                <span>{{myGroup?.name}}</span>
              </router-link>
              </el-menu-item>
          </el-menu>
        </div>
        </div> -->
      </el-col>
      <el-col :span="5">
        <div class="grid-content"><p> </p></div>
      </el-col>
    </el-row>
    <el-dialog width="30%" title="Tạo bài viết" :visible.sync="dialogCreatePost">
      <label for="">Tiêu đề <span class="text-danger">*</span></label>
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
      <label for="">Nội dung <span class="text-danger">*</span></label>
      <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="Nhập nội dung bài viết"
          v-model="content">
      </el-input>
      <div v-if="this.errorContent !== '' " class="error">
        <span> {{ errorContent }} </span>
      </div>
      <div class="my-2"></div>
      <label for="">Ảnh</label>
      <div>
        <div v-if='!imageUrl' class="image__post" @click="addImagePost"><b-icon-file-earmark-image-fill></b-icon-file-earmark-image-fill></div>
        <input ref="input__image" class="input__image" type='file' @change="changeImagePost()">
      </div>
      <div v-if="this.errorImage !== '' " class="error">
        <span> {{ errorImage }} </span>
      </div>
      <div class="image__preview" v-if='imageUrl'>
        <img :src="imageUrl" alt="">
        <div class="image__preview__option">
          <span @click="addImagePost()"><i class="el-icon-refresh"></i></span><span @click="removeImagePreview()"><i class="el-icon-delete"></i></span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <button class="btn btn-primary" @click="handleCreatePost">Đăng</button>
    </span>
    </el-dialog>
    <el-dialog width="30%" title="Sửa bài viết" :visible.sync="dialogEditPost">
      <label for="">Tiêu đề <span class="text-danger">*</span></label>
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
      <label for="">Nội dung <span class="text-danger">*</span></label>
      <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="Nhập nội dung bài viết"
          v-model="content">
      </el-input>
      <div v-if="this.errorContent !== '' " class="error">
        <span> {{ errorContent }} </span>
      </div>
      <div class="my-2"></div>
      <label for="">Ảnh</label>
      <div>
        <div v-if='!imageUrl' class="image__post" @click="addImagePost">Thêm ảnh2</div>
        <input ref="input__image" class="input__image" type='file' @change="changeImagePost()">
      </div>
      <div v-if="this.errorImage !== '' " class="error">
        <span> {{ errorImage }} </span>
      </div>
      <div class="image__preview" v-if='imageUrl'>
        <img :src="imageUrl" alt="">
        <div class="image__preview__option">
          <span @click="addImagePost()"><i class="el-icon-refresh"></i></span><span @click="removeImageUpdatePreview()"><i class="el-icon-delete"></i></span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <button class="btn btn-primary" @click="handleUpdatePost">Lưu bài viết</button>
    </span>
    </el-dialog>
    <el-dialog width="38%" top="3%" :title="'Bài viết của ' + postDetail?.user?.name" :visible.sync="dialogPostDetail" @close="getPostHome">
      <DialogPostDetail @eventLikePost="eventLikePost($event)"  :checkMoreOption="checkMoreOption" :postDetail="this.postDetail" @add-comment="handleCreateComment($event)" @eventDeleteComment="handleDeleteComment($event)" @eventUpdateContentComment="handleUpdateComment($event)"></DialogPostDetail>
    </el-dialog>
  </div>
</template>
<script>
import PostComponent from "@/components/PostComponents";
import DialogPostDetail from "@/components/DialogPostDetail";
import api from "@/api";
import _ from 'lodash'
import {mapMutations, mapState} from "vuex";
import { echo } from '@/pusher/echo';
export default {
  name: 'HomeVue',
  components: {PostComponent, DialogPostDetail},
  emits: ["renderChat"],
  data () {
    return {
      q: '',
      dialogCreatePost: false,
      dialogEditPost: false,
      dialogPostDetail: false,
      title: '',
      content: '',
      image: '',
      imageUrl: '',
      errorTitle: '',
      errorContent: '',
      errorImage: '',
      listFriend: [],
      listRequestAddFriend: [],
      myGroups: [],
      listPost: [],
      postDetail: [],
      groupJoined: [],
      postId: '',
      checkMoreOption: false,
      checkDeleteImageUpdate: false,

      chat_id:null,
			chats:[],
      users:[],
    }
  },
  computed: {
    ...mapState("auth", ["authUser", 'isAuthenticated']),
  },
  mounted() {
    this.getListFriend(this.authUser?.data?.id)
    this.getListRequestAddFriend(this.authUser?.data?.id)
    this.getListMyGroup(this.authUser?.data?.id)
    this.getGroupJoined()
    this.getPostHome()
    this.getData()
  },
  methods:{
    ...mapMutations("auth", ["updateLoginStatus", "updateAccessToken", "updateAuthUser"]),
    removeImagePreview() {
      this.imageUrl = ''
      this.image = ''
    },
    OpentChat(){
       console.log(this.chat.id)
    },
    getData(){
      api.getChatUser()
        .then((response) => {
          console.log(response.data.chats)
          this.chats = response.data.chats
      });
    },
    removeImageUpdatePreview() {
      this.imageUrl = ''
      this.image = ''
      this.checkDeleteImageUpdate = true;
    },
    changeImagePost() {
        this.imageUrl = URL.createObjectURL(this.$refs.input__image.files[0]);
        this.image = this.$refs.input__image.files[0]
    },
    addImagePost() {
      this.$refs.input__image.click();
    },
    deletePost(postNeedDelete)
    {
      api.deletePost(postNeedDelete.id).then(() => {
        this.$message({
          message: 'Xoá bài viết thành công',
          type: 'success'
        });
        this.getPostHome()
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
      this.imageUrl = postNeedEdit.image
      this.resetError();
    },
    handleUpdatePost()
    {
      if(this.validateCreate()) {
        let data = new FormData();
        data.append('title', this.title)
        data.append('content', this.content)
        if(this.image) {
          data.append('image', this.image)
        }
        if(this.checkDeleteImageUpdate === true) {
          data.append('delete_image', true)
          this.checkDeleteImageUpdate = false
        }
        api.updatePost(data, this.postId).then(() => {
          this.$message({
            message: 'Sửa bài viết thành công',
            type: 'success'
          });
          this.dialogEditPost = false
          this.getPostHome()
          this.resetError()
          this.resetForm()
        }).catch((error)=>{
          let errors = _.get(error.response, 'data.error', {});
          let status = _.get(error, "response.status");
          if (status === 400) {
            if (Object.keys(errors).length > 0) {
              this.errorTitle = _.get(errors, 'title[0]', "")
              this.errorContent = _.get(errors, 'content[0]', "")
              this.errorImage = _.get(errors, 'image[0]', "")
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
        let data = new FormData();
        data.append('title', this.title)
        data.append('content', this.content)
        if(this.image) {
          data.append('image', this.image)
        }
        api.createPost(data).then(() => {
          this.$message({
            message: 'Tạo bài viết thành công',
            type: 'success'
          });
          this.dialogCreatePost = false
          this.getPostHome()
          this.resetError()
          this.resetForm()
        }).catch((error)=>{
          let errors = _.get(error.response, 'data.error', {});
          let status = _.get(error, "response.status");
          if (status === 400) {
            if (Object.keys(errors).length > 0) {
              this.errorTitle = _.get(errors, 'title[0]', "")
              this.errorContent = _.get(errors, 'content[0]', "")
              this.errorImage = _.get(errors, 'image[0]', "")
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
    getListMyGroup()
    {
      api.getMyGroup().then((response) => {
        this.myGroups = _.get(response,'data.data',[]);
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getGroupJoined()
    {
      api.getGroupJoined().then((response) => {
        this.groupJoined = _.get(response,'data.data',[]);
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getListFriend(id)
    {
      let data = {}
      api.getListFriend(data ,id).then((response) => {
        this.listFriend = _.get(response,'data.data',[])
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getPostHome()
    {
      api.getPostHome().then((response) => {
        this.listPost = _.get(response,'data.data',[]);
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    getListRequestAddFriend(id)
    {
      api.getListRequestAddFriend(id).then((response) => {
        this.listRequestAddFriend = _.get(response,'data.data',[])
      }).catch(()=>{
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
    openDialogPostDetail(dataPostDetail)
    {
      this.checkMoreOption = true
      this.dialogPostDetail = dataPostDetail.openPostDetail
      this.postDetail = dataPostDetail.postDetail
    },
    openDialogCreatePost()
    {
      this.dialogCreatePost = true
      this.resetForm()
      this.resetError()
    },
    resetForm()
    {
      this.title = "";
      this.content = '';
      this.image = '';
      this.postId = ''
      this.imageUrl = '';
    },
    resetError()
    {
      this.errorTitle = "";
      this.errorContent = '';
      this.errorImage = '';
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
    confirmFriend(id)
    {
      api.confirmFriend(id).then(() => {
        this.getListFriend(this.authUser.data.id)
        this.getListRequestAddFriend(this.authUser.data.id)
        this.getPostHome()
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
        this.getListFriend(this.authUser.data.id)
        this.getListRequestAddFriend(this.authUser.data.id)
        this.getPostHome()
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
    eventLikePost(post)
    {
      api.likePost(post.id).then(() => {
        this.getPostHome()
        this.detailPost(post.id)
      }).catch(() => {
      this.$message({
        type: 'error',
        message: "Có lỗi xảy ra, vui lòng thử lại sau."
      })
    })
    }
  },
  watch: {
    title()
    {
      this.errorTitle = ''
    },
    content ()
    {
      this.errorContent = ''
    },
    image ()
    {
      this.errorImage = ''
    }
  }
}
</script>
<style lang="scss">
.home__container {
  padding: 20px 0;
}
.el-main {
  background-color: #F0F2F5;
  padding: 0 !important;
  margin-top: 50px !important;
  min-height: 94vh;
}
.nav__menu {
  border: none !important;
  list-style: none;
  position: relative;
  margin: 0;
  padding: 0 10px !important;
  background-color: #F0F2F5 !important;
  text-align: left;
  width: 90%;
  .el-menu-item {
    height: 52px;
    line-height: 52px;
    list-style: none;
    color: #050505;
    font-weight: 600;
    padding-left: 10px !important;
    width: 100%;
    white-space: nowrap; /* Ngăn không cho chữ xuống dòng */
    overflow: hidden; /* Ẩn nội dung bị tràn */
    text-overflow: ellipsis; /* Thêm ba dấu chấm (...) */
    span {
      padding-left: 10px;
    }
    i {
      color: #3578E5;
      font-size: 30px;
      padding-right: 7px;
    }
  }
}
.list__nav:hover {
  background-color: #ddd !important;
  border-radius: 5px;
}
.border__buttom__nav {
  width: 95%;
  margin: 10px auto 20px auto;
  border-bottom: 1px solid #ccc !important;
}
.border__status__nav {
  width: 100%;
  margin: 5px auto 10px auto;
  border-bottom: 1px solid #ccc !important;
}
.list__group {
  text-align: left;
  h6 {
    font-weight: 600;
    color: #65676B;
    padding-left: 15px;
    padding-right: 10px;
  }
}
.nav__group {
  .nav__avatar__group {
    width: 37px;
    height: 37px;
    border-radius: 10px;
  }
}
.nav__left {
  position: fixed;
  left: 0;
}
.nav__right {
  position: fixed;
  right: 0;
}
.add__friend {
  line-height: 40px !important;
  height: auto !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
.box__status {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  text-align: left;
}
.status {
    width: 100%;
    height: 42px !important;
    line-height: 40px;
    border-radius: 20px;
    background-color: #F0F2F5;
    padding: 0 10px;
}
.status:hover{
  cursor: pointer !important;
  background-color: #ccc;
}
.view__all {
  float: right;
  font-size: 13px;
}
.list__group__description {
  width: 98%;
}
h6 {
  display: inline-block;
}
.box__status {
  border-radius: 10px;
}
.el-dialog {
  border-radius: 10px !important;
}
.dialog-footer {
  button {
    width: 100%;
  }
}
.el-dialog {
  text-align: left !important;
  max-height: 800px;
}
.error {
  color: #ff0000;
  text-align: left;
}
.el-avatar {
  padding: 0 !important;
}
.nav__list-friend, .nav__list-group {
  width: 100% !important;
}
.nav__list--add--friend {
  max-height: 300px;
  overflow-y: auto;
}
.nav__list--add--friend::-webkit-scrollbar-track
{
  border-radius: 10px;
  background-color: #F0F2F5;
}

.nav__list--add--friend::-webkit-scrollbar
{
  width: 8px;
  background-color: #F0F2F5;
}

.nav__list--add--friend::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #ccc;
}
.image__post:hover{
  color: #ff4069;
  text-decoration: underline;
  cursor: pointer;
}
.input__image {
  display: none;
}

.image__preview {
  width: 100%;
  height: auto;
  position: relative;
  text-align: center;
  .image__preview__option {
    display: none;
    position: absolute;
    text-align: center;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    span {
      margin: 0 10px;
      i {
        font-size: 25px;
        font-weight: 600;
        cursor: pointer;
      }
    }
  }
  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
  }
}
.image__preview:hover img{
  opacity: 0.3;
}
.image__preview:hover .image__preview__option{
  display: block;
  z-index: 1000;
}
// .area__read::-webkit-scrollbar {
//   display: none; /* ẩn thanh cuộn */
// }
.area__read {
  max-height: 90px;
  overflow: auto;
  // -ms-overflow-style: none;  /* IE and Edge */
  // scrollbar-width: none;  /* Firefox */
}
// .area__read1::-webkit-scrollbar {
//   display: none; /* ẩn thanh cuộn */
// }
.area__read1 {
  max-height: 310px;
  overflow: auto;
  // -ms-overflow-style: none;  /* IE and Edge */
  // scrollbar-width: none;  /* Firefox */
}
.area__read2 {
  max-height: 460px;
  overflow: auto;
  // -ms-overflow-style: none;  /* IE and Edge */
  // scrollbar-width: none;  /* Firefox */
}
  .label{
    position: fixed;
    right: 15px;
    bottom: 25px;
    z-index: 1;
    .icon {
      padding: 18px 13px 13px 13px;
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
</style>