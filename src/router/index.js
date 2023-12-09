import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from "@/views/LoginView";
import HomeView from "@/views/HomeView";
import CreateGroupView from "@/views/Groups/CreateGroupView";
import DetailGroupView from "@/views/Groups/DetailGroupView";
import FeedGroupView from "@/views/Groups/FeedGroupView";
import store from "@/store";
import ProfileView from "@/views/ProfileView";
import GroupLayout from "@/layouts/GroupLayout";
import ListMyGroupView from '@/views/Groups/ListMyGroupView';
import FriendView from "@/views/Friends/HomeView";
import RequestAddFriendView from "@/views/Friends/RequestAddFriendView";
import DetailUserComponent from "@/components/DetailUserComponent";
import ListFriendView from "@/views/Friends/ListFriendView";
import ListSuggestView from "@/views/Friends/ListSuggestView";
import ListGroupJoinedView from "@/views/Groups/ListGroupJoinedView";
import ChangePasswordView from "@/views/ChanggePasswordView";
import DetailPostView from "../views/DetailPostView";
import ChatRoomView from "../views/Chat/ChatRoomView";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },

  {
    path: '/change-password',
    name: 'ChangePasswordView',
    component: ChangePasswordView
  },

  {
    path: '/',
    name: 'Home',
    component:HomeView
  },

  {
    path: '/groups/create',
    name: 'CreateGroup',
    component: CreateGroupView,
  },

  {
    path: '/groups/update/:id',
    name: 'UpdateGroup',
    component: CreateGroupView,
  },

  {
    path: '/detailpost/:id',
    name: 'DetailPostView',
    component: DetailPostView,
  },

  {
    path: '/groups',
    component: GroupLayout,
    name: 'GroupLayout',
    children: [
      {
        path: '/groups/feed',
        name: 'FeedGroupView',
        component: FeedGroupView,
      },
      {
        path: '/groups/list-my-group',
        name: 'ListMyGroupView',
        component: ListMyGroupView,
      },
      {
        path: '/groups/list-group-joined',
        name: 'ListGroupJoinedView',
        component: ListGroupJoinedView,
      }
    ]
  },

  {
    path: '/groups/detail/:id',
    name: 'GroupDetail',
    component: DetailGroupView,
  },

  {
    path: '/chat/',
    name: 'ChatRoomView',
    component: ChatRoomView,
  },
  {
    path: '/friends/',
    name: 'FriendView',
    component: FriendView,
  },

  {
    path: '/friends/list',
    name: 'ListFriendView',
    component: ListFriendView,
    children: [
      {
        path: '/friends/profile/:id',
        name: 'ProfileFriend',
        component: DetailUserComponent
      },
    ]
  },
  {
    path: '/friends/suggest',
    name: 'ListSuggestView',
    component: ListSuggestView,
    children: [
      {
        path: '/friends/suggest/profile/:id',
        name: 'ProfileFriendSuggest',
        component: DetailUserComponent
      },
    ]
  },

  {
    path: '/friends/request-add',
    name: 'RequestAddFriendView',
    component: RequestAddFriendView,
    children: [
      {
        path: '/friends/request-add/profile/:id',
        name: 'ProfileRequestAddFriend',
        component: DetailUserComponent
      },
    ]
  },

  {
    path: '/profile/:id',
    name: 'ProfileView',
    component: ProfileView,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.name !== 'Login' && !store.state.auth.isAuthenticated) {
    next({ name: 'Login' })
  } else if(to.name === 'Login' && store.state.auth.isAuthenticated && store.state.auth.authUser.data.id) {
      next({name: 'Home'})
  }else {
    next()
  }
  store.state.home.prevRoute = from
})


export default router
