# Stellar Insights - Astrology Prediction Website

A beautiful, responsive astrology prediction website that collects birth details and sends birth details to an n8n webhook for personalized readings. The project includes a reference screenshot of the working n8n workflow.

## 🌟 Features

- **Modern Cosmic Design**: Dark theme with animated starry background and elegant typography
- **Comprehensive Form**: Collects all essential astrological information:
  - Full name (with validation)
  - Date of birth
  - Time of birth (optional)
  - Place of birth
  - Gender (optional)
  - Area of focus (career, health, relationships, etc.)
  - Email address
- **HTML5 Form Validation**: Built-in browser validation with custom patterns and constraints
- **Webhook Integration**: Seamlessly sends data to n8n webhook
- **Response Modal**: Displays webhook responses in an elegant popup
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with form validation
- **CSS3**: Custom styling with animations and responsive design
- **JavaScript (Vanilla)**: Form handling and webhook communication
- **Google Fonts**: Cormorant Garamond (serif) and Outfit (sans-serif)

## 📁 Project Structure

```
Astology/
├── index.html             # Main HTML file with form structure
├── styles.css             # All styling and animations
├── script.js              # Form submission and webhook logic
├── Working n8n model.png  # Screenshot of the n8n workflow
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for testing)
- An n8n webhook URL (for receiving form data)

### Installation

1. **Clone or download** this repository to your local machine

2. **Open the project** in your preferred code editor

3. **Configure the webhook URL** in `script.js`:
   ```javascript
   var WEBHOOK_URL = 'https://yashsingh4564657.app.n8n.cloud/webhook-test/fcd2bb54-d5ba-4171-9fb0-c6ac30c1e098';
   ```

4. **Serve the files** using one of these methods:

   **Option A: Using a local server (Recommended)**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (npx serve)
   npx serve
   
   # Using PHP
   php -S localhost:8000
   ```

   **Option B: Direct file access**
   - Simply open `index.html` in your browser (some features may be limited)

5. **Open your browser** and navigate to `http://localhost:8000` (or the port your server uses)

## 📝 Form Fields

### Required Fields
- **Full Name**: 2-100 characters, letters, spaces, hyphens, or apostrophes only
- **Date of Birth**: Must be a valid date, minimum year 1900
- **Place of Birth**: 2-150 characters (city and country)
- **Area of Focus**: Select from predefined options
- **Email**: Must be a valid email format

### Optional Fields
- **Time of Birth**: For more accurate rising sign calculation
- **Gender**: Prefer not to say, Female, Male, Non-binary, Other

## 🔗 Webhook Integration

### n8n Configuration

The form sends a POST request to your n8n webhook with the following JSON payload:

```json
{
  "fullname": "Jane Doe",
  "dob": "1990-05-15",
  "place": "Mumbai, India",
  "focus": "career",
  "email": "jane@example.com",
  "tob": "14:30",        // Optional
  "gender": "female"     // Optional
}
```

### Expected Response Format

The website can display responses in multiple formats. The `formatResponse()` function looks for these keys in order:

1. `message`
2. `data`
3. `result`
4. `prediction`
5. `reading`
6. `text`
7. `output`
8. `response`

**Example n8n Response:**
```json
{
  "message": "Your personalized astrology reading..."
}
```

or

```json
{
  "prediction": "Based on your birth chart..."
}
```

If none of these keys are found, the entire JSON object will be displayed in formatted form.

### Response Display

- **Success (2xx)**: Response is displayed in a modal popup
- **Error (4xx/5xx)**: Error message is shown with error styling
- **Network Errors**: Connection error messages are displayed

## 🎨 Customization

### Changing Colors

Edit `styles.css` to modify the color scheme:
- Primary accent: `#d4a84b` (gold)
- Background: `#0f0e14` (dark)
- Text: `#e8e4e0` (light gray)

### Modifying Form Fields

1. **Add/Remove fields**: Edit `index.html` form structure
2. **Update validation**: Modify HTML5 attributes (`required`, `pattern`, `minlength`, etc.)
3. **Adjust payload**: Update `callWebhook()` function in `script.js`

### Styling Changes

All styles are in `styles.css`. Key sections:
- `.stars` - Animated background
- `.form` - Form container styling
- `.modal` - Response popup styling
- `.btn` - Button styles

## 🔒 Security Considerations

- **Client-side validation**: HTML5 validation provides basic checks, but always validate on the server side
- **Webhook URL**: Keep your webhook URL secure and don't expose it publicly if it contains sensitive data
- **CORS**: Ensure your n8n webhook allows requests from your domain
- **HTTPS**: Use HTTPS in production for secure data transmission

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Form not submitting
- Check browser console for JavaScript errors
- Verify webhook URL is correct in `script.js`
- Ensure webhook is accessible and accepts POST requests

### Response not displaying
- Check network tab in browser DevTools
- Verify webhook returns valid JSON or text
- Ensure response includes one of the expected keys (`message`, `data`, etc.)

### Styling issues
- Clear browser cache
- Check that `styles.css` is loaded correctly
- Verify Google Fonts are accessible

## 📄 License

This project is open source and available for personal and commercial use.

## 👤 Author

Created for astrology prediction services.

## 🙏 Acknowledgments

- Google Fonts for typography
- n8n for workflow automation

---

**Note**: This website is for entertainment and reflection purposes. Astrology predictions should not replace professional advice.