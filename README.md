# Maze Generation and Solving

This was a highschool programming project in which I demonstrated the use of certain algorithms in generating and solving mazes.

For a live demo, and a slightly cleaner presentation of the concepts explained in the following readme, visit the project's page on my website at the link below<br/>
<a href='https://asa-dillahunty.github.io/Maze-Generation-and-Solving/'>
    <img margin=20px height=40px alt='React' src='https://img.shields.io/badge/website-000000?style=for-the-badge&logo=About.me&logoColor=white'>
</a>

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
First we generate a grid of squares whose dimensions are determined by fibonacci numbers. Maze 0 was the 0th fibonacci number (1) by the 1st fibonacci number (1), maze 1 being the 1st fibonacci number by the 2nd (1 by 2), maze 2 being the 2nd by the 3rd (2 by 3) and so on.

![Maze 2](docs/images/maze32.png)

**Maze 2**

![Maze 3](docs/images/maze53.png)

**Maze 3**

![Maze 4](docs/images/maze85.png)

**Maze 4**

Mazes were not allowed to have cycles, meaning there could only be one path from any two points within the maze. To convert the grids into actual mazes, either Prim's algorithm or an iterative implementation of randomized depth-first search were used.

![Maze 2](docs/images/maze2.png)

**Maze 2**

![Maze 3](docs/images/maze3.png)

**Maze 3**

![Maze 4](docs/images/maze4.png)

**Maze 4**

If curious watch [this video demonstration](https://youtu.be/RiYUn40gsEY) I made of Prim's Algorithm for generating mazes implemented in JAVA. The blue cells are cells currently in the list of possible cells to look at and the pink cell is the one currently being looked at.

Because the fibonacci sequence exhibits exponential growth, the largest maze my computer could generate was maze 21, which is 17711 cells by 28657 cells.

## Maze Solving
Once the mazes were generated they were solved using recursive backtracking.
Because these mazes grow to massive sizes, the recursive backtracking algorithm implemented utilized a stack data structure instead of recursion to avoid reaching max recursive depth.

![Maze 2](docs/images/maze2Solved.png)

**Maze 2**

![Maze 3](docs/images/maze3Solved.png)

**Maze 3**

![Maze 4](docs/images/maze4Solved.png)

**Maze 4**

For a visual, watch [this video demonstration](https://youtu.be/EH_vHpoNSf0) I created of the maze generated in the previous video being solved using Recursive Backtracking. The grey cells are visited cells that resulted in a dead end, while the pink cells show the current solution's path.