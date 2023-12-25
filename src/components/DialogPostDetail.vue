<template>
  <div class="post__container p-3" v-if="postDetail">
    <div class="area__read">
      <el-row>
        <el-col :span="2">
          <el-avatar v-if="!postDetail?.group_id" :size="44" :src=postDetail?.user?.avatar></el-avatar>
          <div v-else>
            <el-image :src= postDetail?.group?.avatar class="nav__avatar__group">
            </el-image>
            <el-avatar :size="25" :src=postDetail?.user?.avatar class="avatar__post__group"></el-avatar>
          </div>
        </el-col>
        <el-col :span="18" style="margin-left: 8px;">
          <p class="name__user mb-0">
            <a v-if="postDetail?.group_id" href="">
              {{postDetail?.group?.name}}
            </a>
            <a v-else href="">
              {{postDetail?.user?.name}}
            </a>
          </p>
          <p v-if="postDetail?.group_id" class="small">
            <small class="username"><a href="">{{postDetail?.user?.name}}</a></small>
            -
            <small>{{postingTime(postDetail.created_at)}}</small>
          </p>
          <p v-else class="small"><small>{{postingTime(postDetail.created_at)}}</small></p>
        </el-col>
      </el-row>
      <!-- nội dung bài viết -->
      <el-row>
        <h5>{{postDetail?.title}}</h5>
        <p>{{postDetail?.content}}</p>
        <img class="image__post" v-if="postDetail?.image" :src="postDetail?.image" alt="" >
      </el-row>
      <!-- số like bình luận -->
      <el-row>
        <div class="">
          <span>
            <fa :icon="['far', 'thumbs-up']" class="text-primary mr-1" />{{postDetail?.likes_count}}
          </span>
          <span class="count__comment">
            {{postDetail?.comments?.length}} bình luận
          </span>
        </div>
      </el-row>
      <el-row class="action">
        <el-col :span="8">
          <div v-if="postDetail?.likes?.length > 0" class="action__detail text-center" @click="eventLikePost()">
            <fa :icon="['far', 'thumbs-up']" class="text-primary mr-1" /> Đã thích
          </div>
          <div v-else class="action__detail text-center" @click="eventLikePost()">
            <fa :icon="['far', 'thumbs-up']" /> Thích
          </div>
        </el-col>
        <el-col :span="8">
          <div class="action__detail text-center">
            <fa :icon="['far', 'comment']"/> Bình luận
          </div>
        </el-col>
        <el-col :span="8">
        <div class="action__detail text-center" @click="eventSharePost()">
          <fa :icon="['fas', 'share']" /> Chia sẻ
        </div>
      </el-col>
      </el-row>

      <CommentComponent v-for="(itemComment, index) in postDetail?.comments" 
            :key="index" 
            :itemComment="itemComment" 
            @eventDeleteComment="eventDeleteComment($event, postDetail.id)" 
            @eventUpdateContentComment="eventUpdateContentComment($event, postDetail.id)" 
            :checkMoreOption="checkMoreOption">
      </CommentComponent>

    </div>
    <div class="mt-2 d-flex footer__comment__box">
      <div class='avatar__comment'>
        <el-avatar :size="40" v-if="authUser?.data?.avatar" :src=authUser?.data?.avatar></el-avatar>
        <el-avatar :size="40" v-else :src= "require('@/assets/images/userdefault.jpg')"></el-avatar>
      </div>
      <div class="content__comment">
        <el-input
            type="textarea"
            :rows="2"
            placeholder="Thêm bình luận của bạn1"
            v-model="contentComment"
            @keyup.native.enter="addComment(postDetail)">
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import CommentComponent from "@/components/CommentComponent";
import {mapState} from "vuex";
import {postingTime} from "@/utils/helpers";
export default{
  name: "DialogPostDetail",
  components: {CommentComponent},
  props: ['postDetail', 'checkMoreOption'],
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  data() {
    return {
      contentComment:'',
    }
  },
  methods: {
    postingTime(date)
    {
      return postingTime(date)
    },
    eventLikePost()
    {
      this.$emit('eventLikePost', this.postDetail)
    },
    eventDeleteComment(idCommentDelete, idPost)
    {
      let data = {
        idCommentDelete: idCommentDelete,
        idPost: idPost
      }
      this.$emit('eventDeleteComment', data)
    },
    eventUpdateContentComment(dataComment, idPost)
    {
      dataComment.idPost = idPost
      this.$emit('eventUpdateContentComment', dataComment)
    },
    addComment(postDetail)
    {
      let dataAddComment = {
        postDetail : postDetail,
        contentComment : this.contentComment
      }
      this.$emit('add-comment', dataAddComment)
      this.contentComment = ''
    }
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
    min-height: 100px;
    border-radius: 20px !important;
  }
}
.avatar__comment {
  width: 6.5%;
  margin-right: 0.5%;
}
.content__comment {
  width: 93%;
  margin-left: 10px;

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
.area__read::-webkit-scrollbar {
  display: none;
}
.area__read {
  max-height: 600px;
  overflow: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.content__comment::v-deep{
  .el-textarea {
    .el-textarea__inner {
      background-color: #F0F2F5 !important;
      border-radius: 10px !important;
      border: none !important;
    }
  }
}
.footer__comment__box {

  margin-top: 30px;
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