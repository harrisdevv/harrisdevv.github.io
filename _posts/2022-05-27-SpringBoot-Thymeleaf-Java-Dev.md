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

An Amenity Reservation System which residents (users) can log in and reserve a time to use a service such as fitness center, pool, or sauna. An amenity will have a certain capacity (number of people that can use the amenity at the same time) so that people can use the amenities safely during the Covid-19 pandemic.

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

- [x] Users should be able to log in.
- [x] The accounts of residents are pre-created and there will be no sign-up feature.
- [x] Users should be able to view their reservations.
- [x] Users should be able to create new reservations by selecting the amenity type, date, and time.
- [x] Only logged-in users should be able to see the reservations page and create reservations.
- [x] Check the capacity and only create new reservations if the current number of reservations does not exceed the capacity.
