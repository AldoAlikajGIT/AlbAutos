# AlbAutos – Car Marketplace for Albania

AlbAutos is a full-stack web application developed as part of the Software Engineering Project (Fall 2025).  
It enables users and car dealerships to list, browse, and manage car advertisements with advanced search filters, image uploads, and secure authentication.

---

## Overview

Buying and selling cars in Albania is currently scattered across informal websites and social media, making it difficult for buyers to find specific vehicles and for sellers to reach potential customers efficiently.  
AlbAutos addresses this problem by providing a structured, centralized, and reliable platform designed specifically for the Albanian market.  

The system focuses on data consistency, responsive design, and an efficient search experience for end users.

---

## Features

**User Accounts**
- Registration and login using JWT authentication  
- Role-based access (User, Car Dealership, Admin)  
- Passwords secured with BCrypt  

**Car Listings**
- Create, edit, delete, and view car advertisements  
- Upload up to 15 images per listing  
- Include details such as brand, model, year, mileage, price, power, transmission, color, and location and more 
- Each listing linked to the seller’s account and contact information  

**Search and Filtering**
- Advanced multi-filter search combining criteria such as brand, model, price range, year, mileage, power, body type, fuel type, colors, location and more
- Option to display all listings when no filters are applied  
- Responsive and fast filtering interface built with React  

**Admin Dashboard**
- Manage user accounts and advertisements  
- Remove inappropriate listings or user accounts

---

## System Architecture

**Frontend:** React + TypeScript + Tailwind CSS  
**Backend:** Java Spring Boot (REST API with Spring Security)  
**Database:** MySQL  
**Authentication:** JWT tokens  
**Caching / Rate Limiting:** Redis with Bucket4j  
**Storage:** Local storage for images (future migration to S3)


