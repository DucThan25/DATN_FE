<template>
  <div class="d-flex group--feed">
    <div class="group--content d-inline-block">
      <div class="preview__group">
        <div class="box__status box__post mt-4 mb-2" v-for="(post, index) in listPost" :key = "index">
          <PostComponent @eventLikePost="eventLikePost($event)" @dataPostDetail="openDialogPostDetail($event)"  @postUpdate="editPost($event)" @postDelete="deletePost($event)" :post = post></PostComponent>
        </div>
      </div>
    </div>
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
    <el-dialog width="38%" top="3%" :title="'Bài viết của ' + postDetail?.user?.name" :visible.sync="dialogPostDetail" @close="listPostGroupFeed">
      <DialogPostDetail @eventLikePost="eventLikePost($event)"  :checkMoreOption="checkMoreOption" :postDetail="this.postDetail" @add-comment="handleCreateComment($event)" @eventDeleteComment="handleDeleteComment($event)" @eventUpdateContentComment="handleUpdateComment($event)"></DialogPostDetail>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import PostComponent from "@/components/PostComponents";
import DialogPostDetail from "@/components/DialogPostDetail"
import api from "@/api";
import _ from 'lodash'

export default {
  name: 'FeedGroupView',
  components: {PostComponent, DialogPostDetail},

  computed: {
    ...mapState("auth", ["authUser"]),
  },
  mounted() {
    this.listPostGroupFeed()
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
    listPostGroupFeed()
    {
      api.listPostGroupFeed().then((response) => {
        this.listPost = _.get(response,'data.data',[]);
      })
    },
    eventLikePost(post)
    {
      api.likePost(post.id).then(() => {
        this.listPostGroupFeed()
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
      this.resetError();
    },
    deletePost(postNeedDelete)
    {
      api.deletePost(postNeedDelete.id).then(() => {
        this.$message({
          message: 'Xoá bài viết thành công',
          type: 'success'
        });
        this.listPostGroupFeed()
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
          this.getPostHome()
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

  }
}

</script>

<style lang="scss" scoped>
.group--feed {
  width: 50%;
  margin: auto;
  .group--content {
    width: 100%;
    margin: 0 auto;
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
          color: #000000;
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
}
</style>