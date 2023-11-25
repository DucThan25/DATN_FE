<template>
    <div class="d-flex group--container">
      <div class="group--sidebar d-inline-block area__read">
        <el-row>
            <el-col :span="2">
                <el-avatar v-if="postDetail?.user?.avatar" :size="44" :src=postDetail?.user?.avatar></el-avatar> 
                <el-avatar v-else :size="44" :src="require('@/assets/images/userdefault.jpg')"></el-avatar> 
            </el-col>
            <el-col :span="19" style="margin-left: 5px;">
                <router-link  :to="{name: 'ProfileView', params: {id: postDetail?.user?.id}}">
                    {{postDetail?.user?.name}}
                </router-link>
            </el-col>
        </el-row>
        <el-row>
            <h5> {{postDetail?.title}}</h5>
            <p>
                {{postDetail?.content}}
            </p>
        </el-row>
        <el-row>
            <div class="">
                <span>
                <b-icon-hand-thumbs-up-fill class="text-primary mr-1"></b-icon-hand-thumbs-up-fill>2
                </span>
                <span class="count__comment">
                1 <b-icon-chat-square></b-icon-chat-square> 
                </span>
            </div>
        </el-row>
        <el-row class="action">
            <el-col :span="8">
                <div class="action__detail text-center">
                <b-icon-hand-thumbs-up></b-icon-hand-thumbs-up> Thích
                </div>
            </el-col>
            <el-col :span="8">
                <div class="action__detail text-center" >
                <b-icon-chat-square></b-icon-chat-square> Bình luận
                </div>
            </el-col>
            <el-col :span="8">
                <div class="action__detail text-center" >
                <b-icon-share-fill></b-icon-share-fill> Chia sẻ
                </div>
            </el-col>
        </el-row>
        <div >
            <CommentComponent v-for="(itemComment, index) in postDetail?.comments" 
            :key="index" 
            :itemComment="itemComment" 
           >
            </CommentComponent>
        </div>
      </div>
      <div class="empty--card">
        <i class="el-icon-back"></i>
        <img width="1150px" class="image__post" v-if="postDetail?.image" :src="postDetail?.image" alt="" >
      </div>
    <div class="list--request__container">
      
      
    </div>
    </div>
  </template>
  <script>
  import CommentComponent from "@/components/CommentComponent";
  import {mapState} from "vuex";
  import _ from "lodash";
  import api from '@/api';
  
  export default {
    name: 'DetailPostView',
    components: {CommentComponent},
    computed: {
      ...mapState("auth", ["authUser"]),
    },
    mounted() {
        this.detailPost(this.$route.params.id)
    },
    data() {
      return {
        title: '',
        postDetail: [],
      }
    },
    methods: {
        async detailPost(id)
        {
            await api.detailPost(id).then((response) => {
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
        }
        
    }
  }
  
  </script>
  
  <style lang="scss" scoped>
  .group--container {
    margin-top: 10px;
    .list--request__container {
      width: 80%;
      margin: auto;
      display: block;
      .list-suggest {
        border-top: 1px solid #ccc;
      }
      .list--request__box {
        padding: 30px;
        text-align: left;
        h5 {
          font-weight: 600;
          margin-left: 5px;
        }
        
      }
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
    .empty--card {
      width: 20%;
    }
    .count__comment {
      float: right;
    }
    .group--sidebar {
      background-color: #ffffff;
      width: 25%;
      text-align: left;
      padding: 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      min-height: 93.8vh;
      position: fixed;
      right: 0;
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
        margin-top: 20px;
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
  .area__read::-webkit-scrollbar {
    display: none;
  }
  .area__read {
    max-height: 600px;
    overflow: auto;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
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