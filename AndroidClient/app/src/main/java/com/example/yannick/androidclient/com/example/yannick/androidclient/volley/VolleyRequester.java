package com.example.yannick.androidclient.com.example.yannick.androidclient.volley;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.location.Location;
import android.support.v4.widget.CompoundButtonCompat;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ListView;
import android.widget.Switch;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist.AddUserToGroup;
import com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist.UserAdapterAdd;
import com.example.yannick.androidclient.com.example.yannick.androidclient.settings.UserAdapterSettings;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist.UserModelAdd;
import com.example.yannick.androidclient.com.example.yannick.androidclient.login.FacebookInfosRetrieval;
import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.settings.UserModelSettings;
import com.example.yannick.androidclient.com.example.yannick.androidclient.settings.SettingsGroup;
import com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.MapFragment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

/**
 * Created by yannick on 05/12/17.
 */

public class VolleyRequester
{
    private static VolleyRequester instance;
    private RequestQueue requestQueue;
    private static Context context;
    //private final String URL_SERVEUR = "http://192.168.0.108:3001";
    private final String URL_SERVEUR = "http://192.168.137.1:3001";
    //private final String URL_SERVEUR = "http://192.168.43.202:3001";

    private VolleyRequester(Context context)
    {
        this.context = context;
        requestQueue = getRequestQueue();
    }

    public static synchronized VolleyRequester getInstance(Context context) {
        if (instance == null) {
            instance = new VolleyRequester(context);
        }
        return instance;
    }

    public RequestQueue getRequestQueue() {
        if (requestQueue == null) {
            requestQueue = Volley.newRequestQueue(context.getApplicationContext());
        }
        return requestQueue;
    }

    public <T> void addToRequestQueue(Request<T> req) {
        getRequestQueue().add(req);
    }

