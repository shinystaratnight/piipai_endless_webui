/**
 * Action script fallback interface
 */
interface ASCamera {
  capture: Function;
  save: Function;
  setCamera: Function;
  getCameraList: Function;
  width: number;
  height: number;
}

/**
 * Fallback external interface callback's
 */
interface EventCallbacks {
  debug: Function;
  onCapture: Function;
  onTick: Function;
  onSave: Function;
}

/**
 * Adobe flash fallback dispatcher
 */
export class FallbackDispatcher {

  public static implementExternal(callbacks: EventCallbacks) {
    const win = <any> window;
    win.webcam = {
      debug: callbacks.debug,
      onCapture: callbacks.onCapture,
      onTick: callbacks.onTick,
      onSave: callbacks.onSave
    };
  }

  constructor(private camera: ASCamera) {}

  public capture(x?: any) {
    try {
      return this.camera.capture(x);
    } catch (e) {
      console.error(e);
    }
  }

  public save(x?: any) {
    try {
      return this.camera.save(x);
    } catch (e) {
      console.error(e);
    }
  }

  public setCamera(x?: any) {
    try {
      return this.camera.setCamera(x);
    } catch (e) {
      console.error(e);
    }
  }

  public getCameraSize() {
    try {
      return { width: this.camera.width, height: this.camera.height };
    } catch (e) {
      console.error(e);
    }
  }

  public getCameraList() {
    try {
      return this.camera.getCameraList();
    } catch (e) {
      console.error(e);
    }
  }
}
