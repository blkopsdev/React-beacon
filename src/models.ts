export interface InitialState {
    user : Iuser;
    ajaxCallsInProgress: number;
}

export interface Iuser {
    username: string;
}