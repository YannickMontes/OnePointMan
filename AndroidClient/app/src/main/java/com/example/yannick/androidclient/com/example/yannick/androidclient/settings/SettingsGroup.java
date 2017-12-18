package com.example.yannick.androidclient.com.example.yannick.androidclient.settings;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.text.InputType;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist.AddUserToGroup;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;

import java.util.ArrayList;

public class SettingsGroup extends AppCompatActivity {

    private ArrayList<UserModelSettings> userModels;
    private ListView userList;
    private UserAdapterSettings userAdapter;
    private String groupName;
    private int groupId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings_group);

        Toolbar toolbar = (Toolbar) findViewById(R.id.settingsToolbar);
        groupName = getIntent().getExtras().get("groupName").toString();
        groupId = getIntent().getExtras().getInt("groupId");
        toolbar.setTitle(groupName);

        setSupportActionBar(toolbar);

        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        userList = (ListView) findViewById(R.id.listUserGroup);
        userList.setNestedScrollingEnabled(true);

        /*
        userModels = (ArrayList<UserModelSettings>)getIntent().getExtras().getSerializable("usersList");

        userAdapter = new UserAdapterSettings(userModels, getApplicationContext());
        userList.setAdapter(userAdapter);*/

    }

    @Override
    protected void onResume() {
        super.onResume();
        userModels = new ArrayList<>();
        userAdapter = new UserAdapterSettings(userModels, getApplicationContext());
        userList.setAdapter(userAdapter);

        VolleyRequester.getInstance(getApplicationContext()).getUserInGroup(groupId, userModels, userAdapter);

        userAdapter.notifyDataSetChanged();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        getMenuInflater().inflate(R.menu.menu_settings_group, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        switch (id)
        {
            case android.R.id.home:
                onBackPressed();
                break;
            case R.id.addMemberSettings:
                Intent addUserToGroupIntent = new Intent(getApplicationContext(), AddUserToGroup.class);
                addUserToGroupIntent.putExtra("groupName", groupName);
                addUserToGroupIntent.putExtra("groupId", groupId);
                addUserToGroupIntent.putExtra("usersList", userModels);
                addUserToGroupIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
                startActivity(addUserToGroupIntent);
                break;
            case R.id.changeNameGroup:
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Changer le nom du groupe");

                final EditText input = new EditText(this);
                input.setInputType(InputType.TYPE_CLASS_TEXT);
                builder.setView(input);
                builder.setMessage("Rentrer le nouveau nom du groupe");

                builder.setPositiveButton("Changer", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        groupName = input.getText().toString();
                        VolleyRequester.getInstance(getApplicationContext()).changeGroupName(groupName, groupId);
                        ((Toolbar)findViewById(R.id.settingsToolbar)).setTitle(groupName);
                    }
                });
                builder.setNegativeButton("Retour", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });

                builder.show();
                break;
            case R.id.deleteGroupSettings:
                new AlertDialog.Builder(this)
                        .setTitle("Supprimer le groupe ")
                        .setMessage("Voulez-vous vraiment supprimer ce groupe?")
                        .setIcon(android.R.drawable.ic_dialog_alert)
                        .setPositiveButton(R.string.oui, new DialogInterface.OnClickListener() {

                            public void onClick(DialogInterface dialog, int whichButton) {
                                //TODO Envoyer la requete de delete
                                Toast.makeText(getApplicationContext(), "Groupe delete", Toast.LENGTH_SHORT).show();
                                onBackPressed();
                            }})
                        .setNegativeButton(R.string.non, null).show();
                break;
        }

        return super.onOptionsItemSelected(item);
    }
}
