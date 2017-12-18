package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.widget.Toast;

import com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.LocationService;
import com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.MapFragment;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

/**
 * Created by Arnaud Ricaud on 05/12/2017.
 */

public class DisplayThread implements Runnable {
    private final int MY_POSITION_UPDATE_TIME = 3000;
    private Handler handler = new Handler();
    private boolean displayThreadRunning = true;
    private boolean firstGroup = true;
    private Location myLocation;
    private MapFragment activity;

    @Override
    public void run() {
        if (displayThreadRunning) {
            activity = MapFragment.instance;
            VolleyRequester requester = VolleyRequester.getInstance(activity.getActivity().getApplicationContext());
            LocationService locationService = LocationService.getLocationService(activity.getActivity().getApplicationContext());
            LocationManager locationManager;
            locationManager = (LocationManager) activity.getActivity().getSystemService(Context.LOCATION_SERVICE);
            if (ActivityCompat.checkSelfPermission(activity.getActivity().getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                myLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                Log.v("Location", "Updating position...");
                myLocation = locationService.getLocation();
                if (myLocation != null) {
                    activity.getActivity().runOnUiThread(new Thread(new Runnable() {
                        public void run(){
                            if ((myLocation != null) && (activity.mMap != null)) {
                                MarkerOptions marker = new MarkerOptions()
                                        .position(new LatLng(myLocation.getLatitude(), myLocation.getLongitude()))
                                        .title("Here I am!")
                                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_YELLOW))
                                        .snippet("Latitude: " + myLocation.getLatitude() + "\r\nLongitude: " + myLocation.getLongitude());
                                activity.addMarker("_MY_SELF_", marker);
                            }
                            //Toast.makeText(activity.getActivity().getApplicationContext(), "Longitude(" + myLocation.getLongitude() + ")\nLatitude(" + myLocation.getLatitude()+")", Toast.LENGTH_LONG).show();

                            Log.v("POSITION", "Longitude: " + myLocation.getLongitude() + " Latitude: " + myLocation.getLatitude());
                        }
                    }));
                    requester.sendMyPosition(myLocation);
                }
                Log.v("LOCATION", "Update displayed!");
                activity.updateDisplayMarkers();
                requester.displayGroupForNavDrawer(((NavDrawer)activity.getActivity()).getMenu(), firstGroup);
                if(firstGroup){
                    firstGroup = false;
                }

                if(activity.getCurrentGroup() != 0)
                {
                    requester.groupPositionUpdate(activity.getCurrentGroup());
                }
                handler.postDelayed(this, MY_POSITION_UPDATE_TIME);
            }
        }
    }
    public void stopDisplay(){
        displayThreadRunning = false;
    }
    public boolean getdisplayThreadRunning(){
        return displayThreadRunning;
    }
}
