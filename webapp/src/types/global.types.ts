
export interface ScreenContextType {
	screenState: ScreenState,
	setScreenState: React.Dispatch<React.SetStateAction<ScreenState>>;
}

export interface ScreenState {
	screen: string,
	isAuthed: boolean,
	isError: boolean,
}