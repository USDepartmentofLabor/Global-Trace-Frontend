import { Html5Qrcode } from 'html5-qrcode';
import { CameraDevice } from 'html5-qrcode/esm/core';
import { Html5QrcodeCameraScanConfig } from 'html5-qrcode/esm/html5-qrcode';
import { SCAN_QR_CODE_CONFIG } from 'config/constants';

export default class QRCodeScanner {
  private config: Html5QrcodeCameraScanConfig;
  private html5QRCode: Html5Qrcode;

  constructor(renderElementId: string, config?: Html5QrcodeCameraScanConfig) {
    this.html5QRCode = new Html5Qrcode(renderElementId);
    this.config = config || SCAN_QR_CODE_CONFIG;
  }

  getCameras = (): Promise<CameraDevice[]> => {
    return Html5Qrcode.getCameras();
  };

  scanQRCode = (
    cameraId: string,
    onSuccess: (text: string) => void,
    onError?: () => void,
  ): Promise<null> => {
    return this.html5QRCode.start(
      cameraId,
      this.config,
      (result) => {
        onSuccess(result);
      },
      onError,
    );
  };

  async stop(onSuccess?: () => void, onError?: () => void): Promise<void> {
    try {
      await this.html5QRCode.stop();
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
}
