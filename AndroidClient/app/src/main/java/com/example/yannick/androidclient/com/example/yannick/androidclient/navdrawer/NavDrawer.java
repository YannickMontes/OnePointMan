package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.app.AlertDialog;
import android.app.FragmentManager;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.text.InputType;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.yannick.androidclient.com.example.yannick.androidclient.login.FacebookInfosRetrieval;
import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.squareup.picasso.Picasso;

public class NavDrawer extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private Menu navigationMenu;
    private Menu settingsMenu;
    private boolean isDrawing;
    private MapFragment mapFragment;

    private static final int DESSINER = 1;
    private static final int STOP_DESSINER = 2;
    private static final int ENVOYER_DESSIN = 3;
    private static final int DELETE_TRACKING = 4;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitle("OnePointMan");
        setContentView(R.layout.activity_nav_drawer);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        final DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        FragmentManager fm = getFragmentManager();
        mapFragment = new MapFragment();
        fm.beginTransaction().replace(R.id.content_frame, mapFragment, "MAP_FRAGMENT").commit();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        navigationMenu = navigationView.getMenu();

        View hView =  navigationView.getHeaderView(0);
        ImageView profilePic = hView.findViewById(R.id.profilePicture);
        ((TextView) hView.findViewById(R.id.userName)).setText(FacebookInfosRetrieval.user_name);

        if(profilePic != null)
        {
            Picasso.with(this).load("https://graph.facebook.com/"+FacebookInfosRetrieval.user_id+"/picture?type=large")
                    .placeholder(R.drawable.loading_image)
                    .error(R.drawable.not_found_image)
                    .into(profilePic);
        }

        isDrawing = false;

        VolleyRequester.getInstance(getApplicationContext()).displayGroupForNavDrawer(navigationMenu, false);

        final Handler updateGroupInfos = new Handler();
        final String url = "http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo";

        drawer.addDrawerListener(new DrawerLayout.DrawerListener() {
            @Override
            public void onDrawerSlide(View drawerView, float slideOffset) {
                if(isDrawing)
                {
                    drawer.closeDrawer(GravityCompat.START);
                }
            }

            @Override
            public void onDrawerOpened(View drawerView) {
                if(isDrawing)
                {
                    drawer.closeDrawer(GravityCompat.START);
                }
            }

            @Override
            public void onDrawerClosed(View drawerView) {

            }

            @Override
            public void onDrawerStateChanged(int newState) {

            }
        });

    }
    public Menu getMenu() {
        return navigationMenu;
    }

    @Override
    protected void onResume() {
        super.onResume();
        VolleyRequester.getInstance(getApplicationContext()).displayGroupForNavDrawer(navigationMenu, true);
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        settingsMenu = menu;
        settingsMenu.clear();
        settingsMenu.add(Menu.NONE, DESSINER, Menu.NONE, "Dessiner");
        settingsMenu.add(Menu.NONE, DELETE_TRACKING, Menu.NONE, "Supprimer le tracking");
        settingsMenu.add(Menu.NONE, 7, Menu.NONE, "Afficher dessins");
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        switch (id)
        {
            case DESSINER:
                settingsMenu.clear();
                settingsMenu.add(Menu.NONE, ENVOYER_DESSIN, Menu.NONE, "Envoyer le dessin");
                settingsMenu.add(Menu.NONE, STOP_DESSINER, Menu.NONE, "Annuler le dessin");
                mapFragment.takeSnapshotAndLauchDrawFragment(getFragmentManager());
                isDrawing = true;
                break;
            case STOP_DESSINER:
                settingsMenu.clear();
                settingsMenu.add(Menu.NONE, DESSINER, Menu.NONE, "Dessiner");
                settingsMenu.add(Menu.NONE, DELETE_TRACKING, Menu.NONE, "Supprimer le tracking");
                settingsMenu.add(Menu.NONE, 7, Menu.NONE, "Afficher dessins");
                getFragmentManager().beginTransaction().replace(R.id.content_frame, mapFragment, "MAP_FRAGMENT").commit();
                isDrawing = false;
                break;
            case ENVOYER_DESSIN:
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Description du dessin");

                final EditText input = new EditText(this);
                input.setInputType(InputType.TYPE_CLASS_TEXT);
                builder.setView(input);
                builder.setMessage("Choisir la description du dessin");

                builder.setPositiveButton("Envoyer", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        String description = input.getText().toString();
                        DrawFragment drawFragment = ((DrawFragment)getFragmentManager().findFragmentByTag("DRAW_FRAGMENT"));
                        byte[] image = drawFragment.takeSnapshot();

                        VolleyRequester.getInstance(getApplicationContext())
                                .sendDrawing(drawFragment.getIdgroup(), description,
                                        drawFragment.getZoom(), drawFragment.getBounds(), image);
                        
                        settingsMenu.clear();
                        settingsMenu.add(Menu.NONE, DESSINER, Menu.NONE, "Dessiner");
                        settingsMenu.add(Menu.NONE, DELETE_TRACKING, Menu.NONE, "Supprimer le tracking");
                        settingsMenu.add(Menu.NONE, 7, Menu.NONE, "Afficher dessins");
                        getFragmentManager().beginTransaction().replace(R.id.content_frame, mapFragment, "MAP_FRAGMENT").commit();
                        isDrawing = false;
                    }
                });
                builder.setNegativeButton("Retour", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });

                builder.show();
                //TODO REQUETE ENVOI DU DESSIN
                break;
            case DELETE_TRACKING:
                VolleyRequester.getInstance(getApplicationContext()).updateTracking(false, MapFragment.instance.getCurrentGroup());
                VolleyRequester.getInstance(getApplicationContext()).deleteTracking(MapFragment.instance.getCurrentGroup());
                break;
            case 7:
                VolleyRequester.getInstance(getApplicationContext()).getDrawings(mapFragment.getCurrentGroup());
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        switch(id)
        {
            case R.id.add_group:
                if(!isDrawing)
                {
                    AlertDialog.Builder builder = new AlertDialog.Builder(this);
                    builder.setTitle("Choisir le nom du groupe");

                    final EditText input = new EditText(this);
                    input.setInputType(InputType.TYPE_CLASS_TEXT);
                    builder.setView(input);
                    builder.setMessage("Rentrer le nouveau nom du groupe");

                    builder.setPositiveButton("Créer", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            VolleyRequester.getInstance(getApplicationContext()).createNewGroup(input.getText().toString());
                        }
                    });
                    builder.setNegativeButton("Retour", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.cancel();
                        }
                    });

                    builder.show();
                }
                break;
            case R.id.nav_logout:
                if(!isDrawing)
                {

                }
                break;
            default:
                break;
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    public Menu getNavigationMenu(){
        return navigationMenu;
    }
}
