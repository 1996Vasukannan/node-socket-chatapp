const generateUserMessage=(username,message)=>{
    const createdAt=new Date().getTime()
    return{
        username,
        text:message,
        createdAt
    }
}

module.exports=generateUserMessage