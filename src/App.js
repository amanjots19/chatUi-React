
import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
	const [ data, setData ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([])

	const socketRef = useRef()
	
	useEffect(
		() => {
			socketRef.current = io.connect('http://localhost:3007');
			socketRef.current.on("send_message", ({ name, message}) => {
				console.log("hello",name + " hello 2", message)
				setChat([ ...chat, { name, message } ])
			})
			socketRef.current.emit('initalConn',{user:"admin"});	
			return () => socketRef.current.disconnect()
		},
		[chat]
	)

	const onTextChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = data
		socketRef.current.emit("send_message", {name, convoId:"1234456re33e", message,from:"1332dr24ffwef",to:"123443edd4r", chatGroupNumber:3 })
		e.preventDefault()
		setData({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className="card">
			<form onSubmit={onMessageSubmit}>
				<h1>Messenger</h1>
				<div className="name-field">
					<TextField name="name" onChange={(e) => onTextChange(e)} value={data.name} label="Name" />
				</div>
				<div>
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={data.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button>Send Message</button>
			</form>
			<div className="render-chat">
				<h1>Chat Log</h1>
				{renderChat()}
			</div>
		</div>
	)
}

export default App

