<template>
	<div class="grid grid-cols-2">
		<div >
			<select
				v-model="selected"
				@change="$emit('roomChanged',selected)"
				class="float-right rounded-full teet">
				<option v-for="(room,index) in chatRooms" 
					:key="index" 
					:value="room">
					{{room.name}}
				</option>
				
			</select>			
		</div>
	</div>
</template>

<script>
	export default{
		props:['currentRoom','chatRooms'],
		data:function(){
			return{
				selected:''
			}
		},
		created(){
			this.selected = this.currentRoom;
		}
	}
</script>
<style>
	.teet{
		background-color: #E7F3FF;
        font-weight: 600;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 5px;
	}
</style>