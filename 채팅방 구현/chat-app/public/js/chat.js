const socket = io();

const query = new URLSearchParams(location.search);
// '?username=John&room=Roomy'
const username = query.get('username');
// 'John'
const room = query.get('room');
// 'Roomy'


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html;
})

const messages = document.querySelector('#messages');
const messageTemplate = document.querySelector('#message-template').innerHTML;
//socket.emit 받아주는 부분
socket.on('message', (message) => {

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    messages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
})

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}


const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');

messageForm.addEventListener('submit', (e) => {          //e event객체
    e.preventDefault();

    messageFormButton.setAttribute('disabled', 'disabled');  //메세지 보내질때까지는 전송버튼 disable

    const message = e.target.elements.message.value;    //보내려 적은 메세지


    socket.emit('sendMessage', message, (error) => {
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value = '';
        messageFormInput.focus();

        if(error) {
            return console.log(error);
        }
    })

})