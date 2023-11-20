import {Exchange} from "../screens/Edit";
import {Course} from "../components/onepirate/Home";

export interface ScreenContextType {
	screenState: ScreenState,
	setScreenState: React.Dispatch<React.SetStateAction<ScreenState>>;
}

type GenerativeModel = string;

export type Role = 'Educator' | 'Account Administrator';

export interface ScreenState {
	screen: string,
	sessionId: string,
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
	currentClassObject: Course | null,
	roles: Array<Role>
}