/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
});


import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});

let onlineUsersLength = 0;

window.Echo.join(`online`)
    .here((users) => {

        onlineUsersLength = users.length;

        if (users.length > 1) {
            $('#no-online-users').css('display', 'none');
        }
        let userId = $('meta[name=user-id]').attr('content');

        users.forEach(function (user) {
            if (userId == user.id) {
                return;
            }
            $('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><span class="icon icon-circle text-success"></span>  ${user.name}</li>`);
        });
    })
    .joining((user) => {
        onlineUsersLength++;
        $('#no-online-users').css('display', 'none');
        $('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><span class="icon icon-circle text-success"></span>  ${user.name}</li>`);
    })
    .leaving((user) => {
        onlineUsersLength--;
        if (onlineUsersLength == 1) {
            $('#no-online-users').css('display', 'block');
        }
        $('#user-' + user.id).remove();
    });

$('#chat-text').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        let body = $(this).val();
        let url = $(this).data('url');
        let userName = $('meta[name=user-name]').attr('content');
        $(this).val('');
        let data = {
            '_token': $('meta[name=csrf-token]').attr('content'),
            body: body,
        };
        $.ajax({
            url: url,
            type: "post",
            data: data,
            success: function () {
                $('#chat').append(`<div
                            class="mt-4 w-50 text-white p-3 rounded float-right bg-primary">
                            <p>${userName}</p>
                            <p>${body}</p>
                        </div>
                        <div class="clearfix"></div>`);
            }
        })
    }
});

window.Echo.channel('chat-group')
    .listen('MessageDelivered', (e) => {
        // console.log(e.message.body);
        $('#chat').append(`<div
                            class="mt-4 w-50 text-white p-3 rounded float-left bg-success">
                            <p>${e.message.user.name}</p>
                            <p>${e.message.body}</p>
                        </div>
                        <div class="clearfix"></div>`);
    });
