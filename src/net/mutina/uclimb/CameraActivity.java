package net.mutina.uclimb;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import net.mutina.uclimb.R;

import android.app.Activity;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.hardware.Camera;
import android.hardware.Camera.AutoFocusCallback;
import android.hardware.Camera.PictureCallback;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;

public class CameraActivity extends Activity {

	private static final String TAG = "CameraActivity";
	
    private Camera mCamera;
    private ForegroundCameraPreview mPreview;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.foregroundcameraplugin);

        // Create an instance of Camera
        mCamera = getCameraInstance();
        mCamera.setDisplayOrientation(90);

        // Create our Preview view and set it as the content of our activity.
        mPreview = new ForegroundCameraPreview(this, mCamera);
        FrameLayout preview = (FrameLayout) findViewById(R.id.camera_preview);
        preview.addView(mPreview);
        
        // Add a listener to the Capture button
        Button captureButton = (Button) findViewById(R.id.button_capture);
        captureButton.setOnClickListener(
            new View.OnClickListener() {
            public void onClick(View v) {
                // get an image from the camera
                mCamera.autoFocus( new AutoFocusCallback() {
					
					public void onAutoFocus(boolean success, Camera camera) {
						mCamera.takePicture(null, null, mPicture);
					}
				});
            }
        });
            
        Button cancelButton = (Button) findViewById(R.id.button_cancel);
        cancelButton.setOnClickListener(
        	new View.OnClickListener() {
				public void onClick(View v) {
					setResult(RESULT_CANCELED);
					finish();
				}
			});
    }

    
    @Override
    protected void onPause() {
        if (mCamera != null){
            mCamera.release();        // release the camera for other applications
            mCamera = null;
        }
        super.onPause();
    }
    
    /** A safe way to get an instance of the Camera object. */
    public static Camera getCameraInstance(){
        Camera c = null;
        try {
            c = Camera.open(); // attempt to get a Camera instance
        }
        catch (Exception e){
            // Camera is not available (in use or does not exist)
        }
        return c; // returns null if camera is unavailable
    }
    
    private PictureCallback mPicture = new PictureCallback() {

        public void onPictureTaken(byte[] data, Camera camera) {
        	Bitmap bmp = BitmapFactory.decodeByteArray(data, 0, data.length);
        	Matrix rotateMatrix = new Matrix();
        	rotateMatrix.postRotate(90);
        	Bitmap rotatedBitmap = Bitmap.createBitmap(bmp, 0, 0, bmp.getWidth(), bmp.getHeight(), rotateMatrix, false);

        	Uri fileUri = (Uri) getIntent().getExtras().get(MediaStore.EXTRA_OUTPUT);
        	File pictureFile = new File(fileUri.getPath());

            try {
                FileOutputStream fos = new FileOutputStream(pictureFile);
            	boolean success = rotatedBitmap.compress(Bitmap.CompressFormat.JPEG, 75, fos);
                fos.close();
            } catch (FileNotFoundException e) {
                Log.d(TAG, "File not found: " + e.getMessage());
            } catch (IOException e) {
                Log.d(TAG, "Error accessing file: " + e.getMessage());
            }
			setResult(RESULT_OK);
			finish();
        }
    };
}