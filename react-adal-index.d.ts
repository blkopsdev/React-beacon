/*
* @jfbloom22 created this type file
* you must manually put it in node_modules/@types/react-adal and rename it to be index.d.ts
*/

// commented out so that it does not conflict
/*
declare module 'react-adal' {
    export interface AdalConfig {
        tenant: string,
        clientId: string,
        endpoints: {
          api: string
        },
        postLogoutRedirectUri?: string | undefined,
        redirectUri?: string | undefined,
        cacheLocation?: string | undefined,
        expireOffsetSeconds?: number | undefined
    }

    export interface CompleteAdalConfig extends AdalConfig {
        loginResource: string | undefined
    }

    export interface IAdalUser {
        userName: string,
        profile: {
            family_name: string,
            given_name: string,
            name: string,
            unique_name: string,
            ver: string
        }
    }

    export class AuthenticationContext {
        config: CompleteAdalConfig;

        constructor(adalConfig: AdalConfig);

        getCachedToken(resource: string): string | undefined;
        getCachedUser(): IAdalUser | undefined;
        acquireToken(resource: string, cb: (message : string, token: string, msg?: string)=> any): () => any ;
        login(): any;
        logOut(): any;
    }

    export function adalFetch (
        authContext: AuthenticationContext,
        resourceGuiId: string,
        fetch: any,
        url: string,
        options: any

    ): any

    export function withAdalLogin (
        authContext: AuthenticationContext,
        resourceId: string
    ): any

    export function runWithAdal(authContext: AuthenticationContext, callback: () => void, shouldLogin?: boolean): any; 
}
*/