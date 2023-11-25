<template>
  <div class="list--my--group">
    <h5>Tất cả nhóm đã tham gia lgrlu: </h5>
    <CardGroupComponent :groups="groupsJoined" @leaveGroupSuccess="getListGroupJoined"></CardGroupComponent>
  </div>
</template>

<script>
import CardGroupComponent from "@/components/CardGroupComponent";
import api from "@/api";
import _ from 'lodash'
export default {
  name: 'ListGroupJoinedView',
  components: {CardGroupComponent},
  data() {
    return {
      groupsJoined: [],
    }
  },
  mounted() {
    this.getListGroupJoined()
  },
  methods: {
    getListGroupJoined()
    {
      api.getGroupJoined().then((response) => {
        this.groupsJoined = _.get(response,'data.data',[]);
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "Có lỗi xảy ra, vui lòng thử lại sau."
        })
      })
    },
  }
}

</script>

<style lang="scss" scoped>
.list--my--group {
  width: 65%;
  margin: auto;
  padding: 20px;
  text-align: left;
}
</style>