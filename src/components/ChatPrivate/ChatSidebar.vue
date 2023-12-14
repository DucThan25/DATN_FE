<template>
<div class="col-12 col-lg-5 col-xl-3 border-end">
  <h1 class="h3 mb-3 mt-3"> <b-icon-messenger></b-icon-messenger> Messages</h1>
  <div class="border__buttom__nav"></div>
<div class="px-4 d-none d-md-block">
    <div class="d-flex align-items-center">
        <div class="flex-grow-1">
            <div class="input-group mt-3">
             
                <input list="browsers" v-model="searchEmail" @input="searchUsers" type="text" class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                <datalist id="browsers">
                    <option v-for="user in users" :key="user.email">{{ user.email }}</option>
                </datalist>
                <el-button class="btn btn-outline-secondary" @click="onSubmit" id="button-addon1" icon="el-icon-search"></el-button>
            </div>
        </div>
    </div>
</div>

<div class="border__buttom__nav"></div>
<a v-for="chat in chats" @click="OpentChat(chat.id)" :key="chat.id"  class="list-group-item list-group-item-action   " >
    <el-menu class="d-flex align-items-start">
        
        <el-menu-item class="flex-grow-1 ml-3 fw-bold">
            <span v-for="participant in chat.participants" :key="participant.id">
                <span v-if="authUser?.data?.id != participant.id" >
                  <div class='avatar__comment'>
                    <el-avatar v-if="participant?.avatar" :size="40" :src="participant?.avatar"></el-avatar>
                    <el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
                  </div>
                  {{ participant.name }}
                </span>
           </span>
        </el-menu-item>
    </el-menu>
</a>

</div>
</template>
<script>
import axios from 'axios';
import { mapState} from "vuex";
import api from "@/api";
import { echo } from '@/pusher/echo';
export default {
  computed: {
			...mapState("auth", ["authUser"]),
	},
   // to user the renderChat message from the parent component chat.vue
  emits: ["renderChat"],
	data(){
		return{
      chat_id:null,
			chats:[],
			
      users:[],
      searchEmail:'',
		}
	},
  methods:{
    // để bắt đầu mở cuộc trò chuyện trong ChatBox.vue
   OpentChat(chat_id){
        // ngắt kết nối kênh trò chuyện hiện tại
        echo.leave('chat.'+this.chat_id)

        //mở cuộc trò chuyện mới
        this.chat_id = chat_id
        this.$emit("renderChat", chat_id);
    },
   
    // để tìm kiếm người dùng bằng email
   searchUsers() {
      this.isSendingForm = true;
      let data = {email:this.searchEmail}
      api.searchUser(data)
      .then((response) => {
          console.log(response);
          this.isSendingForm = false;
          this.users = response.data.users
      })
      .catch( (error) => {
          console.log(error);
          this.isSendingForm = false;
      });
    },

    // to get the user's chats to be displayed on the sidbar
    getData(){
      api.getChatUser()
        .then((response) => {
          console.log(response.data.chats)
          this.chats = response.data.chats
          this.startWebSocket()
      });
    },
    async startWebSocket(){
     console.log('startWebSocket',this.chat_id)
     echo.join('chat.'+this.chat_id)
     .here(users => {
        this.users = users
     })
     .joining(user => {
        this.users.push(user)
     })
     .leaving(user => {
        this.users = this.users.filter(u => (u.id !== user.id));
     }).listen('ChatMessageSent', (e) => {
        // for  listening to ChatMessageSent event from the server
        this.messages.push(e.message)
        this.scrollToLastMessage();
        if (this.$store.state.id != e.message.sender.id){
           let url ='http://127.0.0.1:8000/api/chat/message-status/'+e.message.id
              axios
           .get(url,
              { headers: { 
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              }},
           )
           
        }
     }).listen('ChatMessageStatus', (e) => {
        // listening to ChatMessageStatus event from the server
        this.messages.find(o => o.id ==e.message.id ).data.status =  e.message.data.status
     });
  }  ,


  // to start a chat with  user
  async  onSubmit() {
       this.isSendingForm = true;
       let user = this.users.find(o => o.email === this.searchEmail);
       var data= new FormData();
       data.append('users[]', user.id);
       data.append('isPrivate', 1);
      //  axios.post(
      //   'http://127.0.0.1:8000/api/chat/create-chat',data, 
      //   {
			// headers: {
			// "Content-Type": "application/json",
			// 'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
			// }
    	// })
      api.createChat(data)
      .then((response) => {
         // to start a chat with the user
        this.isSendingForm = false;
        this.OpentChat(response.data.chat.id)
      })
      .catch( (error) => {
        console.log(error);
        this.isSendingForm = false;
      });
    },
    },
    mounted(){
    this.getData()
  }

}
</script>
<style>

.min-h-content{
    min-height: calc(100vh - 82px - 148px);
}

.chat-card{
    min-height: 70vh;
}
.chat-online {
    color: #34ce57
}

.chat-offline {
    color: #e4606d
}

.chat-messages {
    display: flex;
    flex-direction: column;
    min-height: 400px;
    max-height: 500px;
    overflow-y: scroll
}
.messsage-container{
    min-height: 125px;
}
.chat-message-left,
.chat-message-right {
    display: flex;
    flex-shrink: 0
}

.chat-message-left {
    margin-right: auto
}

.chat-message-right {
    flex-direction: row-reverse;
    margin-left: auto
}

.chat-message-left .message-box{
    
    background-color: #88f5a1;
}
.chat-message-right .message-box{
    background-color: rgb(143, 240, 240);
}
/* .py-3  {
    padding-top: 1rem!important;
    padding-bottom: 1rem!important;
}
.px-4 {
    padding-right: 1.5rem!important;
    padding-left: 1.5rem!important;
} */
.border__buttom__nav {
  width: 95%;
  margin: 12px auto 22px auto;
  padding-top: 4px;
  border-bottom: 1px solid #ccc !important;
}
</style>