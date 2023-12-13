<template>
	<div class="input-message">
		<div
			>
			<input 
				class="input-text"
				type="text"
				v-model="message"
				@keyup.enter="sendMessage()"
				placeholder=" Aa"
				 />
			<button class="button" @click="sendMessage()">
				<i class="el-icon-s-promotion"></i>
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
<style>
	/* .input-message
	{
		position: fixed;
		bottom: 0px;
		background-color: blue;
	} */
	.input-text
	{
		margin-left: 100px;
		border-radius: 15px;
		width: 710px;
		
	}
	.button
	{
		margin-left:20px ;
	}
</style>