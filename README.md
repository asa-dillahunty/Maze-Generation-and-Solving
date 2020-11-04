# Maze Generation and Solving

This was a highschool programming project in which I demostrated the use of certain algorithms in solving mazes.

## How to execute
This must be run on a computer that has JAVA installed. Run either

```bash
javac Maze.java
java Maze
```
or
```bash
javac MazeB.java
java MazeB
```
The first method generates mazes using Prims algorithm and then solves them. This takes considerably more time (and RAM), but the mazes appear more random to me. The second method generates mazes using recursive backtracking.

## Maze Generation
First we generate a grid of squares whose dimensions are determined by fibinnaci numbers. Maze 0 was the 0th fibinnaci number (1) by the 1st fibinnaci number (1), maze 1 being the 1st fibinnaci number by the 2nd (1 by 2), maze 2 being the 2nd by the 3rd (2 by 3) and so on.
<ul class="exampleImages">
	<li>
		<figure>
			<img src="docs/images/maze32.png" alt="maze2"/> <figcaption>Maze 2</figcaption>
		</figure>
	</li>
	<li>
		<figure>
			<img src="docs/images/maze53.png" alt="maze3"/> <figcaption>Maze 3</figcaption>
		</figure>
	</li>
	<li>
		<figure>
			<img src="docs/images/maze85.png" alt="maze4"/> <figcaption>Maze 4</figcaption>
		</figure>
	</li>
</ul>

Mazes were not allowed to have cycles, meaning there could only be one path from any two points within the maze. To convert the grids into actual mazes, either Prim's algorithm or recursive backtracking were used.

<ul class="exampleImages">
	<li>
		<figure>
			<img src="docs/images/maze2.png" alt="maze2"/> <figcaption>Maze 2</figcaption>
		</figure>
	</li>
	<li>
		<figure>
			<img src="docs/images/maze3.png" alt="maze3"/> <figcaption>Maze 3</figcaption>
		</figure>
	</li>
	<li>
		<figure>
			<img src="docs/images/maze4.png" alt="maze4"/> <figcaption>Maze 4</figcaption>
		</figure>
	</li>
</ul>

Below is a video demonstration of Prim's Algorithm for generating mazes implemented in JAVA. The blue cells are cells currently in the list of possible cells to look at and the pink cell is the one currently being looked at.

<iframe src="https://www.youtube.com/embed/RiYUn40gsEY" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Because the fibonnaci sequence exhibits exponetial growth, the largest maze my computer could generate was maze 21, which is 17711 cells by 28657 cells.

## Maze Solving
Once the mazes were generated they were solved using recursive backtracking.
Because these mazes grow to massive sizes, the recursive backtracking algorithms used in maze generation and maze solving used a stack data structure instead of recursion to aviod reaching max recursive depth.
<ul class="exampleImages">
	<li>
		<figure>
			<img src="docs/images/maze2Solved.png" alt="maze 2 Solved"/> <figcaption>Maze 2 Solved</figcaption>
		</figure>
	</li>
	<li>
		<figure>
			<img src="docs/images/maze3Solved.png" alt="maze 3 Solved"/> <figcaption>Maze 3 Solved</figcaption>
		</figure>
	</li>
	<li>
		<figure>
			<img src="docs/images/maze4Solved.png" alt="maze 4 Solved"/> <figcaption>Maze 4 Solved</figcaption>
		</figure>
	</li>
</ul>

Below is a video demonstration of the maze generated in the previous video using
Recursive Backtracking. The grey cells are visited cells that resulted in a dead end, while the pink cells show the current solution's path.

<iframe src="https://www.youtube.com/embed/EH_vHpoNSf0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<style>
	ul.exampleImages {
		display:flex;
		flex-flow: row wrap;
		justify-content: center;
		list-style-type: none;
	}

	figcaption {
		display: block;
		text-align: center;
	}

	iframe {
		width:100%;
		height: 20rem;
		border: .5rem solid black;
	}
</style>