package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;

/**
 * Created by Arnaud Ricaud on 04/12/2017.
 */

public class LocationService implements LocationListener{

    //Instance de la classe
    private static LocationService instance = null;

    private LocationManager locationManager;
    private Location location;
    private Context thisContext;

    //Méthode pour récupérer l'instance de la classe
    public static LocationService getLocationService(Context context){
        if (instance == null) {
            instance = new LocationService(context);
        }
        return instance;
    }

    //Constructeur:
    private LocationService( Context context )     {
        thisContext = context;
        this.locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        if ( ContextCompat.checkSelfPermission( context, android.Manifest.permission.ACCESS_FINE_LOCATION ) != PackageManager.PERMISSION_GRANTED){
                Log.v("ERREUR", "Impossible de créer l'instance de localisation: permission refusée");
                return ;
        }

        try {
            // Status des connections Wi-Fi et GPS
            boolean isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
            if (!isGPSEnabled){
                Log.v("ERROR","Service de localisation indisponible!");
            } else {
                if (isGPSEnabled)  {
                    if (locationManager != null)  {
                        location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                        if (location == null){
                            if(locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)){
                                location = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                                Log.v("Location Service","NETWORK LAST POSITION: Longitude(" + location.getLongitude() + ") Latitude(" + location.getLatitude()+")");
                            }
                        } else {
                            Log.v("Location Service","GPS LAST POSITION: Longitude(" + location.getLongitude() + ") Latitude(" + location.getLatitude()+")");
                        }
                    }
                }
            }
        } catch (Exception ex)  {
            Log.v("ERROR", "Error creating location service: " + ex.getMessage() );
        }
        Log.v("LOCALISATION", "Instance créée.");
    }

    public Location getLocation() {
        return location;
    }

    @Override
    public void onLocationChanged(Location newLocation) {
        location = newLocation;
        VolleyRequester restRequester = VolleyRequester.getInstance(thisContext);
        //restRequester.sendMyPosition(location);
        Log.v("Location Service","NEW POSITION: Longitude(" + location.getLongitude() + ") Latitude(" + location.getLatitude()+")");
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {
        Log.v("LOCALISATION", s + " provider activée");
    }

    @Override
    public void onProviderDisabled(String s) {
        Log.v("LOCALISATION", s + " provider désactivée");
    }
}
