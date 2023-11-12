import {Exchange} from "../screens/Edit";

export interface ScreenContextType {
	screenState: ScreenState,
	setScreenState: React.Dispatch<React.SetStateAction<ScreenState>>;
}

type GenerativeModel = string;

export type Role = 'Educator' | 'Account Administrator';

export interface ScreenState {
	screen: string,
	isAuthed: boolean,
	isError: boolean,
	photoUrl: string,
	generativeMode: boolean,
	darkMode: boolean
	generativeModel: GenerativeModel
	semanticSimilarityModel: string
	semanticSimilarityThreshold: number
	exchanges: Array<Exchange>
	currentClass: string | null
	currentClassName: string | null
	roles: Array<Role>
}