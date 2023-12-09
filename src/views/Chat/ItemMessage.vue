<template>
	<div v-if="authUser?.data?.id === message?.user?.id"  class="content">
		<div class='avatar__comment'>
			<el-avatar v-if="message?.user?.avatar" :size="40" :src="message?.user?.avatar"></el-avatar>
			<el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
		</div>
		<el-tag type="success">{{message.message}}</el-tag> 
	</div>
	<div v-else  class="content-right">
		<div class='avatar__comment'>
			<el-avatar v-if="message?.user?.avatar" :size="40" :src="message?.user?.avatar"></el-avatar>
			<el-avatar v-else :size="40" :src="require('@/assets/images/userdefault.jpg')"></el-avatar>
		</div>
		<el-tag type="danger">{{message.message}}</el-tag> 
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
</style>