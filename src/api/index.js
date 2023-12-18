import axios from 'axios'
import store from "../store";
import router from "../router";

const baseUrl = process.env.VUE_APP_BASE_URL;

export const apiAxios = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
})

apiAxios.interceptors.request.use(config => {
        let token = store.state.auth.accessToken
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    })

apiAxios.interceptors.response.use(undefined, (error) => {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry && router.currentRoute.name !== 'Login') {
            store.commit('auth/updateLoginStatus', false)
            store.commit('auth/updateAuthUser', {})
            store.commit('auth/updateAccessToken', '')
            return router.push({ name: 'Login' })
        }
    }
    return Promise.reject(error);
})

export default {
    logout() {
        return apiAxios({
            method: 'get',
            url: 'auth/logout'
        })
    },

    changePassword(data) {
        return apiAxios({
            method: 'post',
            url: 'auth/change-password',
            data: data
        })
    },

    register(data) {
      return apiAxios({
          method: 'post',
          url: 'auth/register',
          data: data
      })
    },

    forgot(data) {
        return apiAxios({
            method: 'post',
            url: 'auth/forgot',
            data: data
        })
      },

    login(data) {
        return apiAxios({
            method: 'post',
            url: 'auth/login',
            data: data
        })
    },

    getAuthUser() {
        return apiAxios({
            method: 'get',
            url: 'users/me'
        })
    },

    getListUser(params) {
        return apiAxios({
            method: 'get',
            url: 'users/',
            params: params
        })
    },

    getListGroupAll(params) {
        return apiAxios({
            method: 'get',
            url: 'groups/list-all',
            params: params
        })
    },

    getListFriend(params, id) {
        return apiAxios({
            method: 'get',
            url: `friends/${id}`,
            params: params

        })
    },

    confirmFriend(id) {
        return apiAxios({
            method: 'put',
            url: `friends/confirm-add-friend/${id}`

        })
    },

    deleteAddFriend(id) {
        return apiAxios({
            method: 'put',
            url: `friends/cancel-request-add-friend/${id}`

        })
    },

    getListRequestAddFriend(id) {
        return apiAxios({
            method: 'get',
            url: `friends/list-request-add/${id}`

        })
    },

    getRequestAddFriendLimit(params,id) {
        return apiAxios({
            method: 'get',
            url: `friends/list-request-add-limit/${id}`,
            params: params
        })
    },

    getListSuggest(id) {
        return apiAxios({
            method: 'get',
            url: `friends/list-suggest/${id}`

        })
    },

    requestAddFriend(friend_id) {
        return apiAxios({
            method: 'get',
            url: `friends/request-add-friend/${friend_id}`

        })
    },

    getPostHome() {
        return apiAxios({
            method: 'get',
            url: 'home/posts/'
        })
    },

    createPost(data) {
       return apiAxios({
           method: 'post',
           url: 'home/posts/',
           data: data,
           headers: {'Content-Type': 'multipart/form-data'}
       })
    },

    updatePost(data, id) {
        return apiAxios({
            method: 'post',
            url: `home/posts/${id}`,
            data: data,
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },

    deletePost(id) {
        return apiAxios({
            method: 'delete',
            url: `home/posts/${id}`,
        })
    },

    detailPost(id) {
        return apiAxios({
            method: 'get',
            url: `home/posts/detail/${id}`
        })
    },

    createComment(postId ,params) {
        return apiAxios({
            method: 'post',
            url: `home/comments/post/${postId}`,
            params: params
        })
    },

    deleteComment(id) {
        return apiAxios({
            method: 'delete',
            url: `home/comments/${id}`,
        })
    },

    updateComment(params, id) {
        return apiAxios({
            method: 'put',
            url: `home/comments/${id}`,
            params: params
        })
    },

    likePost(postId) {
        return apiAxios({
            method: 'post',
            url: `like/${postId}`,
        })
    },

    getMyGroup() {
        return apiAxios({
            method: 'get',
            url: 'groups/'
        })
    },

    getGroupJoined() {
        return apiAxios({
            method: 'get',
            url: 'groups/joined'
        })
    },

    createGroup(data) {
        return apiAxios({
            method: 'post',
            url: 'groups/',
            data: data,
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },

    listPostGroupFeed() {
        return apiAxios({
            method: 'get',
            url: 'groups/feed'
        })
    },

    getGroupDetail(id) {
        return apiAxios({
            method: 'get',
            url: `groups/detail/${id}`
        })
    },

    getListMember(id, params) {
        return apiAxios({
            method: 'get',
            url: `groups/${id}/members`,
            params: params
        })
    },

    requestJoinGroup(id) {
        return apiAxios({
            method: 'get',
            url: `groups/add-request-join/${id}`

        })
    },

    listRequestJoinGroup(id) {
        return apiAxios({
            method: 'get',
            url: `groups/${id}/list-request-join`

        })
    },

    confirmPutInGroup(id) {
      return apiAxios({
          method: 'get',
          url: `groups/confirm-put-in-group/${id}`
      })
    },

    doNotPutInGroup(id) {
        return apiAxios({
            method: 'get',
            url: `groups/do-not-put-in-group/${id}`
        })
    },

    cancelRequestJoinGroup(id) {
        return apiAxios({
            method: 'get',
            url: `groups/cancel-request-join/${id}`

        })
    },

    leaveGroup(id) {
        return apiAxios({
            method: 'get',
            url: `groups/leave/${id}`

        })
    },

    setRoleMember(group_id, user_id) {
        return apiAxios({
            method: 'put',
            url: `groups/${group_id}/set-role/${user_id}`
        })
    },

    pleaseLeave(group_id, user_id) {
        return apiAxios({
            method: 'get',
            url: `groups/please-leave/${group_id}/${user_id}`
        })
    },

    updateImageGroup(data, id) {
        return apiAxios({
            method: 'post',
            url: `groups/${id}`,
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    updateInfoGroup(data, id) {
        return apiAxios({
            method: 'post',
            url: `groups/${id}`,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    createPostGroup(data, group_id) {
        return apiAxios({
            method: 'post',
            url: `groups/${group_id}/posts/`,
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    updatePostGroup(data, group_id, post_id) {
        return apiAxios({
            method: 'post',
            url: `groups/${group_id}/posts/${post_id}`,
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    deletePostGroup(group_id, post_id) {
        return apiAxios({
            method: 'delete',
            url: `groups/${group_id}/posts/${post_id}`,
        })
    },

    getProfileUser(id, params) {
        return apiAxios({
            method: 'get',
            url: `users/${id}`,
            params: params
        })
    },

    updateImage(data) {
        return apiAxios({
            method: 'post',
            url: `users/update-info/`,
            data: data,
            headers: {
                    'Content-Type': 'multipart/form-data'
            }
        })
    },

    showAvatarImage(filename) {
        return apiAxios({
            method: 'get',
            url: `users/images/avatar/${filename}`,
        })
    },

    updateInfo(data) {
        return apiAxios({
            method: 'post',
            url: `users/update-info/`,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    removeFriend(friend_id) {
        return apiAxios({
            method: 'get',
            url: `friends/remove-friend/${friend_id}`
        })
    },

    listNotifies() {
        return apiAxios({
            method: 'get',
            url: 'notifies/'
        })
    },

    readNotify(id) {
        return apiAxios({
            method: 'get',
            url: `notifies/read/${id}`
        })
    },

    listChatRoom() {
        return apiAxios({
            method: 'get',
            url: 'chat/rooms'
        })
    },

    ChatRoomMessage(roomId) {
        return apiAxios({
            method: 'get',
            url: `chat/room/${roomId}/messages`
        })
    },
    newChatRoom(roomId,params) {
        return apiAxios({
            method: 'post',
            url: `chat/room/${roomId}/message`,
            params: params
        })
    },
    createRoomChat(data){
        return apiAxios({
            method: 'post' ,
            url:'chat/create-room',
            data:data
        })
    },
    getChatUser(){
        return apiAxios({
            method: 'get',
            url: 'chat/get-chats'
        })
    },
    createChat(data){
        return apiAxios({
            method: 'post' ,
            url:'chat/create-chat',
            data:data
        })
    },
    getChatByID(chat_id){
        return apiAxios({
            method: 'get',
            url: `chat/get-chat-by-id/${chat_id}`
        })
    },
    searchUser(data){
        return apiAxios({
            method: 'post',
            url: 'chat/search-user',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    sendTextMessage(data){
        return apiAxios({
            method: 'post',
            url: 'chat/send-text-message',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    messageStatus(message){
        return apiAxios({
            method: 'get',
            url: `chat/message-status/${message}`
        })
    },
}