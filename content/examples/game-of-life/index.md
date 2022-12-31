---
title: "Game of Life"
date: 2022-12-28T02:19:50-05:00
draft: false
---

John Conway's Game of Life cellular automaton programmed using this game engine. I created this example to test the Group class, which allows you to store Sprites inside of an Array-like object.

In the current implementation, the Group class extends Array, giving it all of the normal Array properties and methods.

Sprite properties and methods can also be called on a Group to update all of the items in the Group.

Like Arrays, Groups can be stored inside of one another to create multi-dimensional Groups that maintain all of the aforementioned features.