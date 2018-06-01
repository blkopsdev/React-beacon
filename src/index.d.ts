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
    }

    export function adalFetch (
        authContext: any,
        resourceGuiId: any,
        fetch: any,
        url: any,
        options: any

    ): any

    export function withAdalLogin (
        authContext: any,
        resourceId: string
    ): any

    export function runWithAdal(authContext: AuthenticationContext, callback: () => void, shouldLogin?: boolean): any; 
}