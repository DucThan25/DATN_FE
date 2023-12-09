<template>
	<div class="relative h-10 m-1">
		<div class="grid grid-cols-6"
			style="border-top: 1px solid #e6e6e6;">
			<input type="text"
				v-model="message"
				@keyup.enter="sendMessage()"
				placeholder="New Message"
				 />
			<button @click="sendMessage()">
				Send
			</button>
		</div>
	</div>
</template>

<script>
	import api from "@/api";
	export default{
		props:['room'],
		data(){
			return {
				message:''
			}
		},
		methods:{
			sendMessage(){
				if(this.message == ' '){
					return;
				}else{
					let data = {
						message: this.message
					}
					api.newChatRoom(this.room.id,data)
					.then(response=>{
						if(response.status == 201){
							this.message = '';
							this.$emit('messageSent');
						}
					})
					.catch(error=>{
						console.log(error);
					})
				}	
			}
		}
	}
</script>