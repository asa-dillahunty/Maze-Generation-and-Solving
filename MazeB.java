import java.awt.image.*;
import java.awt.*;
import javax.imageio.*;
import java.io.*;

import java.util.*;

public class MazeB
{
	int h,w;
	int d;
	boolean[][] maze;
	
	public MazeB(int x,int y)
	{
		d=0;
		w=x*2+1;
		h=y*2+1;
		
		maze = new boolean[w][h];
		
		
		maze[0][1]=true;
		maze[w-1][h-2]=true;
		
		RBMaze();
	}
	
	public void saveMaze(String filename)
	{
		BufferedImage img=new BufferedImage(w,h,BufferedImage.TYPE_BYTE_BINARY);
		for(int i=0;i<w;i++)
			for(int j=0;j<h;j++)
			{
				int c=255;
				if (!maze[i][j]) 
				{
					c=0;
				}
				
				try
				{	
					img.setRGB(i,j,(new Color(c,c,c)).getRGB());
				}
				catch (Exception e)
				{
				}
			}
		try
		{
			ImageIO.write(img,"png",new File(filename));
		}
		catch(Exception e)
		{
		}
	}
	
	public void RBMaze()
	{
		Stack<Integer> vex=new Stack<Integer>();
		{
			int n=(int)(Math.random()*(h-1));
			int m=(int)(Math.random()*(w-1));
			if (n%2==0) n++;
			if (m%2==0) m++;
			vex.add(m*h+n);
		}
		while (!vex.isEmpty())
		{
			Integer curr=vex.pop();
			Integer[] pos=getPos(curr);
			maze[curr/h][curr%h]=true;
			
			if (pos==null) continue;
			if (pos.length>1)
				vex.add(curr);
			
			Integer next=pos[(int)(Math.random()*pos.length)];
			vex.add(next);
			maze[next/h][next%h]=true;
			maze[(curr/h+next/h)/2][(curr%h+next%h)/2]=true;
		}
	}

	public Integer[] getPos(Integer curr)
	{
		short[] dx={2,-2};
		
		Stack<Integer> options=new Stack<Integer>();
		int counter=0;
		int x=curr/h;
		int y=curr%h;
		
		for (int i=0;i<2;i++)
		{
			try
			{
				if (!maze[x+dx[i]][y])
				{
					options.add(curr+dx[i]*h);
					counter++;
				}
			}
			catch (Exception e){}

			try
			{
				if (!maze[x][y+dx[i]])
				{
					options.add(curr+dx[i]);
					counter++;
				}
			}
			catch (Exception e){}
		}
		
		if (counter==0) return null;
		Integer[] pos=new Integer[counter];
		counter=0;
		while (!options.isEmpty())
		{
			pos[counter]=options.pop();
			counter++;
		}
		return pos;
	}
	
	public static int fib(int x)
	{
		if (x<2) return 1;
		return fib(x-1)+fib(x-2);
	}
	
	public static void main(String[] args)
	{
		long start=System.nanoTime();
		try
		{
			int iterations=21;
			for (int i=0;i<=iterations;i++)
			{	
				System.out.println("Making maze"+i+".png");
				MazeB maze = new MazeB(fib(i+1),fib(i));
				System.out.println("Saving maze"+i+".png");
				maze.saveMaze("maze"+i+".png");
				
				System.out.println();
			}
		}
		catch (Exception e){System.out.println("Something went wrong :'(");}
		
		long end=System.nanoTime();
		long time=(long)((end-start)/(Math.pow(10,9)));
		System.out.println("\n"+time+" seconds");
	}
}
