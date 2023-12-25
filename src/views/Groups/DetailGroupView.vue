<template>
  <div class="d-flex group--container">
    <div class="group--sidebar d-inline-block">
      <div class="d-flex">
        <div class="avatar--group">
          <el-image v-if="group?.avatar"
              fit="cover"
              :src="group?.avatar"
              class="nav__avatar__group"></el-image>
          <el-image v-else
                    fit="cover"
                    :src="require('@/assets/images/userdefault.jpg')"
                    class="nav__avatar__group"></el-image>
        </div>
        <input type="file" ref="changeAvatar" class="input--hidden d-none" @change="updateAvatar(group)">
        <div class="name--group">
          <p>
            {{group?.name}}
          </p>
          <small v-if="group?.type === TYPE_GROUP['PRIVATE']">
            <b-icon-lock-fill></b-icon-lock-fill> Nhóm riêng tư 1<b-icon-dot></b-icon-dot> {{group?.user_groups?.length}} thành viên
          </small>
          <small v-else>
            <b-icon-unlock-fill></b-icon-unlock-fill> Nhóm công khai 1<b-icon-dot></b-icon-dot> {{group?.user_groups?.length}} thành viên
          </small>
        </div>
      </div>
      <p>__{{group.introduce}}__</p>
      <div class="btn__action__group">
        <el-dropdown trigger="click" v-if="checkJoinedGroup === STATUS_USER_GROUP['JOINED']">
          <button class=""><b-icon-person-check-fill></b-icon-person-check-fill> Đã tham gia <b-icon-caret-down-fill></b-icon-caret-down-fill></button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div class="item--list" @click="leaveGroup(group?.id)"><b-icon-box-arrow-right></b-icon-box-arrow-right> Rời nhóm</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <button 
          v-if="checkJoinedGroup === STATUS_USER_GROUP['NOT_IN_GROUP']" 
          class="" @click="requestJoinGroup(group?.id)">
          <b-icon-person-plus-fill></b-icon-person-plus-fill> Yêu cầu tham gia
        </button>
        <el-dropdown trigger="click" v-if="checkJoinedGroup ===STATUS_USER_GROUP['WAIT_CONFIRMATION']">
          <button v-if="checkJoinedGroup ===STATUS_USER_GROUP['WAIT_CONFIRMATION']" class=""><b-icon-person-check-fill></b-icon-person-check-fill> Đã yêu cầu tham gia <b-icon-caret-down-fill></b-icon-caret-down-fill></button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div class="item--list" @click="cancelRequestJoinGroup(group?.id)"><b-icon-person-x-fill></b-icon-person-x-fill> Huỷ yêu cầu </div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <button class="community--homepage"><i class="el-icon-s-home"></i> Trang chủ của cộng đồng</button>
      </div>
    </div>
    <div class="empty--card"></div>
    <div class="group--content d-inline-block">
      <div class="preview__group">
        <div class="preview__group__content">
          <div class="position-relative">
            <img v-if="group" width="100%" height="350px" :src="group.cover_image" alt="">
            <img v-else width="100%" height="350px" :src="require('@/assets/images/userdefault.jpg')" alt="">
            <div v-if="(group?.id) && authUser.data.id === group.user_id" class="p-2 btn-update-cover-image" @click="changeCoverImage">
              <span><i class="el-icon-camera-solid"></i> Chỉnh sửa ảnh bìa</span>
              <input type="file" ref="changeCoverImage" class="input--hidden d-none" @change="updateCoverImage(group)">
            </div>
          </div>
          <div class="group__generality">
            <div class="more__group">
              <el-dropdown trigger="click" v-if="checkJoinedGroup === STATUS_USER_GROUP['JOINED']">
                <span class="el-dropdown-link">
                  <b-icon-three-dots></b-icon-three-dots>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="checkAdmin===true" @click.native="changeAvatar">Đổi ảnh đại diện nhóm</el-dropdown-item>
                  <el-dropdown-item v-if="checkAdmin===true" @click.native="openDialogChangeInfo(group)">Đổi thông tin nhóm</el-dropdown-item>
                  <el-dropdown-item><span @click="leaveGroup(group?.id)">Rời nhóm</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <h3 v-if="group">{{group?.name}}</h3>
            <h3 v-else>Tên nhóm detailGroup</h3>
            <p v-if="group?.type === TYPE_GROUP['PRIVATE']">Nhóm kín <b-icon-dot></b-icon-dot> {{group?.user_groups?.length}} thành viên</p>
            <p v-else>Nhóm công khai <b-icon-dot></b-icon-dot> {{group?.user_groups?.length}} thành viên</p>
            <div class="line"></div>
          </div>
          <el-tabs type="card" @tab-click="handleClick" v-if="checkJoinedGroup === STATUS_USER_GROUP['JOINED']">
            <el-tab-pane tabindex="0" label="Bài viết">
              <div class="preview__group">
                <div class="group--post">
                  <div class="box__status p-3" @click="openDialogCreatePost()">
                    <el-row>
                      <el-col :span="2">
                        <el-avatar :size="44" :src="authUser?.data?.avatar"></el-avatar>
                      </el-col>
                      <el-col :span="22">
                        <div class="status">Bạn viết gì đi!</div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="box__status box__post mt-2 mb-5" v-for="(post, index) in listPost" :key = "index">
                    <PostComponent @eventLikePost="eventLikePost($event)" @dataPostDetail="openDialogPostDetail($event)"  @postUpdate="editPost($event)" @postDelete="deletePost($event)" :post = post></PostComponent>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane tabindex="1" label="Thành viên">
              <div class="preview__group">
                <div class="group--post">
                  <div class="box__status box__post mt-2 mb-5 p-3">
                    <div class="box__member--count">
                      <h6>Thành viên <b-icon-dot></b-icon-dot> {{allPeopleInGroup?.length}}</h6>
                      <p>Tất cả thành viên của nhóm sẽ hiển thị ở đây.</p>
                      <input type="text" v-model="searchGroup" v-debounce="500" @change="searchMemberGroup()" class="d-block" placeholder="Nhập tên thành viên để tìm kiếm">
                    </div>
                    <div v-if="searchGroup ===''" class="list--member mt-3">
                      <div class="" v-for="(me, index) in allPeopleInGroup" :key="index">
                        <div v-if="me?.user_id === authUser.data.id" class="d-flex list--member__item item__me" >
                          <router-link :to="{name: 'ProfileView', params: {id: me?.user?.id}}">
                            <img v-if="me.user.avatar" :src="me?.user?.avatar" alt="">
                            <img v-else :src="require('@/assets/images/userdefault.jpg')" alt="">
                          </router-link>
                          <div class="member__info">
                            <router-link :to="{name: 'ProfileView', params: {id: me?.user?.id}}">
                              <h6 class="d-block">{{me.user.name}}</h6>
                            </router-link>
                            <small v-if="me?.role === ROLE_GROUP['ADMIN']" class="member__info__tag--role admin__group">Quản trị viên</small>
                            <small v-if="me?.role === ROLE_GROUP['COLLABORATOR']" class="member__info__tag--role admod__group">Cộng tác viên</small>
                            <small v-if="me?.role === ROLE_GROUP['MEMBER']" class="member__info__tag--role user__group">Thành viên</small>
                          </div>
                        </div>
                      </div>
                      <div class="pt-3">
                        <strong>Danh sách quản trị viên nhóm: </strong>
                        <div v-for="(administrator, index) in listAdministrators" :key="index" class="d-flex list--member__item">
                          <router-link :to="{name: 'ProfileView', params: {id: administrator?.user?.id}}">
                            <img v-if="administrator?.user?.avatar" :src="administrator?.user?.avatar" alt="">
                            <img v-else :src="require('@/assets/images/userdefault.jpg')" alt="">
                          </router-link>
                          <div class="member__info">
                            <router-link :to="{name: 'ProfileView', params: {id: administrator?.user?.id}}">
                              <h6 class="d-block">{{administrator.user.name}}</h6>
                            </router-link>
                            <small v-if="administrator?.role === ROLE_GROUP['ADMIN']" class="member__info__tag--role admin__group">Quản trị viên</small>
                            <small v-else class="member__info__tag--role admod__group">Cộng tác viên</small>
                          </div>
                          <div v-if="administrator?.role === ROLE_GROUP['COLLABORATOR'] && checkAdmin===true" class="member__item__more">
                            <el-dropdown trigger="click">
                              <span class="el-dropdown-link">
                               <b-icon-three-dots></b-icon-three-dots>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><div @click="setRoleMember(group?.id, administrator?.user?.id)">Chuyển thành thành viên</div></el-dropdown-item>
                                <el-dropdown-item><div @click="pleaseLeave(group?.id, administrator?.user?.id)">Mời rời nhóm</div></el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </div>
                        </div>
                      </div>
                      <div class="pt-3 list--user">
                        <strong>Danh sách thành viên của nhóm 1: </strong>
                        <div v-for="(listMember, index) in listMembers" :key="index" class="d-flex list--member__item">
                          <router-link :to="{name: 'ProfileView', params: {id: listMember?.user?.id}}">
                            <img v-if="listMember?.user?.avatar" :src="listMember?.user?.avatar" alt="">
                            <img v-else :src="require('@/assets/images/userdefault.jpg')" alt="">
                          </router-link>
                          <div class="member__info">
                            <router-link :to="{name: 'ProfileView', params: {id: listMember?.user?.id}}">
                              <h6 class="d-block">{{listMember?.user?.name}}</h6>
                            </router-link>
                            <small class="member__info__tag--role user__group">Thành viên</small>
                          </div>
                          <div class="member__item__more" v-if="checkAdmin===true">
                            <el-dropdown trigger="click">
                              <span class="el-dropdown-link">
                               <b-icon-three-dots></b-icon-three-dots>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><div @click="setRoleMember(group?.id, listMember?.user?.id)">Chuyển thành cộng tác viên</div></el-dropdown-item>
                                <el-dropdown-item><div @click="pleaseLeave(group?.id, listMember?.user?.id)">Mời rời nhóm</div></el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="list--member mt-3">
                      <div class="pt-3">
                        <div v-for="(people, index) in searchPeopleInGroup" :key="index" class="d-flex list--member__item">
                          <router-link :to="{name: 'ProfileView', params: {id: people?.user?.id}}">
                            <img v-if="people?.user?.avatar" :src="people?.user?.avatar" alt="">
                            <img v-else :src="require('@/assets/images/userdefault.jpg')" alt="">
                          </router-link>
                          <div class="member__info">
                            <router-link :to="{name: 'ProfileView', params: {id: people?.user?.id}}">
                              <h6 class="d-block">{{people.user.name}}</h6>
                            </router-link>
                            <small v-if="people?.role === ROLE_GROUP['ADMIN']" class="member__info__tag--role admin__group">Quản trị viên</small>
                            <small v-else-if="people?.role === ROLE_GROUP['COLLABORATOR']" class="member__info__tag--role admod__group">Cộng tác viên</small>
                            <small v-else class="member__info__tag--role user__group">Thành viên</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane v-if="group?.type === TYPE_GROUP['PRIVATE'] && checkAdmin === true" tabindex="2" :label="'Yêu cầu (' + listRequestJoin.length + ')'">
              <div class="preview__group">
                <div class="group--post">
                  <div class="box__status box__post mt-2 mb-5 p-3">
                    <div class="box__member--count">
                      <h6>Yêu cầu tham gia nhóm <b-icon-dot></b-icon-dot> {{listRequestJoin?.length}}</h6>
                      <p>Tất cả yêu cầu tham gia nhóm sẽ hiển thị ở đây.</p>
                    </div>
                    <div class="list--member mt-3">
                      <div class="pt-3">
                        <div v-for="(request, index) in listRequestJoin" :key="index" class="d-flex list--member__item">
                          <router-link :to="{name: 'ProfileView', params: {id: request?.user?.id}}">
                            <img v-if="request?.user?.avatar" :src="request?.user?.avatar" alt="">
                            <img v-else :src="require('@/assets/images/userdefault.jpg')" alt="">
                          </router-link>
                          <div class="member__info">
                            <router-link :to="{name: 'ProfileView', params: {id: request?.user?.id}}">
                              <h6 class="d-block">{{request.user.name}}</h6>
                            </router-link>
                            <div class="d-inline-block">
                              <button class="btn btn-primary" @click="confirmRequestJoinGroup(request?.id)">Xác nhận</button>
                              <button class="btn btn-secondary mx-2" @click="doNotPutJoinGroup(request?.id)">Huỷ</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <p v-if="checkJoinedGroup === STATUS_USER_GROUP['NOT_IN_GROUP']" class="m-2">Tham gia nhóm để xem chi tiết. <span class="suggest_join" @click="requestJoinGroup(group?.id)">Yêu cầu</span></p>
          <p v-if="checkJoinedGroup === STATUS_USER_GROUP['WAIT_CONFIRMATION']" class="m-2">Bạn đã yêu cầu tham gia nhóm! <span class="suggest_join" @click="cancelRequestJoinGroup(group?.id)">Bạn có muốn huỷ?</span></p>
        </div>
      </div>
    </div>
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
      <div style="border: solid 1px rgb(223, 221, 221); text-align: center;">
        <div v-if='!imageUrl' class="image__post" @click="addImagePost"><fa :icon="['fas', 'cloud-arrow-up']" style="font-size: 20px; padding: 20px 0 20px 0;" /></div>
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
        <div v-if='!imageUrl' class="image__post" @click="addImagePost">Thêm ảnh</div>
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
    <el-dialog width="38%" top="3%" :title="'Bài viết của ' + postDetail?.user?.name" :visible.sync="dialogPostDetail" @close="getGroupDetail($route.params.id)">
      <DialogPostDetail @eventLikePost="eventLikePost($event)"  :checkMoreOption="checkMoreOption" :postDetail="this.postDetail" @add-comment="handleCreateComment($event)" @eventDeleteComment="handleDeleteComment($event)" @eventUpdateContentComment="handleUpdateComment($event)"></DialogPostDetail>
    </el-dialog>
    <el-dialog title="Đổi thông tin cá nhân" :visible.sync="updateInfo">
      <el-form>
        <div class="mb-2">
          <label for="exampleInputEmail1">Tên <span class="text-danger">*</span></label>
          <input v-model="changeInfo.name" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Nhập tên của bạn">
          <small id="emailHelp" class="form-text"><span class="text-danger">{{infoError.name}}</span></small>
        </div>
        <div class="form-row row mb-2">
          <div class="form-group col-6">
            <label for="inputPassword4" class="d-block">Loại nhóm <span class="text-danger">*</span></label>
            <el-select v-model="changeInfo.type" placeholder="Chọn loại nhóm">
              <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <small id="emailHelp" class="form-text d-block"><span class="text-danger">{{infoError.type}}</span></small>
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
import PostComponent from "@/components/PostComponents";
import DialogPostDetail from "@/components/DialogPostDetail"
import api from "@/api";
import _ from "lodash"
import {ROLE_GROUP, TYPE_GROUP, STATUS_USER_GROUP} from "@/utils/constants";

