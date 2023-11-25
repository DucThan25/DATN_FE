<template>
  <div class="list--my--group">
    <h5>Tất cả nhóm của bạn: </h5>
    <CardGroupComponent :groups="myGroups" @leaveGroupSuccess="getListMyGroup"></CardGroupComponent>
  </div>
</template>

<script>
import CardGroupComponent from "@/components/CardGroupComponent";
import api from "@/api";
import _ from 'lodash'
export default {
  name: 'ListMyGroupView',
  components: {CardGroupComponent},
  data() {
    return {
      myGroups: [],
    }
  },
  mounted() {
    this.getListMyGroup()
  },
  methods: {
    getListMyGroup()
    {
      api.getMyGroup().then((response) => {
        this.myGroups = _.get(response,'data.data',[]);
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