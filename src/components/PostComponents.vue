<template>
  <div class="post__container p-3">
    <el-row>
      <!-- xét trường hợp là đăng trong group hay dòng thời gian -->
      <el-col :span="2">
        <router-link v-if="post?.group_id === null" :to="{name: 'ProfileView', params: {id: post?.user?.id}}">
          <el-avatar v-if="post?.user?.avatar" :size="44" :src=post?.user?.avatar></el-avatar>
          <el-avatar v-else :size="44" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
        </router-link>
        <div v-else>
          <router-link :to="{name: 'GroupDetail', params: {id: post?.group?.id}}">
            <el-image v-if="post?.group?.avatar" :src= post?.group?.avatar class="nav__avatar__group ">
            </el-image>
            <el-avatar v-if="post?.user?.avatar" :size="25" :src=post?.user?.avatar class="avatar__post__group "></el-avatar>
            <el-avatar v-else :size="25" :src="require('@/assets/images/userdefault.jpg')" class="avatar__post__group"></el-avatar>
          </router-link>
        </div>

      </el-col>
      <!-- tên user và nhóm -->
      <el-col :span="19" style="margin-left: 5px;">
        <!-- dòng 1 -->
        <p class="name__user mb-0">
          <router-link v-if="post?.group_id" :to="{name: 'GroupDetail', params: {id: post?.group?.id}}">
            {{post?.group?.name}}
          </router-link>
          <router-link v-else :to="{name: 'ProfileView', params: {id: post?.user?.id}}">
              {{post?.user?.name}}
          </router-link>
        </p>
        <!-- dòng 2 nếu là bài đăng trong group -->
        <p v-if="post?.group_id" class="small">
          <small class="username">
            <router-link :to="{name: 'ProfileView', params: {id: post?.user?.id}}">
              {{post?.user?.name}}
            </router-link>
          </small>
          .
          <small>{{postingTime(post.created_at)}}</small>
        </p>
        <p v-else class="small"><small>{{postingTime(post.created_at)}}</small></p>
      </el-col>
      <!-- nếu là ngươi đăng thì có hể sửa hoặc xóa  -->
      <el-col :span="2" class="text-right">
        <el-dropdown v-if="authUser?.data?.id === post?.user_id || authUser?.data?.role === ROlE['ADMIN'] || post?.checkCollaborator === true || post?.checkAdmin===true">
          <el-button class="btn__more" icon="el-icon-more" circle></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="post?.user_id === authUser?.data?.id">
                <span @click="eventUpdatePost()"><fa :icon="['fas', 'square-pen']" /> Chỉnh sửa</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="post?.user_id === authUser?.data?.id || authUser?.data?.role === ROlE['ADMIN'] || post?.checkCollaborator === true || post?.checkAdmin===true">
                <span @click="eventDeletePost()"> <fa :icon="['fas', 'trash-can']" /> Xóa</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <h5>{{post?.title}}</h5>
      <p>
       {{post?.content}}
      </p>
      <router-link :to="{name: 'DetailPostView' , params: {id: post?.id}}">
        <img class="image__post" v-if="post?.image" :src="post?.image" alt="" >
      </router-link>
      <!-- <img class="image__post" v-if="post?.image" :src="post?.image" alt="" @click="detailImg()" > -->
    </el-row>
    <el-row>
      <div class="">
        <span>
          <fa :icon="['far', 'thumbs-up']" class="text-primary mr-1" /> {{post?.likes_count}}
        </span>
        <span class="count__comment">
          {{post?.comments?.length}} bình luận
        </span>
      </div>
    </el-row>
    <el-row class="action">
      <el-col :span="8">
        <div v-if="post?.likes?.length > 0" class="action__detail text-center" @click="eventLikePost()">
          <fa :icon="['far', 'thumbs-up']" class="text-primary mr-1" /> Đã thích
        </div>
        <div v-else class="action__detail text-center" @click="eventLikePost()">
          <fa :icon="['far', 'thumbs-up']" /> Thích
        </div>
      </el-col>
      <el-col :span="8">
        <div class="action__detail text-center" @click="openDialogPostDetail()">
          <fa :icon="['far', 'comment']"/> Bình luận
        </div>
      </el-col>
      <el-col :span="8">
        <div class="action__detail text-center" @click="eventSharePost()">
          <fa :icon="['fas', 'share']" /> Chia sẻ
        </div>
      </el-col>
    </el-row>
    <div v-if="post.comments.length > 0">
      <CommentComponent :itemComment = "post?.comments[0]"></CommentComponent>
      <p class="more__comment" @click="openDialogPostDetail()">Xem thêm bình luận</p>
    </div>
    <div v-else>
      <p class="more__comment" @click="openDialogPostDetail()">Hãy trờ thành người đầu tiên bình luận</p>
    </div>
  </div>
</template>
<script>
import CommentComponent from "@/components/CommentComponent";
import {ROLE} from "@/utils/constants";
import {postingTime} from "@/utils/helpers";
import {mapState} from "vuex";
export default{
  name: "PostComponent",
  props: ['post'],
  components: {CommentComponent},
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  data() {
    return {
      ROlE : ROLE,
      openPostDetail: true,
      contentComment: '',
      postDetail: [],

    }
  },
  methods: {
    postingTime(date)
    {
      return postingTime(date)
    },
    eventUpdatePost()
    {
      let postNeedEdit = this.post
      this.$emit('postUpdate', postNeedEdit)
    },
    eventDeletePost()
    {
      let postNeedDelete = this.post
      this.$emit('postDelete', postNeedDelete)
    },
    eventLikePost()
    {
      this.$emit('eventLikePost', this.post)
    },
    openDialogPostDetail()
    {
      let data = {
        postDetail:  this.post,
        openPostDetail: this.openPostDetail
      }

      this.$emit('dataPostDetail', data)
    },
  }
}
</script>
<style lang="scss" scoped>
.name__user {
  a {
    font-weight: 600;
    color: #050505;
    text-decoration: none;
  }
}
.btn__more {
  border: none !important;
  margin: 0 !important;
  font-size: 24px !important;
  float: right;
}
.count__comment {
  float: right;
}
.action {
  padding: 3px 0 !important;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.action__detail {
  padding: 4px 0;
  cursor: pointer;
}
.action__detail:hover {
  background-color: #F0F2F5;
}
.write__comment::v-deep {
  .el-input__inner {
    border-radius: 20px !important;
  }
}
.avatar__comment {
  width: 6.5%;
  margin-right: 0.5%;
}
.content__comment {
  width: 93%;

  .content__comment__box {
    width: auto;
    height: auto;
    padding: 10px;
    background-color: #F0F2F5;
    border-radius: 20px;
    display: inline-block;
  }

  h6 {
    font-weight: 600;
  }
}
.more__comment {
  margin-top: 20px;
  font-weight: 600;
  color: #65676B;
}
.more__comment:hover{
  text-decoration: underline;
  cursor: pointer;
}
.nav__avatar__group {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 10px;
}
.avatar__post__group {
  position: absolute;
  top: 22px;
  left: 24px;
}
.username {
  a {
    font-weight: 600;
    text-decoration: unset;
    font-size: 15px;
    color: #65676B;
  }
}

.image__post {
  width: 100%;
  height: auto;
  max-height: 400px;
  margin-bottom: 10px;
}
</style>