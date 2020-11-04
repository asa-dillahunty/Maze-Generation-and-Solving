import java.awt.image.*;
import java.awt.*;
import javax.imageio.*;
import java.io.*;

import java.util.*;

public class Maze
{
	int h,w;
	int d;
	byte[][] maze;
	
	public Maze(String filename)
	{
		maze=getImageArray(filename);
		
		h = maze[0].length;
		w = maze.length;
		
		maze[w-1][h-2]=1;
	}
	
	public Maze(int x,int y)
	{
		d=0;
		w=x*2+1;
		h=y*2+1;
		
		maze = new byte[w][h];
		
		for(int i=0;i<w;i++)
			for(int j=0;j<h;j++)
			{
				if (i%2==0 || j%2==0)
				{
				}
				else maze[i][j]=1;
			}
		
		maze[0][1]=1;
		maze[w-1][h-2]=1;
		
		primMaze();
		//RBMaze();
	}
	
	public void saveMaze(String filename, int z)
	{
		BufferedImage img=new BufferedImage(w*z,h*z,BufferedImage.TYPE_INT_RGB);
		for(int i=0;i<w;i++)
			for(int j=0;j<h;j++)
			{
				for (int u=0;u<z;u++)
					for (int v=0;v<z;v++)
					{
						int[] color=new int[3];
						if (maze[i][j]==0) 
						{
							color[0]=0;
							color[1]=0;
							color[2]=0;
						}
						else if (maze[i][j]==1 || maze[i][j]==2)
						{
							color[0]=255;
							color[1]=255;
							color[2]=255;
						}
						else if (maze[i][j]==3)
						{
							color[0]=255;
							color[1]=20;
							color[2]=147;
						}
						else if (maze[i][j]==4)
						{
							color[0]=30;
							color[1]=144;
							color[2]=255;
						}
						else if (maze[i][j]==5)
						{
							color[0]=128;
							color[1]=128;
							color[2]=128;
						}
						else
						{
							color[0]=0;
							color[1]=0;
							color[2]=0;
						}
						
						try
						{	
							img.setRGB(i*z+u,j*z+v,(new Color(color[0],color[1],color[2])).getRGB());
						}
						catch (Exception e)
						{
						}
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
	
	public void saveMaze(String filename)
	{
		BufferedImage img=new BufferedImage(w,h,BufferedImage.TYPE_INT_RGB);
		for(int i=0;i<w;i++)
			for(int j=0;j<h;j++)
			{
				int[] color=new int[3];
				if (maze[i][j]==0) 
				{
					color[0]=0;
					color[1]=0;
					color[2]=0;
				}
				else if (maze[i][j]==1 || maze[i][j]==2)
				{
					color[0]=255;
					color[1]=255;
					color[2]=255;
				}
				else if (maze[i][j]==3)
				{
					color[0]=255;
					color[1]=20;
					color[2]=147;
				}
				else if (maze[i][j]==4)
				{
					color[0]=30;
					color[1]=144;
					color[2]=255;
				}
				else if (maze[i][j]==5)
				{
					color[0]=128;
					color[1]=128;
					color[2]=128;
				}
				else
				{
					color[0]=0;
					color[1]=0;
					color[2]=0;
				}
				
				try
				{	
					img.setRGB(i,j,(new Color(color[0],color[1],color[2])).getRGB());
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
	
	public void saveMazeBlack(String filename)
	{
		BufferedImage img=new BufferedImage(w,h,BufferedImage.TYPE_BYTE_BINARY);
		for(int i=0;i<w;i++)
			for(int j=0;j<h;j++)
			{
				int v=0;
				if (maze[i][j]==2|| maze[i][j]==1) v=255;
				
				try
				{	
					img.setRGB(i,j,(new Color(v,v,v)).getRGB());
				}
				catch (Exception e)
				{
					img.setRGB(i,j,(new Color(v,v,v)).getRGB());
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
	
	public static byte[][] getImageArray(String filename)
	{
		int h;
		int w;
		byte[][] output=new byte[1][1];
		try
		{
			BufferedImage original= ImageIO.read(new File(filename));
			h=original.getHeight();
			w=original.getWidth();
			output=new byte[w][h];
			//BufferedImage img= new BufferedImage(h, w, BufferedImage.TYPE_3BYTE_BGR);
			//img.getGraphics().drawImage(original, 0, 0, null);
			for(int i=0;i<w;i++)
				for(int j=0;j<h;j++)
				{
					if ((int)(original.getRGB(i,j)&0xFF)>150)
					output[i][j]=2;
				}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.out.println("Importing "+filename+" isn't your thing.");
		}
		return output;
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
			maze[curr/h][curr%h]=2;
			
			if (pos==null) continue;
			if (pos.length>1)
				vex.add(curr);
			
			Integer next=pos[(int)(Math.random()*pos.length)];
			vex.add(next);
			maze[next/h][next%h]=2;
			maze[(curr/h+next/h)/2][(curr%h+next%h)/2]=2;
			//this.saveMaze("maze"+d+".png");
			//d++;
		}
	}
	
	public void primMaze()
	{
		ArrayList<Integer> vex=new ArrayList<Integer>();
		{
			int n=(int)(Math.random()*(h-1));
			int m=(int)(Math.random()*(w-1));
			if (n%2==0) n++;
			if (m%2==0) m++;
			vex.add(m*h+n);
			//this.saveMaze("/Users/ldillahunty/Desktop/MazePics/maze"+d+".png",10);
			//d++;
		}
		while (!vex.isEmpty())
		{
			Integer curr=vex.get((int)(Math.random()*vex.size()));
			Integer[] pos=getPos(curr);
			maze[curr/h][curr%h]=3;
			
			//this.saveMaze("/Users/ldillahunty/Desktop/MazePics/maze"+d+".png",10);
			//d++;
			
			if (pos==null) 
			{
				maze[curr/h][curr%h]=2;
				vex.remove(curr);
				continue;
			}
			
			if (pos.length<2)
			{
				maze[curr/h][curr%h]=2;
				vex.remove(curr);
			}
			else maze[curr/h][curr%h]=4;
			
			Integer next=pos[(int)(Math.random()*pos.length)];
			vex.add(next);
			maze[next/h][next%h]=4;//wasn't here before
			maze[(curr/h+next/h)/2][(curr%h+next%h)/2]=2;
			
			//this.saveMaze("/Users/ldillahunty/Desktop/MazePics/maze"+d+".png",10);
			//d++;
		}
	}
	
	public void solveRB()
	{
		int end = (h*(w-1)+h-2);
		Stack<Integer> vex=new Stack<Integer>();
		
		//saveMaze("/Users/ldillahunty/Desktop/MazePics/mazeSolved"+d+".png",10);
		//d++;
		
		vex.add(1);
		while (!vex.isEmpty())
		{
			int curr = vex.pop();
			int x=curr/h;
			int y=curr%h;
			maze[x][y]=4;
			
			//saveMaze("/Users/ldillahunty/Desktop/MazePics/mazeSolved"+d+".png",10);
			//d++;
		
			int[] pos=getPos1(curr);
			if (pos==null)
			{
				maze[x][y]=5;
				continue;
			}
			vex.add(curr);
			maze[x][y]=3;
		
			int next=pos[0];
			vex.add(next);
			maze[next/h][next%h]=3;
			
			//saveMaze("/Users/ldillahunty/Desktop/MazePics/mazeSolved"+d+".png",10);
			//d++;
			
			if (end==next) return;
		}
	}
	
	public Integer[] getPos(Integer curr)
	{
		short[] dx={2,-2};
		
		Stack<Integer> options=new Stack<Integer>();
		int counter=0;
		
		for (int i=0;i<2;i++)
		{
			try
			{
				if (maze[curr/h+dx[i]][curr%h]==1)
				{
					options.add(curr+dx[i]*h);
					counter++;
				}
			}
			catch (Exception e)
			{
			}
		}
		
		for (int i=0;i<2;i++)
		{
			try
			{
				if (maze[curr/h][curr%h+dx[i]]==1)
				{
					options.add(curr+dx[i]);
					counter++;
				}
			}
			catch (Exception e)
			{
			}
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
	
	public int[] getPos1(Integer curr)
	{		
		Stack<Integer> options=new Stack<Integer>();
		int counter=0;
		
		try
		{
			if (maze[curr/h-1][curr%h]==2 || maze[curr/h-1][curr%h]==1)
			{
				options.add(curr-1*h);
				counter++;
			}
		}
		catch (Exception e){}
		
		try
		{
			if (maze[curr/h][curr%h-1]==2 || maze[curr/h][curr%h-1]==1)
			{
				options.add(curr-1);
				counter++;
			}
		}
		catch (Exception e){}
		
		try
		{
			if (maze[curr/h][curr%h+1]==2 || maze[curr/h][curr%h+1]==1)
			{
				options.add(curr+1);
				counter++;
			}
		}
		catch (Exception e){}
		
		try
		{
			if (maze[curr/h+1][curr%h]==2 || maze[curr/h+1][curr%h]==1)
			{
				options.add(curr+h);
				counter++;
			}
		}
		catch (Exception e){}
		
		if (counter==0) return null;
		int[] pos=new int[counter];
		counter=0;
		while (!options.isEmpty())
		{
			pos[counter]=options.pop();
			counter++;
		}
		return pos;
	}
	
	public String toString()
	{
		String output="";
		for (int i=0;i<w;i++)
		{
			for (int j=0;j<h;j++)
				output+=" "+maze[i][j];
				
			output+="\n";
		}
		return output;
	}
	
	public static int fib(int x)
	{
		if (x<2) return 1;
		return fib(x-1)+fib(x-2);
	}
	
	public static void main(String[] args)
	{
		long start=System.nanoTime();
		int iterations=21;
		try
		{
			//int i=7;
			for (int i=0;i<=iterations;i++)
			{	
				System.out.println("Making maze"+i+".png");
				Maze maze = new Maze(fib(i+1),fib(i));
				System.out.println("Saving maze"+i+".png");
				maze.saveMazeBlack("maze"+i+".png");
				
				System.out.println();
			}
		}
		catch (Exception e){System.out.println(e);}
		
		try 
		{
			for (int i=0;i<=iterations;i++)
			{
				System.out.println("Reading in maze");
				Maze maze=new Maze("maze"+i+".png");
				//maze.d=0;
				System.out.println("Solving maze "+i);
				long s=System.nanoTime();
				
				maze.solveRB();
				long e=System.nanoTime();
				long time=(long)((e-s)/(Math.pow(10,9)));
				System.out.println(time+" seconds");
				
				System.out.println("Saving maze "+i+"\n");
				maze.saveMaze("maze"+i+"Solved.png");
			}
		}
		catch (Exception e){System.out.println(e);}
		long end=System.nanoTime();
		long time=(long)((end-start)/(Math.pow(10,9)));
		System.out.println("\n"+time+" seconds");
	}
}
