# RENT A CAR - example website

<img src="https://github.com/user-attachments/assets/9643184d-ac12-4252-b795-4d723eca02f8" width="45%"></img> <img src="https://github.com/user-attachments/assets/316a1523-f7b2-4a1b-9bb1-8437c587c716" width="45%"></img> <img src="https://github.com/user-attachments/assets/acf6284f-4a63-4879-8a77-1d56a42562dd" width="25%"></img>

## Description

Rent a Car is a modern web application designed to offer a seamless and engaging car rental experience. The application features a sleek, interactive carousel that showcases a variety of cars available for rent. Each car is displayed with high-quality images and detailed information, allowing users to easily explore and choose their preferred vehicle.

### Key Features

- **Interactive Carousel**: The main feature of the application is a dynamic carousel that automatically cycles through a selection of cars. Users can manually navigate through the carousel and view each car in detail. The carousel incorporates smooth animations to enhance user experience.

- **Car Details**: Each car in the carousel can be selected to reveal detailed information. Clicking the "Details" button triggers a transition effect that displays a comprehensive overview of the chosen car, including specifications such as engine type, horsepower, fuel type, and more.

- **Responsive Design**: The application is fully responsive and adapts to various screen sizes, ensuring a consistent experience across desktop, tablet, and mobile devices. The layout adjusts dynamically to provide an optimal viewing experience.

- **Mobile Navigation Menu**: On mobile devices, users can access a hamburger menu that slides in from the side. This menu provides quick access to different sections of the site, including Home, Offer, Contact, and About Us pages.

- **Social Media Integration**: The application includes a sidebar on larger screens and a section within the mobile menu that provides easy access to the project's social media profiles. Users can connect with the brand on platforms like Facebook, Instagram, and LinkedIn.

- **Modern UI/UX**: The interface is designed with modern aesthetics in mind, using clean lines, vibrant colors, and intuitive navigation. The use of Tailwind CSS ensures a visually appealing and cohesive design throughout the application.

## API

The application utilizes a RESTful API to fetch car data. Here’s a brief overview of the available endpoints:

### Base URL

https://car-rent-website.onrender.com/api/cars

### Endpoints

#### GET /cars

Fetches a list of cars with their details.

**Response:**

- `brand` (string): The brand of the car.
- `model` (string): The model of the car.
- `image` (string): URL to the image of the car.
- `color` (string): The color code of the car.
- `imageFront` (string): URL to the front image of the car.
- `data` (object): Detailed information about the car including:
  - `engine` (string): Engine specification.
  - `horsePower` (string): Horsepower of the engine.
  - `chassis` (string): Type of chassis (e.g., Sedan, Coupe).
  - `fuel` (string): Type of fuel used.
  - `transmission` (string): Type of transmission.
  - `drive` (string): Drive type (e.g., FWD, AWD).
  - `doors` (string): Number of doors.
  - `seats` (string): Number of seats.
  - `year` (string): Year of manufacture.
  - `description` (string): Brief description of the car.

## Technologies

- **Frontend**: Developed using React and Next.js, with Tailwind CSS for styling. GSAP is utilized for advanced animations and transitions to create a polished user experience.
- **Backend**: The server-side component is built with Express.js, providing a simple API to serve car data.
- **Database**: The application does not utilize a traditional database; instead, it relies on static JSON data for car information.

## Usage

- **Homepage**: Visit the homepage to explore the car carousel. The carousel automatically transitions through various cars, but users can also navigate manually.
- **Viewing Details**: Click the "Details" button on any car to view additional information. The details pane will slide up with an animated transition.

- **Navigation**: Use the navigation menu for easy access to different sections. On larger screens, the menu is always visible, while on mobile devices, it can be accessed via a hamburger icon.

- **Social Media**: Connect with the project on social media through the provided links in the sidebar or mobile menu.

## Contributing

Contributions to the project are welcome! If you have suggestions for improvements or encounter any issues, please open an issue or submit a pull request. Your feedback and contributions help enhance the application and provide a better experience for all users.

## License

This project is licensed under the MIT License.

## Contact

For questions, support, or any inquiries related to the project, please reach out to [arekas2914@wp.pl](mailto:arekas2914@wp.pl).

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
