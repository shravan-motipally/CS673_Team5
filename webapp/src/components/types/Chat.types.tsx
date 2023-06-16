export interface Message {
	id: number,
	createdAt: number,
	text: string,
	uid: string,
	photoURL: string,
	type: 'sent' | 'received',
}

export interface ChatMessageType {
	message: Message
}