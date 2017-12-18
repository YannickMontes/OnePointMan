package com.example.yannick.androidclient.com.example.yannick.androidclient.draw;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

/**
 * Created by yannick on 12/12/17.
 */

public class Drawing
{
    private int idDrawing;
    private int idGroup;
    private String idCreator;
    private String nomCreator;
    private String prenomCreator;
    private LatLngBounds bounds;
    private Bitmap image;
    private int height;
    private int width;

    public Drawing(int idDrawing, int idGroup, String idCreator, String nomCreator, String prenomCreator, LatLngBounds bounds, String bytes) {
        this.idDrawing = idDrawing;
        this.idGroup = idGroup;
        this.idCreator = idCreator;
        this.nomCreator = nomCreator;
        this.prenomCreator = prenomCreator;
        this.bounds = bounds;
        byte[] decodedString = Base64.decode(bytes, Base64.NO_WRAP);
        this.image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
        this.height = image.getHeight();
        this.width = image.getWidth();
    }

    public int getIdDrawing() {
        return idDrawing;
    }

    public void setIdDrawing(int idDrawing) {
        this.idDrawing = idDrawing;
    }

    public int getIdGroup() {
        return idGroup;
    }

    public void setIdGroup(int idGroup) {
        this.idGroup = idGroup;
    }

    public String getIdCreator() {
        return idCreator;
    }

    public void setIdCreator(String idCreator) {
        this.idCreator = idCreator;
    }

    public String getNomCreator() {
        return nomCreator;
    }

    public void setNomCreator(String nomCreator) {
        this.nomCreator = nomCreator;
    }

    public String getPrenomCreator() {
        return prenomCreator;
    }

    public void setPrenomCreator(String prenomCreator) {
        this.prenomCreator = prenomCreator;
    }

    public LatLngBounds getBounds() {
        return this.bounds;
    }

    public void setBounds(LatLngBounds bounds) {
        this.bounds = bounds;
    }

    public Bitmap getImage() {
        return image;
    }

    public void setImage(Bitmap image) {
        this.image = image;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }
}
