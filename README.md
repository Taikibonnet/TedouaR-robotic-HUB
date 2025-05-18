# TedouaR Robotic HUB

A comprehensive robotics encyclopedia showcasing various robots from different categories.

Visit the live site: [TedouaR Robotic HUB](https://taikibonnet.github.io/TedouaR-robotic-HUB/)

## Features

- Browse robots by category
- Detailed information pages for each robot
- Image galleries and technical specifications
- Admin panel for managing robot entries
- Responsive design for all devices

## Admin Usage

### Admin Login

1. Go to the admin login page at [/admin-login.html](https://taikibonnet.github.io/TedouaR-robotic-HUB/admin-login.html)
2. Use the following credentials:
   - Email: tedouar.robotics@gmail.com
   - Password: Admin123!
3. You'll need to provide a GitHub personal access token with `repo` scope to enable image uploads. 
   - [Generate a GitHub token here](https://github.com/settings/tokens)
   - Required scopes: `repo` (full control of private repositories)

### Managing Robots

After logging in, you'll have access to the admin panel where you can:

1. **Add New Robot**: Create a new robot entry with details, images, and specifications
2. **Edit Existing Robots**: Update information for any robot in the database
3. **Delete Robots**: Remove robots from the database

### Image Upload Guidelines

- Main image: Required for all robots, displayed as the primary image
- Gallery images: Optional, up to 5 additional images
- Supported formats: JPG, PNG, GIF, WebP, SVG
- Maximum file size: 2MB per image
- Recommended size: 800x600px

## Development

This project is built with pure HTML, CSS, and JavaScript, using GitHub for content storage.

### How It Works

- **Data Storage**: All robot data is stored in `robots.json` in the GitHub repository
- **Image Storage**: Images are uploaded to the `images/robots` directory in the repository
- **GitHub API**: The admin panel uses the GitHub API to save changes directly to the repository

### Technical Notes

- The site uses GitHub Pages for hosting
- All content is stored directly in the GitHub repository
- Authentication is handled client-side for demonstration purposes

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.