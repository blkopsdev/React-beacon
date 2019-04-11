import { TrackJS } from 'trackjs';

const TrackJSLogger = (store: any) => (next: any) => (action: any) => {
  try {
    // log every action so they appear in the TrackJS telemetry timeline
    TrackJS.console.log(action);
    return next(action);
  } catch (err) {
    // Something bad happened, lets log out the entire state so we can see it in the timeline
    console.warn(store.getState());

    // NOTE: this assumes TrackJS was initialized previously, at app startup.
    TrackJS.track(err);
  }
};

export default TrackJSLogger;
