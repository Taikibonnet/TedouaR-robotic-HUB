// Decap CMS Configuration
window.CMS_MANUAL_INIT = true;

// Wait for DOM to be loaded
window.addEventListener('DOMContentLoaded', function() {
  // Initialize CMS with configuration
  CMS.init({
    config: {
      backend: {
        name: 'git-gateway',
        branch: 'main',
        identity_url: "https://tedouar.netlify.app/.netlify/identity",
        gateway_url: "https://tedouar.netlify.app/.netlify/git/github",
        commit_messages: {
          create: 'Create {{collection}} "{{slug}}"',
          update: 'Update {{collection}} "{{slug}}"',
          delete: 'Delete {{collection}} "{{slug}}"',
          uploadMedia: '[skip ci] Upload "{{path}}"',
          deleteMedia: '[skip ci] Delete "{{path}}"'
        }
      },
      media_folder: "images/uploads",
      public_folder: "/images/uploads",
      collections: [
        {
          name: "robots",
          label: "Robot Entries",
          folder: "_robots",
          create: true,
          slug: "{{slug}}",
          fields: [
            {label: "Layout", name: "layout", widget: "hidden", default: "robot"},
            {label: "Title", name: "title", widget: "string", required: true},
            {label: "Featured Image", name: "image", widget: "image", required: false, allow_multiple: false},
            {
              label: "Category", 
              name: "category", 
              widget: "select", 
              options: ["Humanoid", "Industrial", "Service", "Medical", "Educational", "Military", "Research"],
              required: true
            },
            {label: "Tags", name: "tags", widget: "list", required: false},
            {label: "Description", name: "description", widget: "text", required: true},
            {label: "Content", name: "body", widget: "markdown", required: true},
            {label: "Video URL", name: "video_url", widget: "string", required: false, hint: "YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"},
            {label: "Featured", name: "featured", widget: "boolean", default: false, required: false},
            {label: "Publication Date", name: "date", widget: "datetime", required: false, default: new Date()}
          ]
        }
      ]
    }
  });
  
  // Register preview styles
  CMS.registerPreviewStyle('admin.css');
});