    public void authServer(String idUser, String token)
    {
        String json = "{\"userId\":\""+ idUser + "\",\"token\":\""
                + token + "\"}";
        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest authRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/fblogin/" +
                            "authAndroid", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {

                            Log.v("CONNEXION_BACKEND", "Connexion à TEAM BACKEND OK MAGGLE");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("CONNEXION_BACKEND", "Authentification au serveur echouée");
                    error.printStackTrace();
                }
            });
            this.addToRequestQueue(authRequest);
        }
        catch(Exception ex)
        {
            System.out.println(ex.toString());
        }
    }

    public void groupsRequest(){
        String idUser = FacebookInfosRetrieval.user_id;
        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/groups/"+ idUser, null,
                new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                System.out.println("Response: " + response.toString());
            }
        }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO Auto-generated method stub
                //MDR LÉ EREUR C POUR LÉ FèBLe

                System.out.println("Erreur lors de la demande des groupes: " + error.toString());
            }
        });
        this.addToRequestQueue(grpRequest);
    }

    public void displayGroupForNavDrawer(final Menu menuNavDrawer, final boolean firstGroup)
    {
        boolean fstGroup = firstGroup;
        String idUser = FacebookInfosRetrieval.user_id;
        JsonObjectRequest setGroups = new JsonObjectRequest(Request.Method.GET,
                URL_SERVEUR + "/groups/" + idUser, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        try {
                            JSONArray array = (JSONArray) response.get("message");
                            menuNavDrawer.findItem(R.id.groups).getSubMenu().clear();
                            boolean fstGroup = firstGroup;
                            for(int i=0; i < array.length(); i++)
                            {
                                final JSONObject groupe = (JSONObject) array.get(i);
                                final int id = groupe.getInt("idgroup");
                                final String name = groupe.getString("nomgroup");
                                final boolean isSharing = groupe.getBoolean("issharing");
                                final boolean isTracking = groupe.getBoolean("istracking");
                                final JSONArray membres = (JSONArray) groupe.get("membres");
                                final ArrayList<UserModelSettings> users = new ArrayList<>();
                                for(int j=0; j<membres.length(); j++)
                                {
                                    final JSONObject user = (JSONObject) membres.get(j);
                                    users.add(new UserModelSettings(user.getString("prenom") + user.getString("nomuser"),
                                            user.get("iduser").toString(), id));
                                }
                                MenuItem mi = menuNavDrawer.findItem(R.id.groups)
                                        .getSubMenu().add(0, id, i, name);
                                //mi.setIcon(R.drawable.group);
                                ImageButton settingsButton = new ImageButton(context);
                                settingsButton.setImageResource(R.drawable.bouton_style);
                                settingsButton.setBackgroundResource(0);
                                settingsButton.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View view) {
                                        Intent settings = new Intent(context, SettingsGroup.class);
                                        settings.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
                                        settings.putExtra("groupName", name);
                                        settings.putExtra("groupId", id);
                                        //settings.putExtra("usersList", users);
                                        context.startActivity(settings);
                                    }
                                });

                                Switch trackerSwitch = new Switch(context);
                                //TODO Color!
                                if (isTracking){
                                    trackerSwitch.setChecked(true);
                                }
                                trackerSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                                    @Override
                                    public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                                        if (b){
                                            updateTracking(true, id);
                                        }else{
                                            updateTracking(false, id);
                                        }
                                    }
                                });

                                CheckBox sharingPositionBox = new CheckBox(context);
                                if (isSharing){
                                    sharingPositionBox.setChecked(true);
                                }
                                int states[][] = {{android.R.attr.state_checked}, {}};
                                int colors[] = {Color.BLACK, Color.BLACK};

                                CompoundButtonCompat.setButtonTintList(sharingPositionBox, new ColorStateList(states, colors));
                                sharingPositionBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                                    @Override
                                    public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                                        if (b){
                                            updateLocationSharing(true, id);
                                        }else{
                                            updateLocationSharing(false, id);
                                        }
                                    }
                                });


                                LinearLayout actionLayout = new LinearLayout(context);
                                actionLayout.addView(trackerSwitch);
                                actionLayout.addView(sharingPositionBox);
                                actionLayout.addView(settingsButton);
                                actionLayout.setGravity(Gravity.CENTER_VERTICAL);
                                actionLayout.setBaselineAligned(true);

                                mi.setActionView(actionLayout);
                                mi.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
                                    @Override
                                    public boolean onMenuItemClick(MenuItem menuItem) {
                                        System.out.println("Clicked on " + menuItem.getItemId());
                                        MapFragment activity = MapFragment.instance;
                                        activity.setCurrentGroup(id);
                                        activity.clearMarkers();
                                        VolleyRequester.getInstance(context).groupPositionUpdate(activity.getCurrentGroup());
                                        activity.updateDisplayMarkers();
                                        return false;
                                    }
                                });
                                if(fstGroup){
                                    MapFragment.instance.setCurrentGroup(id);
                                    fstGroup = false;
                                }
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("Erreur lors de la récupérations des groupes");
            }
        });
        VolleyRequester.getInstance(context).addToRequestQueue(setGroups);
    }


    public void updateLocationSharing(boolean share, int idGroup){
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+ idUser + ",\"idgroup\":"
                + idGroup + ",\"positionSharing\":" + share +"}";

        try {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest updateSharingPosition = new JsonObjectRequest (Request.Method.POST,
                    URL_SERVEUR + "/users/updatepositionsharing/", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                        Log.v("SHARING POSITION", "Partage de position mis à jour!");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    // TODO Auto-generated method stub
                    //MDR LÉ EREUR C POUR LÉ FèBLe
                    Toast.makeText(context,"Serveur indisponible, partage de position non mis à jour!", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(updateSharingPosition);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void deleteTracking(int idGroup){
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+ idUser + ",\"idgroup\":" + idGroup +"}";

        try {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest deleteTracking = new JsonObjectRequest (Request.Method.POST,
                    URL_SERVEUR + "/tracking/deletetracking/", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("TRACKING", "Tracking supprimé!");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    // TODO Auto-generated method stub
                    //MDR LÉ EREUR C POUR LÉ FèBLe
                    Toast.makeText(context,"Serveur indisponible, tracking non supprimé!", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(deleteTracking);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void updateTracking(boolean track, int idGroup){
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+ idUser + ",\"idgroup\":"
                + idGroup + ",\"tracking\":" + track +"}";

        try {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest updateTracking = new JsonObjectRequest (Request.Method.POST,
                    URL_SERVEUR + "/tracking/settracking/", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("TRACKING", "Tracking mis à jour!");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    // TODO Auto-generated method stub
                    //MDR LÉ EREUR C POUR LÉ FèBLe
                    Toast.makeText(context,"Serveur indisponible, tracking non mis à jour!", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(updateTracking);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    /*Pour request du JSON:
        https://developer.android.com/training/volley/request.html
     */


    public void sendMyPosition(Location myPosition){
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+ idUser + ",\"userlt\":"
                + myPosition.getLatitude() + ",\"userlg\":" + myPosition.getLongitude() +"}";
        Log.v("TEST2", json);
        try {
            JSONObject bodyJson = new JSONObject(json);

        JsonObjectRequest postMyPosition = new JsonObjectRequest (Request.Method.POST,
                URL_SERVEUR + "/users/updateposition/", bodyJson,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            if((response.getString("status")).equals("success")){
                                Log.v("SEND POSITION", "Position envoyée avec succès!");
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO Auto-generated method stub
                //MDR LÉ EREUR C POUR LÉ FèBLe
                System.out.println("Erreur lors de la demande des groupes: " + error.toString());
            }
        });
            this.addToRequestQueue(postMyPosition);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void groupPositionUpdate(int group){

        String idUser = FacebookInfosRetrieval.user_id;
        JsonObjectRequest grpInfoRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/groups/positions/" + idUser + "/" + group, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            if((response.getString("status")).equals("success")){
                                Log.v("GET GROUP INFO", "Information des groupes bien reçues");
                                Log.v("GET GROUP INFO",response.toString());
                                updateMapFromJson(response.getJSONObject("message"));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO Auto-generated method stub
                //MDR LÉ EREUR C POUR LÉ FèBLe
                System.out.println("Erreur lors de la demande des positions d'un groupe: " + error.toString());
            }
        });
        this.addToRequestQueue(grpInfoRequest);
    }


    void updateMapFromJson(JSONObject json){
        try {
            //On commence par les pinpoints
            for(int i=0; i< json.getJSONArray("pinpoints").length(); i++) {
                JSONObject pinPoint =  json.getJSONArray("pinpoints").getJSONObject(i);
                int idPinPoint = pinPoint.getInt("idpinpoint");
                String userName = pinPoint.getString("prenomcreator") + " " + pinPoint.getString("nomcreator");
                double lt = Double.parseDouble(pinPoint.getString("pinlt"));
                double lg = Double.parseDouble(pinPoint.getString("pinlg"));
                String daterdv = pinPoint.getString("daterdv");
                String desc = pinPoint.getString("description");
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
                format.setTimeZone(TimeZone.getTimeZone("GMT"));
                Date date = format.parse(daterdv);
                String dateDisplayed = new SimpleDateFormat("HH:mm - dd MM yyyy").format(date);

                String pinPointTitle = "Point de rdv n°" + idPinPoint;


                String pinPointSnippet = "Date: " + dateDisplayed + "\r\n"
                        + "Createur: " + userName + "\r\n"
                        + "Description: " + desc;

                MarkerOptions marker = new MarkerOptions()
                        .position(new LatLng(lt, lg))
                        .title(pinPointTitle)
                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE))
                        .snippet(pinPointSnippet);


                MapFragment activity = MapFragment.instance;
                activity.addMarker("Pinpoint" + idPinPoint, marker);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try {
            for(int i=0; i< json.getJSONArray("userpositions").length(); i++) {
                JSONObject usersPosition = json.getJSONArray("userpositions").getJSONObject(i);
                if (!usersPosition.getString("userlt").equals("null")) {
                    int iduser = usersPosition.getInt("iduser");
                    String userName = usersPosition.getString("prenom") + " " +usersPosition.getString("nom");
                    double userlt = Double.parseDouble(usersPosition.getString("userlt"));
                    double userlg = Double.parseDouble(usersPosition.getString("userlg"));
                    String dateposition = usersPosition.getString("dateposition");
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
                    format.setTimeZone(TimeZone.getTimeZone("GMT"));
                    Date date = format.parse(dateposition);
                    String dateDisplayed = new SimpleDateFormat("HH:mm - dd MM yyyy").format(date);


                    String usersPositionTitle = userName;
                    String usersPositionSnippet = "Date dernière position:\r\n" + dateDisplayed;
                    float color;

                    if (usersPosition.getBoolean("current")) {
                        color = BitmapDescriptorFactory.HUE_GREEN;
                    } else {
                        color = BitmapDescriptorFactory.HUE_RED;
                    }

                    MarkerOptions marker = new MarkerOptions()
                            .position(new LatLng(userlt, userlg))
                            .title(usersPositionTitle)
                            .snippet(usersPositionSnippet)
                            .icon(BitmapDescriptorFactory.defaultMarker(color));

                    MapFragment activity = MapFragment.instance;
                    activity.addMarker(Integer.toString(iduser), marker);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        try {
            for(int i=0; i< json.getJSONArray("trackings").length(); i++) {
                MapFragment.instance.updateTraceFromJson(json.getJSONArray("trackings").getJSONObject(i), i);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void deleteUserFromGroup(final String itemId, final int groupId)
    {
        try
        {
            JSONObject bodyJson = new JSONObject();
            bodyJson.put("iduser", itemId);
            bodyJson.put("idgroup", groupId);
            System.out.println(bodyJson.toString());
            JsonObjectRequest deleteRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/users/deleteuser", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("DELETE_USER", "User " + itemId + " bien delete du groupe " + groupId);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
                    Log.v("DELETE_USER", "Fail to delete user "+itemId + " from group "+groupId + " : "+error.getMessage());
                }

            }){
                @Override
                public Map<String, String> getHeaders() throws AuthFailureError
                {
                    Map<String, String>  headers = new HashMap<>();
                    headers.put("Content-Type", "application/json");
                    return headers;
                }
            };

            this.addToRequestQueue(deleteRequest);
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void addUserToGroup(final String itemId, final int groupId)
    {
        String json = "{\"iduser\":"+itemId+",\"idgroup\":" + groupId + "}";

        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest addRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/users/createuser", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("ADD_USER", "User " + itemId + " bien add du groupe " + groupId);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
                    Log.v("ADD_USER", "Fail to add user "+itemId + "from group "+groupId);
                }
            });
            this.addToRequestQueue(addRequest);
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void retreiveUserFriendList(final ArrayList<UserModelSettings> users, final ArrayList<UserModelAdd> toFill, final int idGroup, final ListView listView)
    {
        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/users/userFriends/"+FacebookInfosRetrieval.user_id, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        try
                        {
                            JSONArray array = (JSONArray) response.get("friendlist");
                            for(int i=0; i<array.length(); i++)
                            {
                                boolean notFound = true;
                                JSONObject user = (JSONObject) array.get(i);
                                String id = user.getString("id");
                                String name = user.getString("name");

                                if(users != null)
                                {
                                    for(UserModelSettings tmpUser : users)
                                    {
                                        if(id.equals(tmpUser.getId()))
                                        {
                                            notFound = false;
                                            break;
                                        }
                                    }
                                }

                                if(notFound)
                                {
                                    toFill.add(new UserModelAdd(name, id, idGroup, false));
                                }
                            }

                            UserAdapterAdd userAdapter = new UserAdapterAdd(toFill, context);
                            listView.setAdapter(userAdapter);
                            Log.v("FRIENDS_LIST", "Done, friends list bien retrieve");
                        }
                        catch(Exception ex)
                        {
                            Log.v("FRIENDS_LIST", "Erreur lors du fetch de la reponse JSON: "+ex.getMessage());
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
                Log.v("FRIENDS_LIST", "Erreur lors de la recupération de la liste d'amis: "+error.getMessage());
            }
        });
        this.addToRequestQueue(grpRequest);
    }

    public void createNewGroup(final String newGroupName)
    {
        String json = "{\"iduser\":"+FacebookInfosRetrieval.user_id+", \"groupname\":\""+newGroupName+"\"}";

        try
        {
            JSONObject objetJSON = new JSONObject(json);
            JsonObjectRequest createGroupRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/groups/creategroup", objetJSON,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response)
                        {
                            Log.v("CREATE_GROUP", "Groupe "+newGroupName+ " bien cree");
                            Intent addUserToGroupIntent = new Intent(context, AddUserToGroup.class);
                            addUserToGroupIntent.putExtra("groupName", newGroupName);
                            try {
                                addUserToGroupIntent.putExtra("groupId", response.getInt("idgroup"));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            addUserToGroupIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
                            context.startActivity(addUserToGroupIntent);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("CREATE_GROUP", "Groupe non créé");
                    Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(createGroupRequest);
        }
        catch(Exception ex)
        {
            Log.v("CREATE_GROUP", "Fail to create groupe "+newGroupName+" "+ex.getMessage());
        }
    }

    public void changeGroupName(String groupName, final int groupId)
    {
        String json = "{\"idgroup\":"+groupId+", \"newgroupname\":\""+groupName+"\"}";

        System.out.println(json);

        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest deleteRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/groups/changegroupname/", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response)
                        {
                            Log.v("CHANGE_GROUP_NAME", "GROUPE "+groupId+": Nom du groupe bien changé");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("CHANGE_GROUP_NAME", "GROUPE "+groupId+": Erreur changement de nom du groupe");
                    Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(deleteRequest);
        }
        catch(Exception ex)
        {
            Log.v("CHANGE_GROUP_NAME", "GROUPE "+groupId+": Erreur changement de nom du groupe");
        }
    }

    public void sendNewPinPoint(int groupId, LatLng lglt, String desc, String date)
    {
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+idUser+",\"idgroup\":" + groupId
            + ",\"pinlg\":"+ lglt.longitude +",\"pinlt\":" + lglt.latitude
            + ",\"description\":\""+ desc +"\",\"daterdv\":\"" + date +"\"}";

        Log.v("PINPOINT",json);

        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest addRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/pinpoint/createpinpoint", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("PINPOINT_ADD", "Add succesfully");

                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("PINPOINT_ADD", "Pinpoint add error");
                    Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(addRequest);
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }


    public void getUserInGroup(final int groupId, final ArrayList<UserModelSettings> userModels, final UserAdapterSettings adapter)
    {
        JsonObjectRequest grpInfoRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/groups/getGroupInfo/"+groupId, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray userArray = (JSONArray)response.get("listeMembres");

                            for(int i=0; i < userArray.length(); i++)
                            {
                                JSONObject user = (JSONObject)userArray.get(i);
                                String id = user.get("iduser").toString();
                                String name = user.getString("prenom") + " " + user.getString("nom");

                                userModels.add(new UserModelSettings(name, id, groupId));
                            }

                            adapter.notifyDataSetChanged();
                            Log.v("GET_USER_GROUP", "Get user in group ok");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.v("GET_USER_GROUP", "Error retreive user in group");
                Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
            }
        });
        this.addToRequestQueue(grpInfoRequest);
    }

    public void deletePinPoint(int groupId, int idPinPoint)
    {
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+idUser+",\"idgroup\":" + groupId
                + ",\"idpinpoint\":"+ idPinPoint + "}";

        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest deletePinPointRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/pinpoint/deletepinpoint", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("PINPOINT_DELETE", "Delete succesfully");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("PINPOINT_DELETE", "Delete fail");
                    Toast.makeText(context,"Serveur indisponible, point non supprimé!", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(deletePinPointRequest);
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void sendDrawing(int idgroup, String description, float zoom, LatLngBounds latLng, byte[] img)
    {
        String idUser = FacebookInfosRetrieval.user_id;
        String encodedImage = Base64.encodeToString(img, Base64.NO_WRAP);
        String json = "{\"iduser\":"+idUser+",\"idgroup\":" + idgroup
                + ",\"description\":\""+ description + "\", \"zoom\":"+zoom+", \"nelt\":" +
                latLng.northeast.latitude + ", \"nelg\":" + latLng.northeast.longitude + ", \"swlt\":"
                + latLng.southwest.latitude + ", \"swlg\":" + latLng.southwest.longitude +
                ", \"img\":\"" + encodedImage + "\"}";

        Log.v("DRAWING", json);

        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest sendDrawing = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/drawing/createdrawing", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("DRAWING_ADD", "Add drawing success");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("DRAWING_ADD", "Add drawing fail");
                    Toast.makeText(context,"Serveur indisponible, dessin non ajouté!", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(sendDrawing);
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void deleteDrawing(int iddrawing)
    {
        String json = "{\"iddrawing:\""+iddrawing+"}";
        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest sendDrawing = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/drawing/deletedrawing", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("DELETE_DRAWING", "Delete drawing success");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("DELETE_DRAWING", "Delete drawing failed");
                    Toast.makeText(context,"Serveur indisponible, dessin non supprimé!", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(sendDrawing);
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void getDrawings(int idgroup)
    {
        String idUser = FacebookInfosRetrieval.user_id;

        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/groups/drawings/"+idUser+"/"+idgroup, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        try
                        {
                            JSONObject msg = (JSONObject) response.get("message");
                            JSONArray drawings = msg.getJSONArray("drawings");

                            for(int i=0; i < drawings.length(); i++)
                            {
                                JSONObject tmpDraw = drawings.getJSONObject(i);
                                MapFragment.instance.addDrawingToList(tmpDraw);
                            }

                            Log.v("GET_DRAWINGS", "Done, drawing list bien retrieve");
                        }
                        catch(Exception ex)
                        {
                            Log.v("GET_DRAWINGS", "Erreur lors du fetch de la reponse JSON: "+ex.getMessage());
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(context,"Serveur indisponible. Veuillez réessayer", Toast.LENGTH_SHORT);
                Log.v("GET_DRAWINGS", "Erreur lors de la recupération des dessins: "+error.getMessage());
            }
        });
        this.addToRequestQueue(grpRequest);
    }
}
