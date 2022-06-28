---
layout: posts
title: Optimize keyword review time with Obsidian & JS script
date:   2022-03-21 21:09:25 +0700
categories: 
- obsidian
- learning
tags:
- Write/start 
---

Have you seen that reading a large amount of text can make us feel tired and time-consuming? So when reading a large amount of information I have determined to be helpful, I usually first save the information in my Obsidian Vault. Next, summarize it, highlighting critical information. So when reviewing, we just need to check the highlighted text is enough. So the question is ❓, how to see all highlights in a single main note file even if your note has many links to other sub-notes? Here is my workaround:
To optimize the review of all the information that I have noted, I decided to implement a function, consisting of:
- I will read the content and highlight important passages of text to help me remember all the rest of the information; we can call these are keywords.
- A tool aggregates all the highlights from the linked notes from the original note (current note).
- Summarize and print out in some formats that I want to be convenient for viewing.
- Each highlight must have a link to the note containing it.

And to implement this feature, I use DataView JS Plugin. This plugin supports writing Javascript code script inside a note to help extract, process, and manipulate information from many other notes. There are many operations. It is possible because this is a script written in javascript, so it is fully customizable. So the problem here is to write a simple script inside the main note. This script has the function to find the notes by parsing the main note and then using the regexp in js to find the links by recognizing the text contained in the double square brackets (```[[<note_name>]]```) to open that note and extract highlight from that note.

And here is the script I made:
[obsidian/Book.md at master · harrisdevv/obsidian · GitHub](https://github.com/harrisdevv/obsidian/blob/master/Templates/Book.md)

I'm a visual learner, so I want to remember that each highlight corresponds to an image. So that, I'll use a syntax: ```==keyword | picture==``` and the script I like will also split the keyword and picture and save it as 2 separate columns of a table for easy viewing.

And this is the result 🔥: 
![Result](/assets/images/Pasted image 20220321123052.png)

After having this script, every time I review the information, I just need to review my highlight summary (only about 1% of the detailed information of all the notes). So this further optimizes the information review process for learning new information!

To sum up, taking notes on Obsidian with the DataviewJS Plugin is too good for programmers who need to perform simple to advanced retrieval of information from many notes using basic javascript for programmers (just need to learn the DataviewJS plugin's API is possible to implement it)... this helps a lot in optimizing the information note-taking process to optimize the learning process according to any personal learning style.

Try it, and lets me know what you think about it! 😄

# Reference
- [DataviewJS Plugin](https://blacksmithgu.github.io/obsidian-dataview/api/intro/)
