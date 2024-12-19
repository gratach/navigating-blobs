# Navigating Blobs

This is a Javascript demo application for the graph navigation mechanism described in [this paper](https://debablo.de/planung/forum_konzeptentwurf.pdf). One can navigate the graph by clicking on the nodes of the graph. The application always shows the surrounding of the focused node. One can also create multiple focused nodes by double-clicking on a node.

A live version of the application can be found at [https://debablo.de/demo/](https://debablo.de/demo/).

## Installation

- Build the project with Webpack using the build script.
- Create the documentation with Jsdocs using the makedoc script.

# Project structure

The project consists of multiple Javascript files in the src/frontend folder. Each of them is representing a module that is implementing a separate aspect of the application. The modules should only interact with each other by using the interface that is documented via the Jsdocs documentation.
