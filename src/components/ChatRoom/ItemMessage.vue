<template>
	<div v-if="authUser?.data?.id === message?.user?.id"  class="content">
		<div class='avatar__comment'>
			<el-avatar v-if="message?.user?.avatar" :size="40" :src="message?.user?.avatar"></el-avatar>
			<el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
			
		</div>
		<div class="message-right">
			{{message.message}} 
			<div class="text-muted small text-nowrap mt-2">{{ moment(message.created_at).format("DD-MM-yy,   h:m a") }}</div>
			
		</div> 
	</div>
	<div v-else  class="content-right">
		<div class='avatar__comment'>
			<el-avatar v-if="message?.user?.avatar" :size="40" :src="message?.user?.avatar"></el-avatar>
			<el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
			<span class="user-name-hover">{{ message?.user?.name }}</span>
		</div>
		<div class="message-left">
			{{message.message}}
			<div class="text-muted small text-nowrap mt-2">{{ moment(message.created_at).format("DD-MM-yy,   h:m a") }}</div>
		</div> 
	</div>
</template>

<script>
	import { mapState} from "vuex";
	import moment from 'moment'
	export default{
		props:['message'],
		computed: {
			...mapState("auth", ["authUser"]),
		},
		created: function () {
			this.moment = moment;
		},
	}
	
</script>
<style>
	.content{
		display: flex;
		flex-direction: row-reverse;
	}
	.content-right{
		display: flex;
	}
	.message-left
	{
		margin-top: 5px;
		margin-left: 10px;
		background-color: #88f5a1;
		padding: 5px 20px 5px 20px;
		border-radius: 5px;
	}
	.message-right
	{
		margin-top: 5px;
		margin-right: 10px;
		background-color: rgb(143, 240, 240);
		padding: 5px 20px 5px 20px;
		border-radius: 5px;
	}
	.avatar__comment{	
		position: relative;
		display: inline-block;
	}
	.user-name-hover {
		display: none;
		position: absolute;
		top: 50%;
		left: 150%;
		transform: translate(-50%, -50%);
		white-space: nowrap;
		background-color: #ffffff;
	}

	.avatar__comment:hover .user-name-hover {
		display: block;
	}
</style>