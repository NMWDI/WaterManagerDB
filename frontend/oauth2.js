
// adapted from https://tasoskakour.com/blog/react-use-oauth2
import {useCallback, useState} from 'react'

const OAUTH_STATE_KEY = 'react-use-oauth2-state-key'
const POPUP_HEIGHT = 700
const POPUP_WIDTH = 600
const OAUTH_RESPONSE = 'react-use-oauth2-response';

// https://medium.com/@dazcyril/generating-cryptographic-random-state-in-javascript-in-the-browser-c538b3daae50
const generateState = () => {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(40)
    window.crypto.getRandomValues(array);
    array = array.map((x) => validChars.codePointAt(x % validChars.length));
    const randomState = String.fromCharCode.apply(null, array);
    return randomState;
}

const saveState = (state: string ) => {
    sessionStorage.setItem(OAUTH_STATE_KEY, state)
}

const removeState = ()=>{
    sessionStorage.removeItem(OAUTH_STATE_KEY)
}

const openPopup = (url) => {
    // To fix issues with window.screen in multi-monitor setups, the easier option is to
	// center the pop-up over the parent window.
    const top = window.outerHeight / 2 + window.screenY - POPUP_HEIGHT / 2;
	const left = window.outerWidth / 2 + window.screenX - POPUP_WIDTH / 2;

    return window.open(
        url,
        'OAuth2 Popup',
        `height=${POPUP_HEIGHT}, width=${POPUP_WIDTH},top=${top}, left=${left}`
    )
}

const closePopup = (popupRef) =>{
    popupRef.current?.close()
}

const cleanup = (intervalRef, popupRef, handleMessageListener) => {
    clearInterval(intervalRef.current);
	closePopup(popupRef);
	removeState();
	window.removeEventListener('message', handleMessageListener);
}

const enhanceAuthorizeUrl = (authorizeUrl,
                             clientId, redirectUri,scope, state) =>{
    return `${authorizeUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
}

const useOAuth2 = (props) => {
    const {
        authorizeUrl,
        clientId,
        redirectUri,
        scope = '',
    } = props;

    const popupRef = useRef();
    const [{ loading, error}, setUI] = useState({loading: false, error: null})

    const getAuth = useCallback(()=>{
        setUI({
            loading: true,
            error: null
        });

        const state = generateState()
        saveState(state)

        popupRef.current = openPopup(
            enhanceAuthorizeUrl(authorizeUrl, clientId, redirectUri, scope, state)
        )

        async function handleMessageListener(message) {
        try {
          const type = message && message.data && message.data.type;
          if (type === OAUTH_RESPONSE) {
            const errorMaybe = message && message.data && message.data.error;
            if (errorMaybe) {
              setUI({
                loading: false,
                error: errorMaybe || 'Unknown Error',
              });
            } else {
              const code = message && message.data && message.data.payload && message.data.payload.code;
              // ... Check next step to see what we'll do with the code
            }
          }
        } catch (genericError) {
          console.error(genericError);
          setUI({
            loading: false,
            error: genericError.toString(),
          });
        } finally {
          // Clear stuff ...
          cleanup(intervalRef, popupRef, handleMessageListener);
        }
      }
      window.addEventListener('message', handleMessageListener);

      // 4. Begin interval to check if popup was closed forcefully by the user
      intervalRef.current = setInterval(() => {
        const popupClosed = !popupRef.current || !popupRef.current.window || popupRef.current.window.closed;
        if (popupClosed) {
          // Popup was closed before completing auth...
          setUI((ui) => ({
            ...ui,
            loading: false,
          }));
          console.warn('Warning: Popup was closed before completing authentication.');
          clearInterval(intervalRef.current);
          removeState();
          window.removeEventListener('message', handleMessageListener);
        }
      }, 250);

      // Remove listener(s) on unmount
      return () => {
        window.removeEventListener('message', handleMessageListener);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };


    })
}