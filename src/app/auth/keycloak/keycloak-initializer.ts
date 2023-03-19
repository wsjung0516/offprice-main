import {KeycloakOptions, KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment';
// import {environment} from '@env/environment';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
    const options: KeycloakOptions = {
        config: environment.keycloak,
        loadUserProfileAtStartUp: true,
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/assets/silent-check-sso.html'
          }
    };
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => keycloak.init(options);
}