export default {
  name: 'DetailGroupView',
  components: {PostComponent, DialogPostDetail},
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
    },
    '$route.params': {
      immediate: true,
      handler: function() {
        this.getGroupDetail(this.$route.params.id)
      },
    },
    'changeInfo.name': {
      handler: function() {
        this.infoError.name = ''
      },
    },
    'changeInfo.type': {
      handler: function() {
        this.infoError.type = ''
      },
    },
  },
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  created() {

  },
  mounted() {
    this.getGroupDetail(this.$route.params.id)
    this.getListRequstJoinGroup();
  },
  data() {
    return {
      checkDeleteImageUpdate: false,
      listRequestJoin: [],
      dialogCreatePost: false,
      ROLE_GROUP,
      searchMember: '',
      TYPE_GROUP,
      dialogPostDetail: false,
      dialogEditPost: false,
      searchGroup: '',
      coverImageUrl: '',
      groupName: '',
      listPost: [],
      group: [],
      title: '',
      image: '',
      imageUrl: '',
      content: '',
      errorTitle: '',
      errorContent: '',
      errorImage: '',
      postDetail: [],
      postId: '',
      checkMoreOption: false,
      activeName: 'first',
      listMembers: [],
      listAdministrators: [],
      allPeopleInGroup: [],
      searchPeopleInGroup: [],
      STATUS_USER_GROUP,
      checkJoinedGroup: '',
      checkAdmin: false,
      changeInfo: {
        name: '',
        type: '',
        introduce:''
      },
      infoError: {
        name: '',
        type:'',
      },
      type: [{
        value: TYPE_GROUP['PRIVATE'],
        label: 'Nhóm kín'
      }, {
        value: TYPE_GROUP['PUBLIC'],
        label: 'Nhóm công khai'
      }],
      updateInfo: false,
    }
  },
  methods: {
    removeImagePreview() {
      this.imageUrl = ''
      this.image = ''
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
    handleUpdateInfo()
    {
      let error = false
      if(this.changeInfo.name === '') {
        this.infoError.name = 'Tên không được để trống !'
        error = true
      }
      if(!this.changeInfo.type) {
        this.infoError.type = 'Loại nhóm không được để trống !'
        error = true
      }
      if(error === false) {
        let formData = new FormData()
        formData.append('name', this.changeInfo.name)
        formData.append('type', this.changeInfo.type)
        formData.append('introduce', this.changeInfo.introduce)
        api.updateInfoGroup(formData, this.$route.params.id).then(()=>{
          this.closeDialogChangeInfo()
          this.getGroupDetail(this.$route.params.id)
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
      }else {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      }
    },
    closeDialogChangeInfo()
    {
      this.resetError()
      this.resetForm()
      this.updateInfo = false
    },
    openDialogChangeInfo(group)
    {
      this.changeInfo.name = group.name
      this.changeInfo.type = group.type
      this.changeInfo.introduce = group.introduce
      this.updateInfo = true
    },
    updateAvatar(group)
    {
      let formData = new FormData();
      formData.append('name', group.name)
      formData.append('type', group.type)
      formData.append('avatar', this.$refs.changeAvatar.files[0])
      api.updateImageGroup(formData, this.$route.params.id).then(() => {
        this.getGroupDetail(this.$route.params.id)
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
    changeCoverImage()
    {
      this.$refs.changeCoverImage.click()
    },
    updateCoverImage(group)
    {
      let formData = new FormData();
      formData.append('name', group.name)
      formData.append('type', group.type)
      formData.append('cover_image', this.$refs.changeCoverImage.files[0])
      api.updateImageGroup(formData, this.$route.params.id).then(() => {
        this.getGroupDetail(this.$route.params.id)
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
    confirmRequestJoinGroup(id) {
      api.confirmPutInGroup(id).then(()=> {
        this.getListRequstJoinGroup();
        this.getGroupDetail(this.$route.params.id)
        this.$message({
          type: 'success',
          message: "Đã hoàn tất"
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Đã xảy ra lỗi, thử lại sau"
        })
      })
    },
    doNotPutJoinGroup(id) {
      this.$confirm('Bạn có chắc chắn không cho người này nhóm?', 'Cảnh báo', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Huỷ',
        type: 'warning',
        center: true
      }).then(() => {
        api.doNotPutInGroup(id).then(()=> {
          this.getListRequstJoinGroup();
          this.$message({
            type: 'success',
            message: "Đã hoàn tất"
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
    pleaseLeave(group_id, user_id) {
      this.$confirm('Bạn có chắc chắn mời thành viên này rời nhóm?', 'Cảnh báo', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Huỷ',
        type: 'warning',
        center: true
      }).then(() => {
        api.pleaseLeave(group_id, user_id).then(()=> {
          this.getListMember()
          this.$message({
            type: 'success',
            message: "Đã hoàn tất"
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

    setRoleMember(group_id, user_id) {
      this.$confirm('Bạn có chắc chắn đổi quyền?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ',
        type: 'warning',
        center: true
      }).then(() => {
        api.setRoleMember(group_id, user_id).then(()=> {
          this.getListMember()
          this.$message({
            type: 'success',
            message: "Đã thay dổi"
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
    leaveGroup(id) {
      this.$confirm('Bạn có chắc chắn rời nhóm?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ',
        type: 'error',
        center: true
      }).then(() => {
        api.leaveGroup(id).then(()=> {
          this.$message({
            type: 'success',
            message: "Đã rời nhóm"
          })
          this.$router.push('/groups/feed');
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "Đã xảy ra lỗi, thử lại sau"
          })
        })
      }).catch(() => {

      });
    },

    cancelRequestJoinGroup(id) {
      this.$confirm('Bạn có chắc chắn huỷ yêu cầu?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ',
        type: 'warning',
        center: true
      }).then(() => {
        api.cancelRequestJoinGroup(id).then(()=> {
          this.getGroupDetail(this.$route.params.id)
          this.$message({
            type: 'success',
            message: "Đã huỷ yêu cầu vào nhóm"
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
    requestJoinGroup(id) {
      api.requestJoinGroup(id).then(()=> {
        this.getGroupDetail(this.$route.params.id)
        this.$message({
          type: 'success',
          message: "Đã yêu cầu vào nhóm"
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Đã xảy ra lỗi, thử lại sau"
        })
      })
    },
    openDialogCreatePost()
    {
      this.dialogCreatePost = true
      this.resetForm()
      this.resetError()
    },
    searchMemberGroup(){
      let params = {}
      if(this.searchGroup) {
        params.q = this.searchGroup
      }
      api.getListMember(this.$route.params.id, params).then((response) => {
        this.searchPeopleInGroup = _.get(response, 'data.data.allPeopleInGroup', [])
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Lỗi lấy danh sách thành viên nhóm"
        })
      })
    },
    getListMember() {
      let param = {}
      if(this.searchGroup) {
        param.q = this.searchGroup
      }
      api.getListMember(this.$route.params.id, param).then((response) => {
        this.listMembers = _.get(response, 'data.data.listMember', [])
        this.listAdministrators = _.get(response, 'data.data.listAdministrators', [])
        this.allPeopleInGroup = _.get(response, 'data.data.allPeopleInGroup', [])
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Lỗi lấy danh sách thành viên nhóm"
        })
      })
    },
    handleClick(tab) {
      if(tab.index === '1') {
        let param = {}
        if(this.searchGroup) {
          param.q = this.searchGroup
        }
        api.getListMember(this.$route.params.id, param).then((response) => {
          this.listMembers = _.get(response, 'data.data.listMember', [])
          this.listAdministrators = _.get(response, 'data.data.listAdministrators', [])
          this.allPeopleInGroup = _.get(response, 'data.data.allPeopleInGroup', [])
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "Lỗi lấy danh sách thành viên nhóm"
          })
        })
      }else if (tab.index === '2'){
        this.getListRequstJoinGroup();
      }else {
        this.getGroupDetail(this.$route.params.id)
      }
    },
    getListRequstJoinGroup()
    {
      api.listRequestJoinGroup(this.$route.params.id).then((response) => {
        this.listRequestJoin = _.get(response, 'data.data', [])
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Lỗi lấy danh sách yêu cầu tham gia nhóm"
        })
      })
    },
    async getGroupDetail(id)
    {
      await api.getGroupDetail(id).then((response) => {
        this.listPost = _.get(response, 'data.data.postGroup', [])
        this.group =_.get(response, 'data.data.groupDetail', [])
        this.checkJoinedGroup = _.get(response, 'data.data.checkJoinedGroup', '')
        this.checkAdmin = response.data.data.checkAdmin
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Lỗi lấy chi tiết nhóm"
        })
      })
    },
    eventLikePost(post)
    {
      api.likePost(post.id).then(() => {
        this.getGroupDetail(this.$route.params.id)
        this.detailPost(post.id)
      }).catch(() => {
        this.$message({
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
    editPost(postNeedEdit)
    {
      this.dialogEditPost = true;
      this.title = postNeedEdit.title
      this.content = postNeedEdit.content
      this.postId = postNeedEdit.id
      this.imageUrl = postNeedEdit.image
      this.resetError();
    },
    deletePost(postNeedDelete)
    {
      console.log(postNeedDelete)
      api.deletePostGroup(postNeedDelete.group_id,postNeedDelete.id).then(() => {
        this.$message({
          message: 'Xoá bài viết thành công',
          type: 'success'
        });
        this.getGroupDetail(this.$route.params.id)
      }).catch(() => {
        this.$message.error({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
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
        api.updatePostGroup(data, this.group.id, this.postId).then(() => {
          this.$message({
            message: 'Sửa bài viết thành công',
            type: 'success'
          });
          this.getGroupDetail(this.$route.params.id)
          this.dialogEditPost = false
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
    resetForm()
    {
      this.title = "";
      this.content = '';
      this.postId = ''
      this.imageUrl = '';
      this.image = '';
      this.changeInfo.name = ''
      this.changeInfo.type = ''
      this.changeInfo.introduce = ''
    },
    resetError()
    {
      this.infoError.name = ''
      this.infoError.type = ''
      this.errorTitle = "";
      this.errorContent = '';
      this.errorImage = '';
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
    handleCreatePost()
    {
      if(this.validateCreate()) {
        let data = new FormData();
        data.append('title', this.title)
        data.append('content', this.content)
        if(this.image) {
          data.append('image', this.image)
        }
        api.createPostGroup(data,  this.group.id).then(() => {
          this.$message({
            message: 'Tạo bài viết thành công',
            type: 'success'
          });
          this.dialogCreatePost = false
          this.getGroupDetail(this.$route.params.id)
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

  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu::v-deep {
  width: 18.5%;
  font-weight: 600 !important;
}
.group--container {
  margin-top: 10px;
  .empty--card {
    width: 20%;
  }
  .group--sidebar {
    background-color: #ffffff;
    width: 20%;
    text-align: left;
    padding: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    min-height: 93.8vh;
    position: fixed;
    left: 0;
    top: 60px;
    .community--homepage {
      background-color: #dfefe0;
      color: #24853c;
      text-align: left;
      padding: 10px;
    }
    .el-dropdown::v-deep {
      width: 100% !important;
    }
    button {
      width: 100%;
      margin-top: 10px;
      padding: 7px 0;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      background-color: #ccc;
    }
    .avatar--group::v-deep {
      img {
        width: 50px;
        height: 50px;
        border-radius: 10px;
      }
    }
    .name--group {
      padding-left: 10px;
      p {
        font-weight: 600;
        margin-bottom: 0 !important;
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
  }
  .list__nav:hover {
    background-color: #ccc !important;
  }
  .group--content {
    width: calc(100% - 20%);
    .preview__group {
      padding: 10px;
      background-color: #F0F2F5;
      width: 80%;
      height: auto;
      margin: 0 auto;
      .preview__group__content {
        border: 1px solid #ccc;
        border-radius: 10px;
        .suggest_join {
          cursor: pointer;
          color: #ff0000;
        }
        .suggest_join:hover {
          color: #409EFF;
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
        img {
          border-radius: 10px;
          //opacity: 0.5;
          height: 450px;
        }
        .group__generality {
          color: #000000;
          pointer-events: unset;
          padding: 20px;
          text-align: left;
          background-color: #ffffff;
          .more__group{
            text-align: center;
            float: right;
            width: 40px;
            height: 40px;
            line-height: 47px;
            border-radius: 50%;
            svg {
              font-weight: 600;
              font-size: 22px;
            }
          }
          .more__group:hover {
            background-color: #dddddd;
          }
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
              cursor: pointer;
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
              color: #000000;
            }
          }
        }
      }
    }
  }
  .group--post {
    width: 78%;
    margin: auto;
  }
  .el-tabs__header {
    margin: 0 0 0 !important;
  }
}
.el-tabs::v-deep{
  .el-tabs__header{
    .el-tabs__nav-wrap {
      .el-tabs__nav-scroll {
        background-color: #ffffff !important;
        border-bottom: 1px solid #ccc;
        .el-tabs__nav {
          .el-tabs__item {
            font-weight: 600 !important;
          }
        }
      }
    }
  }
}
.box__member--count {
  border-bottom: 1px solid #ccc;
  h6 {
    font-weight: 600;
  }
  input {
    height: 36px;
    width: 100%;
    border-radius: 18px;
    border: none;
    background-color: #F0F2F5;
    outline: none;
    padding: 5px 10px;
    margin-bottom: 20px;
  }
}
.item__me {
  border-bottom: 1px solid #cccccc;
}
.list--member__item {
  padding: 10px 0;
  align-items: center;
  .member__item__more {
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 48px;
    border-radius: 50%;
    svg {
      font-size: 22px !important;
    }
  }
  .member__item__more:hover {
    background-color: #dddddd;
  }
  img {
    width: 80px;
    height: 80px !important;
    border-radius: 50% !important;
    margin-right: 10px;
  }
  .member__info {
    width: 83%;
    .member__info__tag--role {
      padding: 2px;
      border-radius: 4px;
    }
    .admod__group {
      background-color: #33CCFF;
      color: #ffffff;
    }
    .admin__group {
      background-color: #dfefe0;
      color: #24853c;
    }
    .user__group {
      background-color: #ccc;
      color: #ffffff;
    }
    h6 {
      font-weight: 600;
    }
  }
}
.list--user {
  border-top: 1px solid #ccc;
}
.item--list {
  width: 100%;
}
</style>
