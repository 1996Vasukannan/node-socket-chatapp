const users=[]

const addUser=({id, username, room})=>{
    
    const userName= username.trim().toLowerCase()
    const Room=room.trim().toLowerCase()

    if(!userName || !Room){
        return {error:'Room and Username Required'}
    }

   const existingUser=users.find(user=> user.room===Room && user.username===userName)

   if(existingUser){
       return({error:'Name is in use'})
   }
   const user = {id,username,room}
   users.push(user)

   return {user}
}

const getUser=({id})=>{
    const user=users.find(user=>user.id===id)
    return user
}

const removeUser=({id})=>{
    const index=users.findIndex(user=>user.id ===id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUserInRoom=(room)=>{

    return users.filter(user=>user.room ===room)

}

module.exports={addUser,getUser,removeUser,getUserInRoom}