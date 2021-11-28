const socket=io()

$messageForm=document.querySelector('#message-form')
$messageFormButton=document.querySelector('#messageSendButton')
$locationSendButton=document.querySelector('#locationSendButton')
$messageContainer=document.querySelector('#message-container')
$messageinput=document.querySelector('#message-input')
$chatSideBar=document.querySelector('.chat__sidebar')


messageTemplate=document.querySelector('#message-template').innerHTML
locationTemplate=document.querySelector('#location-template').innerHTML
sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
joiningMessageTemplate=document.querySelector('#userJoiningTemplate').innerHTML
ownMessageTemplate=document.querySelector('#ownMessageTemplate').innerHTML
ownLocationMessageTemplate=document.querySelector('#ownLocationMessageTemplate').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


//AutoScroll

const autoScroll=()=>{

    $messageContainer.scrollTop=$messageContainer.scrollHeight

    // const $newMessage=$messageContainer.lastElementChild

    // const newMessageStyles=getComputedStyle($newMessage)
    // const newMessageMarginBottom=parseInt(newMessageStyles.marginBottom)
    // const newMessageHeight =$newMessage.offsetHeight +newMessageMarginBottom

    // const containerHeight=$messageContainer.scrollHeight

    // const visibleHeight=$messageContainer.offsetHeight

    // const scrolledFromTop=$messageContainer.scrollTop+visibleHeight

    // if(containerHeight-newMessageHeight<=scrolledFromTop){
    //     $messageContainer.scrollTop=$messageContainer.scrollHeight
    // }
    // else{
    //     $messageContainer.scrollTop=$messageContainer.scrollHeight
    // }
}

console.log(room)
socket.emit('join',{username,room},(error)=>{
    alert(error)
    location.href='/'
})

socket.on('sendUserMessage',(message)=>{
    console.log(message)

    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    }
    )
    $messageContainer.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('sendLocationMessage',(location)=>{
    console.log(location)
    const html= Mustache.render(locationTemplate,{
        username,
        location:location.text,
        createdAt:moment(location.createdAt).format('h:mm a')})

    $messageContainer.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{room,users})
    document.querySelector('#sidebar').innerHTML=html
    autoScroll()
})

socket.on('userJoiningEvent',(message)=>{
    console.log(message.text)
    const html=Mustache.render(joiningMessageTemplate,{
        username:message.username,
        message:message.text
    })
    $messageContainer.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('ownMessage',(message)=>{
    const html=Mustache.render(ownMessageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })

    $messageContainer.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('ownLocationMessage',(message)=>{
    const html=Mustache.render(ownLocationMessageTemplate,{
        username,
        location:location.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })

    $messageContainer.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const messageValue=e.target.elements.message.value
    socket.emit('sendMessage',messageValue,(error)=>{
        if(error){
            return alert(error)
        }

        $messageFormButton.removeAttribute('disabled')
        $messageinput.value=""
        $messageinput.focus()
    }
    
    )
})

$locationSendButton.addEventListener('click',()=>{
    $locationSendButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    {
        return alert('Geolocaion is not supported By your Browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $locationSendButton.removeAttribute('disabled')
            console.log('Location Delivered')
        })
    })
})