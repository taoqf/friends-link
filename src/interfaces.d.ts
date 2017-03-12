export interface IConfig {
	PORT: number;
	APPID: string;
	APPSECRET: string;
	TOKEN: string;
	PREFIX: string;
	MPPREFIX: string;
	ACAO: string;
}

export interface Hash<T>{
	[key: string]: T;
}