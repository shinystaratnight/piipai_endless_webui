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

  private cam: ASCamera;

  constructor(camera: ASCamera) {
    this.cam = camera;
  }

  public capture(x?: any) {
    try {
      return this.cam.capture(x);
    } catch (e) {
      console.error(e);
    }
  }

  public save(x?: any) {
    try {
      return this.cam.save(x);
    } catch (e) {
      console.error(e);
    }
  }

  public setCamera(x?: any) {
    try {
      return this.cam.setCamera(x);
    } catch (e) {
      console.error(e);
    }
  }

  public getCameraSize() {
    try {
      return { width: this.cam.width, height: this.cam.height };
    } catch (e) {
      console.error(e);
    }
  }

  public getCameraList() {
    try {
      return this.cam.getCameraList();
    } catch (e) {
      console.error(e);
    }
  }
}
