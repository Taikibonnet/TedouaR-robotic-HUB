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
3. You'll need to provide a GitHub personal access token with `repo` scope to enable saving content to the repository. 
   - [Generate a GitHub token here](https://github.com/settings/tokens)
   - Required scopes: `repo` (full control of private repositories)

### Managing Robots

After logging in, you'll have access to the admin panel where you can:

1. **Add New Robot**: Create a new robot entry with details, images, and specifications
2. **Edit Existing Robots**: Update information for any robot in the database
3. **Delete Robots**: Remove robots from the database

### Image Management

For robot images, you can use any image hosting service:

1. Upload your images to a service like:
   - [ImgBB](https://imgbb.com/)
   - [Imgur](https://imgur.com/)
   - [Postimages](https://postimages.org/)
   - Or any other free image hosting site
   
2. Copy the direct image URL and paste it into the image URL fields in the admin panel
3. Click the "Preview" button to see how the image will look
4. You can add up to 5 gallery images for each robot

### How It Works

The admin panel uses:
- GitHub API to store robot data in the `robots.json` file
- Direct image URLs from third-party hosting services for images
- GitHub Pages for hosting the entire website

This approach avoids CORS issues and file size limitations of the GitHub API.

## Development

This project is built with:
- HTML, CSS, and JavaScript
- GitHub Pages for hosting
- GitHub API for content storage
- No server-side code required!

### Technical Notes

- The site uses GitHub Pages for hosting
- All robot data is stored in `robots.json` in the GitHub repository
- Images are hosted on third-party image hosting services
- Authentication is handled client-side for demonstration purposes

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.