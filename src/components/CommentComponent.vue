<template>
  <div class="comment__container">
    <div class="mt-2 d-flex">
      <div class='avatar__comment'>
        <el-avatar v-if="itemComment?.user?.avatar" :size="40" :src="itemComment?.user?.avatar"></el-avatar>
        <el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
      </div>

      <div class="content__comment" ref="content__comment">
        <div class="content__comment__box">
          <h6>{{itemComment?.user?.name}}</h6>
          <!-- <p class="small"><small>{{itemComment?.id}}</small></p>
          <p class="small"><small>{{itemComment?.parent_id}}</small></p>
          <p class="small"><small>{{itemComment?.user?.id}}</small></p> -->
          <div class="content_cmt" v-if="!requestUpdateComment">{{itemComment?.content}}</div>
          <div v-else>
            <el-input
                ref="commentUpdate"
               
                class="input__update__comment"
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="Bình luận"
                v-model="commentUpdate"
                @keyup.native.enter="eventUpdateContentComment(itemComment)">
                
            </el-input>
            <span class="d-block icon__send__comment" @click="eventUpdateContentComment(itemComment)">
              <el-tooltip class="item" effect="dark" content="Cập nhật" placement="top-start">
                <i class="el-icon-s-promotion"></i>
              </el-tooltip>
            </span>
          </div>
        </div>
      </div>
      
      <!-- nếu là người cmt thì có quyền sửa hoặc xóa -->
      <div class="option__comment" ref="option__comment" v-if="authUser?.data?.role === ROLE['ADMIN'] || authUser?.data?.id === itemComment.user_id">
        <el-dropdown trigger="click" v-if="checkMoreOption" >
          <span class="option__comment__icon"><i class="el-icon-more"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="itemComment?.user_id === authUser?.data?.id"><span @click="eventUpdateComment()"><fa :icon="['fas', 'square-pen']" /> Chỉnh sửa</span></el-dropdown-item>
            <el-dropdown-item><span @click="eventDeleteComment(itemComment?.id)"><fa :icon="['fas', 'trash-can']" /> Xoá</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      
    </div>
    <div class="reply_comment">
      <p class="small"><small @click="openReplyCmt()" role="button" >Phản hồi</small></p>
      <p class="small"><small>{{postingTime(itemComment?.created_at)}}</small></p>
    </div>
    
  </div>
</template>

<script>

import {ROLE} from "@/utils/constants";
import {postingTime} from "@/utils/helpers";
import {mapState} from "vuex";
export default {
  name:'CommentComponent',
  props: ['itemComment', 'loadingscreen', 'checkMoreOption'],
  computed: {
    ...mapState("auth", ["authUser"]),
  },
  data() {
    return {
      commentUpdate:'',
      requestUpdateComment:'',
      ROLE: ROLE,
    }
  },
  methods: {
    postingTime(date)
    {
      return postingTime(date)
    },
    openReplyCmt()
    {
      alert("phản hồi");
    },
    eventUpdateComment()
    {
      this.requestUpdateComment = 'confirm'
      this.commentUpdate = this.itemComment?.content
      this.$nextTick(() => {
        this.$refs.commentUpdate.focus()
      })

    },
    changeStyle()
    {
      if(!this.requestUpdateComment) {
        this.$refs.content__comment.style.width = 'unset'
        this.$refs.option__comment.style.display = 'flex'
      } else {
        this.$refs.content__comment.style.width = '100%'
        this.$refs.option__comment.style.display = 'none'
      }
    },
    eventDeleteComment(idCommentDelete)
    {
      this.$emit('eventDeleteComment', idCommentDelete)
    },
    eventUpdateContentComment(itemComment)
    {
      if(!this.commentUpdate) {
        this.$message.error('Nội dung bình luận không được trống');
        this.commentUpdate = ''
        this.requestUpdateComment = ''
      } else {
        let data = {
          idComment: itemComment.id,
          commentUpdate: this.commentUpdate
        }
        this.$emit('eventUpdateContentComment', data)
        this.commentUpdate = ''
        this.requestUpdateComment = ''
      }
    }
  },
  mounted() {
  },
  watch: {
    requestUpdateComment(){
      this.changeStyle();
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar__comment {
    width: 6.5%;
    margin-right: 0.5%;
  }
  .content__comment {
    width: auto;
    max-width: 93%;
    margin-left: 8px;
    .content__comment__box {
      width: 100%;
      height: auto;
      padding: 10px;
      background-color: #F0F2F5;
      border-radius: 20px;
      display: inline-block;
      h6 {
        font-weight:600;
        font-size: 15px;
      }
      .content_cmt{
        font-size: 12px;
      }
    }
  }
  .option__comment {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
    .option__comment__icon {
      display: inline-block;
      width: 35px;
      height: 35px;
      line-height: 35px;
      border-radius: 50%;
      text-align: center;
    }
  }
  .reply_comment{
    display: flex;
    margin-left: 50px;
    .small{
      margin-left: 10px;
    }
  }
  .comment__container:hover .option__comment__icon {
    background-color: #F0F2F5;
  }
  .input__update__comment::v-deep {
    .el-textarea__inner{
      background: inherit !important;
      border: none;
      padding: 0 !important;
    }
  }
  .icon__send__comment {
    i {
      font-size: 24px;
      float: right;
      margin-top: 10px;
      color: #3578E5;
      cursor: pointer;
    }
  }
  .error {
    color: #ff0000;
    text-align: left;
  }
</style>