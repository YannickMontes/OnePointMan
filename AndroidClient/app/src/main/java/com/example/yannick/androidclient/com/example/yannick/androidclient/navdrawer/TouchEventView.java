package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.drawable.BitmapDrawable;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by yannick on 10/12/17.
 */

public class TouchEventView extends View
{
    private Paint paint = new Paint();
    private Path path = new Path();

    private int currentColor;
    private float strokeWidth;
    private float mX, mY;

    public static int MAX_VALUE_STROKE = 70;

    private HashMap<Path, Paint> donepathsMap;
    private HashMap<Path, Paint> undonePathsMap;
    private ArrayList<Path> undonePaths;
    private ArrayList<Path> donepaths;

    public TouchEventView(Context context) {
        super(context);
        undonePaths = new ArrayList<>();
        donepaths = new ArrayList<>();
        donepathsMap = new HashMap<>();
        undonePathsMap = new HashMap<>();
        currentColor = Color.BLACK;
        strokeWidth = 4f;
        setPathAndPaintParams();
    }

    public TouchEventView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        undonePaths = new ArrayList<>();
        donepaths = new ArrayList<>();
        donepathsMap = new HashMap<>();
        undonePathsMap = new HashMap<>();
        currentColor = Color.BLACK;
        strokeWidth = 4f;
        setPathAndPaintParams();
    }

    public void setBackground(Bitmap back)
    {
        this.setBackground(new BitmapDrawable(getContext().getResources(), back));
    }

    private void setPathAndPaintParams()
    {
        paint.setAntiAlias(true);
        paint.setColor(currentColor);
        paint.setStrokeJoin(Paint.Join.ROUND);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(strokeWidth);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        for(Path p : donepathsMap.keySet())
        {
            canvas.drawPath(p, donepathsMap.get(p));
        }
        canvas.drawPath(path, paint);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        float xPos = event.getX();
        float yPos = event.getY();

        switch(event.getAction())
        {
            case MotionEvent.ACTION_DOWN:
                undonePathsMap.clear();
                undonePaths.clear();
                mX = xPos;
                mY = yPos;
                path.reset();
                path.moveTo(xPos, yPos);
                return true;
            case MotionEvent.ACTION_MOVE:
                float dx = Math.abs(xPos - mX);
                float dy = Math.abs(yPos - mY);
                if (dx >= 4 || dy >= 4) {
                    path.quadTo(mX, mY, (xPos+ mX)/2, (yPos + mY)/2);
                    mX = xPos;
                    mY = yPos;
                }
                break;
            case MotionEvent.ACTION_UP:
                path.lineTo(xPos, yPos);
                donepathsMap.put(path, paint);
                donepaths.add(path);
                path = new Path();
                paint = new Paint();
                setPathAndPaintParams();
                break;
            default:
                return false;
        }

        invalidate();
        return true;
    }

    public int getCurrentColor()
    {
        return  currentColor;
    }

    public void changeCurrentColor(int color)
    {
        this.currentColor = color;
        this.paint.setColor(this.currentColor);
    }


    public float getStrokeWidth() {
        return strokeWidth;
    }

    public void setStrokeWidth(float strokeWidth) {
        this.strokeWidth = strokeWidth;
        this.paint.setStrokeWidth(this.strokeWidth);
    }

    public void onUndoClick()
    {
        if(donepaths.size() > 0)
        {
            Path lastPath = donepaths.get(donepaths.size() - 1);
            undonePaths.add(lastPath);
            undonePathsMap.put(lastPath, donepathsMap.get(lastPath));
            donepaths.remove(lastPath);
            donepathsMap.remove(lastPath);
            invalidate();
        }
    }

    public void onRedoClick()
    {
        if(undonePaths.size() > 0)
        {
            Path lastPath = undonePaths.get(undonePaths.size() -1);
            donepathsMap.put(lastPath, undonePathsMap.get(lastPath));
            undonePathsMap.remove(lastPath);
            undonePaths.remove(lastPath);
            invalidate();
        }
    }

    public void removeBackground()
    {
        this.setBackgroundResource(0);
    }
}
