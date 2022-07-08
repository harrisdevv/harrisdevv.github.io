---
layout: posts
title: Java Full-stack with Spring Boot & Thymeleaf 
date:   2022-05-27 20:39:25 +0700
categories: 
- java
- dev
tags:
- Write/start 
---
![Demo](/assets/images/Pasted image 20220630102209.png)

[Source code](https://github.com/harrisdevv/reservation-system/)

# Introduction

An Reservation System in which residents reserve a time to use a service (amenities) such as a fitness center, sauna, pool, etc. An amenity will have a certain capacity so that people can use the amenities safely during the Covid-19 pandemic.

## Built with
* Maven

### Back-end
* Spring Boot
* Hibernate
* Spring Security
* JPA
* H2 In-Memory Database

### Front-end
* Thymeleaf
* Bootstrap
* HTML, CSS

### API Document
* Swagger

## Roadmap
- [x] The Users' accounts are pre created.
- [x] Users should be able to log in and log out.
- [x] Users should be able to view their reservations.
- [x] Users should be able to create new entry of reservation by selecting the amenity type, date, and time.
- [x] Check if capacity is exceeded before create reservation.
