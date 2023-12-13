<template>
    <el-row style="margin-top: 5px;">
      <el-col :span="5">
        <div class="grid-content ">
          
        </div>
      </el-col>
      <el-col :span="5" class="nav__left">
        <div class="title">
            <h5>Chat cộng đồng </h5>
          </div>
        <div style="padding-top: 50px;">
          <chatRoomSelection
              v-if="currentRoom.id"
              :chatRooms="chatRooms"
              :currentRoom="currentRoom"
              v-on:roomChanged="setRoom($event)"
              />
        </div>
        <div class="create--group"  v-if="authUser?.data?.role  == ROLE['ADMIN']">
          <div class="btn--create--group"><i class="el-icon-plus"></i>Tạo kênh mới</div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content">
          
          <MessageContainer style="padding-bottom: 70px;" :messages="messages"/>
          <div style="padding: 10px; background-color: #ffffff; position: fixed; bottom: 0px;">
            <InputMassage :room="currentRoom" v-on:messageSent="getMessages()"/>
          </div>
         
        </div>
      </el-col>
      <el-col :span="5" class="nav__right">
        <div>
          <h5>Người truy cập trong phòng</h5>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">

        </div>
      </el-col>
    </el-row>
  </template>
  <script>
  import {mapState} from "vuex";
  import {ROLE} from "@/utils/constants";
  import api from "@/api";
  import _ from "lodash";
  import InputMassage from "@/views/Chat/InputMassage.vue";
  import MessageContainer from "./MessageContainer.vue";
  import chatRoomSelection from "@/views/Chat/ChatRoomSelection.vue";
  import { echo } from '@/pusher/echo';
  

  export default {
    name: 'ChatRoomView',
    components: {
      InputMassage,
      MessageContainer,
      chatRoomSelection
    },
    computed: {
      ...mapState("auth", ["authUser"]),
    },
    mounted() {
      
    },
    data() {
      return {
        chatRooms:[],
        currentRoom:[],
        messages:[],
        ROLE: ROLE,
      }
    },
    watch:{
      currentRoom(val,oldVal){
          if(oldVal.id){
              this.disconnect(oldVal);
          }
          this.connect();
      }
    },
    methods: {
      connect(){
          if(this.currentRoom.id){
              let vm = this;
              this.getMessages();
              echo.private('chat.'+this.currentRoom.id)
                .listen('NewChatMessageRoom',e=>{
                    vm.getMessages();
                });

              echo.join('chat.' + this.currentRoom.id)
                .here((users) => {
                    console.log(users.length + ' user(s) in the room');
                })
                .joining((user) => {
                    console.log(user.name + ' joined the chat room');
                })
                .leaving((user) => {
                    console.log(user.name + ' leave the chat room');
                });
          }
      },
      disconnect(room){
          echo.leave('chat.'+room.id);
      },
      getRooms(){
        api.listChatRoom().then(reponse => {
          this.chatRooms = reponse.data;
          this.setRoom(reponse.data[0]);
        })
        .catch(error=>{
          console.log(error);
        })
      },

      setRoom(room){
        this.currentRoom = room;
        this.getMessages();
      },
      getMessages(){
        api.ChatRoomMessage(this.currentRoom.id)
        .then(response=>{
          this.messages = response.data;
        })
        .catch(error=>{
          console.log(error);
        })
      }
    },
    created(){
      this.getRooms();
    }
  }
  
  </script>
  
  <style lang="scss" scoped>
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
    }
    .grid-content {
     // border-radius: 4px;
      min-height: 1000px;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
    .avatar__comment {
      width: 6.5%;
      margin-right: 0.5%;
    }
    .nav__left {
      background-color: #ffffff;
      width: 20%;
      text-align: left;
      padding: 20px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      min-height: 93.8vh;
      position: fixed;
      left: 0;

      .title {
  
        h5 {
          font-weight: bold;
        }
      }
     
    }
    .nav__right {
      position: fixed;
      background-color: #ffffff;
      width: 20%;
      text-align: left;
      padding: 20px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      min-height: 93.8vh;
      right: 0;

      .title {
  
        h5 {
          font-weight: bold;
        }
      }
    }
    .create--group {
      margin: 10px 0 20px 0;
    .btn--create--group {
        background-color: #E7F3FF;
        font-weight: 600;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 5px;
      }
    }
  </style>