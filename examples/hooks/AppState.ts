import {useEffect, useState} from 'react';
import {AppState, type AppStateStatus} from 'react-native';

export default function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (newState: AppStateStatus) => {
        setAppState(newState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
}
