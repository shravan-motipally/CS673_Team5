import {
	GPT2,
	DISTIL_GPT2,
	BLOOM,
	GOOGLE_FLAN_T5_BASE,
	GPT3_SMALL,
	SUMMARIZATION_FB_BART_LARGE_CNN, OPEN_LLAMA_3B
} from "../utils/Urls";

export interface ScreenContextType {
	screenState: ScreenState,
	setScreenState: React.Dispatch<React.SetStateAction<ScreenState>>;
}

type GenerativeModel = string;

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
}