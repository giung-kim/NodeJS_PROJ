const users = [];

const addUser = ({ id, username, room }) => {

    //빈칸 없애기
    username = username.trim();
    room = room.trim();

    //유효성 검사
    if (!username || !room) {
        return {
            error: '사용자 이름과 방이 필요합니다.'
        }
    }
    
    //기존 사용자 있는지 확인
    // const existingUser = users.find((user) => {
    //     return user.room === room && user.username === username
    // })

    // if (existingUser) {
    //     return {
    //         error: '사용자 이름이 사용 중입니다.'
    //     }
    // }

    // 유저 저장 
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const getUsersInRoom = (room) => {
    room = room.trim();

    //유저가 해당 방에 있는사람인지 필터링.
    return users.filter(user => user.room === room);
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const removeUser = (id) => {
    // 지우려고 하는 유저가 있는지 찾기 = -1
    //findIndex : [1,2,3]에서 1찾으면 0번째 인덱스반환, 4찾으면 -1반환
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        //만약 있다면 지우기 
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    addUser,
    getUsersInRoom,
    getUser,
    removeUser
}