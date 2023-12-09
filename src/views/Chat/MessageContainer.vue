<template>
	<div class="h-96 w-full">
		<div class="h-full p-2 flex flex-col-reverse overflow-y-scroll">
			<div v-for="(message, index) in messages" :key="index">
				<ItemMessage :message="message"/>
			</div>
		</div>
	</div>
</template>

<script>
	import ItemMessage from "@/views/Chat/ItemMessage.vue"
	export default{
		components: { ItemMessage },
		props:['messages']
	}
</script>