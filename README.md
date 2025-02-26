# Chat Widget CDN

A lightweight, customizable chat widget that can be easily integrated into any website.

## Features

- 💬 Modern chat interface
- 🎨 Customizable styling
- ⚡ Lightweight and fast
- 📱 Mobile-responsive
- 🔌 Easy integration
- ⌨️ Keyboard support

## Quick Start

Add the following code to your website just before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/chat-cdn@latest/chat-widget.min.js"></script>
<script>
  ChatWidget.init({
    clientId: "YOUR_CLIENT_ID",
    apiEndpoint: "YOUR_API_ENDPOINT",
  });
</script>
```

Replace the following values:

- `YOUR_USERNAME`: Your GitHub username
- `YOUR_CLIENT_ID`: Your unique client identifier
- `YOUR_API_ENDPOINT`: Your API endpoint that will handle the chat messages

## API Response Format

Your API endpoint should accept POST requests with the following JSON body:

```json
{
  "clientId": "string",
  "message": "string"
}
```

And should return responses in the following format:

```json
{
  "response": "string"
}
```

## Customization

The chat widget comes with a default modern design, but you can customize its appearance by overriding the CSS variables or directly modifying the CSS classes.

## Browser Support

The chat widget supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
