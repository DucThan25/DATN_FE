<template>
   <div class="col-12 col-lg-7 col-xl-9">
      <div class="py-2 px-4 border-bottom d-none d-lg-block">
         <div v-for="participant in chat.participants" :key="participant.id">
            <div v-if="authUser?.data?.id != participant.id" class="d-flex align-items-center py-1">
               <div class="position-relative me-1"></div>
               <div class='avatar__comment avatar'>
                  <el-avatar v-if="participant?.avatar" :size="45" :src="participant?.avatar"></el-avatar>
                  <el-avatar v-else :size="45" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
               </div>
               <div class="flex-grow-1 pl-3 align">
                  <strong>
                     <span>{{ participant.name }}</span>	
                  </strong>
                  <div  class="small">
                     <b-icon-circle-fill :class="users.find(o =>o.id == participant.id)?' chat-online':' chat-offline'"></b-icon-circle-fill>
                     {{ users.find(o =>o.id == participant.id)? ' Online':' Offline' }}
                  </div>
               </div>	
            </div>
         </div>
      </div>
      <div class="position-relative">
         <div id="chatBox" class="chat-messages p-4">
            <div v-for="message in messages" :class="authUser?.data?.id === message.sender.id? 'chat-message-right' :'chat-message-left'" ref="messsageContainers" class="pb-4" :key="message.id">
               
               <div class='avatar__comment'>
                  <el-avatar v-if="message?.sender?.avatar" :size="40" :src="message?.sender?.avatar"></el-avatar>
                  <el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
               </div>
               <div class="flex-shrink-1 message-box rounded py-2 px-3 mx-2">
                  {{  message.message }} 
                           <div style=" opacity: 0.4;" class="text-muted small text-nowrap mt-2">{{ moment(message.created_at).format("DD-MM-yy,   h:m a") }} - {{  message.data.status }}</div>
               </div>
            </div>
         </div>
      </div>

      <div class="py-3 px-4 ">
         <div class="input-group">
            <input type="text" v-model="message" class="form-control" placeholder="Type your message">
            <el-button class="btn btn-primary" @click="onSubmit" icon="el-icon-s-promotion"></el-button>
         </div>
      </div>
   </div>
</template>

<script>
// import axios from 'axios'
import moment from 'moment'
import { mapState} from "vuex";
import api from "@/api";
import { echo } from '@/pusher/echo';
export default {
   computed: {
         ...mapState("auth", ["authUser"]),
   },
   props:['chat_id'],
   setup() {
      
   },
   created: function () {
      this.moment = moment;
   },
   data(){
     return{
        messages:[],
        chat:[],
        message:'',
        users :[]
     }
   },
   methods:{
     // to auto-scroll to the new received  message
      scrollToLastMessage(){
      this.$nextTick(() =>{
         let items = this.$refs.messsageContainers;
         let last = items[items.length-1];
         if(items.length > 0){
            last.scrollIntoView({
               block: "nearest",
               inline: "center",
               behavior: "smooth",
               alignToTop: false
            });
         }
      })
      },
   //to get the chat data when we open a chat
      async  getData(){
         api.getChatByID(this.chat_id)
         .then((response) => {
               console.log(response.data)
               this.messages = response.data.messages.data
               this.chat = response.data.chat
               echo.leave('chat.'+this.chat_id)
               this.startWebSocket()
               this.scrollToLastMessage()
         });
      },

  // to send new message
      async onSubmit() {
         let data = {message: this.message,chat_id:this.chat_id}
         api.sendTextMessage(data)
            .then((response) => {
               console.log(response);
               this.message =''
               this.getData();
            })
            .catch( (error) => {
               console.log(error);
            /*  this.ShowError=true;
               this.errorMgs = error.response.data.error;*/
            
            });
      },
  
   //to subscribe to the chat websocket channel
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
         })
         .listen('ChatMessageSent', (e) => {
            // for  listening to ChatMessageSent event from the server
            this.messages.push(e.message)
            this.scrollToLastMessage();
            if (this.authUser?.data?.id != e.message.sender.id){
               // let url ='http://127.0.0.1:8000/api/chat/message-status/'+e.message.id
               //    axios
               // .get(url,
               //    { headers: { 
               //             'Content-Type': 'application/json',
               //             'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
               //    }},
               // )
               api.messageStatus(e.message.id)
            }
         }).listen('ChatMessageStatus', (e) => {
            // listening to ChatMessageStatus event from the server
            this.messages.find(o => o.id ==e.message.id ).data.status =  e.message.data.status
         });
      }  
   },
   watch: {
      // call the method if the chat_id changes in chat.vue
      'chat_id': {
         handler: 'getData',
         immediate: true // runs immediately with mount() instead of calling method on mount hook
      },
   },
}
</script>
