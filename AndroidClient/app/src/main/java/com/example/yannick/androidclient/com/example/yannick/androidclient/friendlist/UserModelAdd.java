package com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist;

import com.example.yannick.androidclient.com.example.yannick.androidclient.settings.UserModelSettings;

/**
 * Created by yannick on 08/12/17.
 */

public class UserModelAdd extends UserModelSettings
{
    private boolean isInGroup;

    public UserModelAdd(String name, String id, int groupId) {
        super(name, id, groupId);
        isInGroup = true;
    }

    public UserModelAdd(String name, String id, int groupId, boolean isInGroup)
    {
        super(name, id, groupId);
        this.isInGroup = isInGroup;
    }

    public boolean isInGroup() {
        return isInGroup;
    }

    public void setInGroup(boolean inGroup) {
        isInGroup = inGroup;
    }
}
