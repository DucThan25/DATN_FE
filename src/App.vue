<template>
  <div id="app">
    <GeneralLayout v-if="auth.isAuthenticated && auth?.authUser?.data?.check_change_password != CHECK_CHANGE_PASS['UN_CHANGE']"/>
    <ChangePasswordView v-if="auth.isAuthenticated && auth?.authUser?.data?.check_change_password == CHECK_CHANGE_PASS['UN_CHANGE']"/>
    <LoginView v-if="!auth.isAuthenticated"/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  img {
    object-fit: cover !important;
  }
  nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      .router-link-exact-active {
        color: #42b983;
      }
    }
  }
  span,p, a {
    font-size: 16px;
    text-decoration: none;
  }
  small {
    color: #65676B !important;
    font-size: 10px !important;
  }
  p.small {
    margin-top: -6px;
}
}

</style>
<script>
import LoginView from "@/views/LoginView";
import GeneralLayout from "@/layouts/GeneralLayout";
import {mapState} from 'vuex'
import ChangePasswordView from "@/views/ChanggePasswordView";
import {CHECK_CHANGE_PASS} from "@/utils/constants";

export default {

  computed: {
    ...mapState(["auth"]),
  },
  components: {
    ChangePasswordView,
    GeneralLayout,
    LoginView

  },
  created() {

  },
  data() {
    return {
      CHECK_CHANGE_PASS
    }
  }
}
</script>
