export interface Iuser {
    password: string;
    username: string;
    isAuthenticated: boolean;
}

export interface InitialState {
    user : Iuser;
    ajaxCallsInProgress : number;
}

