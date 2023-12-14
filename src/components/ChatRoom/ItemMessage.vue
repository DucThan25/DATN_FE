<template>
	<div v-if="authUser?.data?.id === message?.user?.id"  class="content">
		<div class='avatar__comment'>
			<el-avatar v-if="message?.user?.avatar" :size="40" :src="message?.user?.avatar"></el-avatar>
			<el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
			
		</div>
		<el-tag class="message-right" type="success">{{message.message}}</el-tag> 
	</div>
	<div v-else  class="content-right">
		<div class='avatar__comment'>
			<el-avatar v-if="message?.user?.avatar" :size="40" :src="message?.user?.avatar"></el-avatar>
			<el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
			<span class="user-name-hover">{{ message?.user?.name }}</span>
		</div>
		<el-tag class="message-left" type="danger">{{message.message}}</el-tag> 
	</div>
</template>

<script>
	import { mapState} from "vuex";
	export default{
		props:['message'],
		computed: {
			...mapState("auth", ["authUser"]),
		}
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
	}
	.message-right
	{
		margin-top: 5px;
		margin-right: 10px;
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