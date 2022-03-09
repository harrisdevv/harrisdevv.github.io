---
title:  "Java Collections Time and Space Complexity Reference"
date:   2022-03-09 16:15:41 +0700
categories: 
- algorithm
- data-structure 
tags:
- java
- collection
---
# Big O Notation
>**Big O notation** is a mathematical notation that describes the [limiting behavior](https://en.wikipedia.org/wiki/Asymptotic_analysis "Asymptotic analysis") of a [function](https://en.wikipedia.org/wiki/Function_(mathematics) "Function (mathematics)") when the [argument](https://en.wikipedia.org/wiki/Argument_of_a_function "Argument of a function") tends towards a particular value or infinity. Big O is a member of a [family of notations](https://en.wikipedia.org/wiki/Big_O_notation#Related_asymptotic_notations) invented by [Paul Bachmann](https://en.wikipedia.org/wiki/Paul_Gustav_Heinrich_Bachmann "Paul Gustav Heinrich Bachmann"),[[1]](https://en.wikipedia.org/wiki/Big_O_notation#cite_note-Bachmann-1) [Edmund Landau](https://en.wikipedia.org/wiki/Edmund_Landau "Edmund Landau"),[[2]](https://en.wikipedia.org/wiki/Big_O_notation#cite_note-Landau-2) and others, collectively called **Bachmann–Landau notation** or **asymptotic notation**. The letter O was chosen by Bachman to stand for _[Ordnung](https://en.wiktionary.org/wiki/Ordnung#German "wikt:Ordnung")_, meaning the [order of approximation](https://en.wikipedia.org/wiki/Order_of_approximation "Order of approximation").
>- Source: [Big O notation - Wikipedia](https://en.wikipedia.org/wiki/Big_O_notation)

# Java Collection Time Complexity & Internal Data Stuctures
## List
List | Add | Remove | Get | Contains | Next | Data Structure
---------------------|------|--------|------|----------|------|---------------
ArrayList | O(1) | O(n) | O(1) | O(n) | O(1) | Array
LinkedList | O(1) | O(1) | O(n) | O(n) | O(1) | Linked List
CopyOnWriteArrayList | O(n) | O(n) | O(1) | O(n) | O(1) | Array
Stack | Push O(1)|Pop O(1)| O(n) | O(n) | O(1) | Array

## Set
Set | Add | Remove | Contains | Next | Size | Data Structure
----------------------|----------|----------|----------|----------|------|-------------------------
HashSet | O(1) | O(1) | O(1) | O(h/n) | O(1) | Hash Table
LinkedHashSet | O(1) | O(1) | O(1) | O(1) | O(1) | Hash Table + Linked List
EnumSet | O(1) | O(1) | O(1) | O(1) | O(1) | Bit Vector
TreeSet | O(log n) | O(log n) | O(log n) | O(log n) | O(1) | Red-black tree
CopyOnWriteArraySet | O(n) | O(n) | O(n) | O(1) | O(1) | Array
ConcurrentSkipListSet | O(log n) | O(log n) | O(log n) | O(1) | O(n) | Skip List

## Queue
Queue | Offer | Peak | Poll | Remove | Size | Data Structure
------------------------|----------|------|----------|--------|------|---------------
LinkedList | O(1) | O(1) | O(1) | O(1) | O(1) | Array
PriorityQueue | O(log n) | O(1) | O(log n) | O(n) | O(1) | Priority Heap
ArrayDequeue | O(1) | O(1) | O(1) | O(n) | O(1) | Linked List
ConcurrentLinkedQueue | O(1) | O(1) | O(1) | O(n) | O(n) | Linked List
ArrayBlockingQueue | O(1) | O(1) | O(1) | O(n) | O(1) | Array
PriorirityBlockingQueue | O(log n) | O(1) | O(log n) | O(n) | O(1) | Priority Heap
DelayQueue | O(log n) | O(1) | O(log n) | O(n) | O(1) | Priority Heap
SynchronousQueue | O(1) | O(1) | O(1) | O(n) | O(1) | None!
LinkedBlockingQueue | O(1) | O(1) | O(1) | O(n) | O(1) | Linked List

## Map
Map | Get | ContainsKey | Next | Data Structure
----------------------|----------|-------------|----------|-------------------------
HashMap | O(1) | O(1) | O(h / n) | Hash Table
LinkedHashMap | O(1) | O(1) | O(1) | Hash Table + Linked List
IdentityHashMap | O(1) | O(1) | O(h / n) | Array
WeakHashMap | O(1) | O(1) | O(h / n) | Hash Table
TreeMap | O(log n) | O(log n) | O(log n) | Red-black tree
EnumMap | O(1) | O(1) | O(1) | Array
ConcurrentHashMap | O(1) | O(1) | O(h / n) | Hash Tables
ConcurrentSkipListMap | O(log n) | O(log n) | O(1) | Skip List
	
**h** stands for the current capacity of the hash collection.
	
# Measure input's size to choose suitable Java Collections
- To quickly pick the algorithm which can pass the time constraint, after we estimate the Big O notation, we can refer to this table and compare the length of input with your actual length of input:
- 
| Length of Input N      | Worse Accepted Time Complexity |
| ---------------------- | ------------------------------ |
| $\leq [10..11]$        | $O(N!)$, $O(N^6)$              |
| $\leq [15..18]$        | $O(2^N * N^2)$                 |
| $\leq [18..22]$        | $O(2^N * N)$                   | 
| $\leq 100$             | $O(N^4)$                       |
| $\leq 400$             | $O(N^3)$                       |
| $\leq 2,000$           | $O(N^2 * logN)$                |
| $\leq 10,000$          | $O(N^2)$                       |
| $\leq 1,000,000$       | $O(N * logN)$                  |
| $\leq 100,000,000$     | $O(N)$                         |
| $\leq 10^{100}$ | $O(logN)$                      |
| $\infty$               | $O(1)$                         |

<!--
[[How to implement Common DS in Java ?]]
-->

# Space complexity
Sometimes, _**Auxiliary Space**_ is confused with Space Complexity. The Auxiliary Space is the temporary space used by the algorithm during it's execution.
`Space Complexity = Auxiliary Space + Input space`
Because `Input space` is unchanged in the scope of function execution, so, we can ignore and go to analyze more about `Auxiliary Space`.

## Specific example
### List
	O(n * (size of data + size of next pointer (64 bit)))
### Double Linked List
	n * (size of data + size of previous pointer(64 bit) + size of next pointer(64 bit))
### Arrays ~ Stack ~ Queue
	n * size of data
### HashMap
	~ n * (size of Key + size of Value)
	for more exact:
	[number of cell in buckets(hash) + number of entries in each bucket/linked list] and each entry takes [size of key type + size of value type] space.
### Recursive algorithms
Another point to notice when design recursive algorithms - The stack space. This space is created for keep instruction of previous recursive function which call current function. For example:
```java
int factorial(n)
{
  if (n <= 0) 
    return 1;
  else 
    return n * (n - 1);
}
```
In this case there are 3 statements (one `if` statement and two `return` statements). The depth of this recursion algorithm is $n + 1$. Thus, the recursion stack space needed is $\geq 3*(n+1)$. So reduce the result, we have the simple space complexity is O(n) i.e. It's a linear space complexity algorithms.

<!--
How new function in Java 8 (Lambda, Stream...) affect the time and space complexity. Let's take a look at the blog [[Java 8 - Time and Space Complexity]]
