package com.example.yannick.androidclient.com.example.yannick.androidclient.login;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.NavDrawer;
import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.Profile;
import com.facebook.ProfileTracker;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;

import java.util.Arrays;

/**
 * Created by yannick on 04/12/17.
 */

public class MainActivity extends Activity {
    private LoginButton loginButton;
    private CallbackManager callbackManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FacebookSdk.sdkInitialize(getApplicationContext());
        callbackManager = CallbackManager.Factory.create();
        setContentView(R.layout.main_activity);
        loginButton = findViewById(R.id.login_button);
        loginButton.setReadPermissions(Arrays.asList("user_friends"));
        loginButton.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {

            private ProfileTracker profileTracker;

            @Override
            public void onSuccess(LoginResult loginResult) {
                System.out.println("On success login button");
                if(Profile.getCurrentProfile() == null)
                {
                    profileTracker = new ProfileTracker() {
                        @Override
                        protected void onCurrentProfileChanged(Profile oldProfile, Profile currentProfile) {
                            System.out.println("On current profile change");
                            retreiveInfos();
                            authServer();
                            goToMap();
                            profileTracker.stopTracking();
                        }
                    };
                }
            }

            @Override
            public void onCancel() {
                System.out.println("Cancel login");
            }

            @Override
            public void onError(FacebookException e) {
                System.out.println(e.toString());
            }
        });

        if(isLogged())
        {
            System.out.println("On est dans le is logged");
            retreiveInfos();
            authServer();
            goToMap();
        }
    }

    private void authServer()
    {
        VolleyRequester.getInstance(getApplicationContext()).authServer(FacebookInfosRetrieval.user_id,
                AccessToken.getCurrentAccessToken().getToken());
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        System.out.println("On activity result");

        if(callbackManager.onActivityResult(requestCode, resultCode, data))
        {
            System.out.println("On activity result call back");
            return;
        }
    }

    public boolean isLogged()
    {
        return  AccessToken.getCurrentAccessToken() != null;
    }

    private void goToMap() {
        Intent intent = new Intent(this, NavDrawer.class);
        startActivity(intent);
    }

    private void retreiveInfos()
    {
        System.out.println("On est dans le retreive infos");
        Profile.fetchProfileForCurrentAccessToken();
        Profile profile = Profile.getCurrentProfile();
        FacebookInfosRetrieval.user_id = profile.getId();
        FacebookInfosRetrieval.user_name = profile.getFirstName() + " " + profile.getLastName();
    }
}
