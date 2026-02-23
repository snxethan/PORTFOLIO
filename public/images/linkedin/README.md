# LinkedIn Banner Assets

## 🔗 Browser URLs
```
file:///C:/projects/Portfolio/et-portfolio/public/banners/linkedin-banner.html
file:///C:/projects/Portfolio/et-portfolio/public/banners/linkedin-banner-codeblock.html
```
Open either URL in your browser to view the banner(s).

## 🎨 Design Features
- **Exact LinkedIn dimensions**: 1584x396 pixels
- **Full-bleed code window** with dark theme and red accents
- **Syntax-highlighted code** with readable, high-contrast colors
- **Safe-zone content inset** to avoid profile photo overlap
- **Minimal padding** for maximum text size and clarity

## 📸 How to Save Your Banner

### Method 1: Download PNG (Recommended)
1. Open `linkedin-banner-codeblock.html` (or `linkedin-banner.html`) in your browser
2. Click **Download PNG**
3. Upload the PNG to LinkedIn

### Method 2: Screenshot (Quick)
1. Open the banner in your browser
2. Press `Win + Shift + S` (Windows Snipping Tool)
3. Select just the banner area (1584x396px)
4. Save the screenshot as PNG or JPG

## 🚀 Uploading to LinkedIn
1. Go to your [LinkedIn Profile](https://www.linkedin.com/in/ethan-townsend)
2. Click the **camera icon** in your banner area
3. Click **"Upload photo"**
4. Select your saved banner image
5. Adjust positioning if needed
6. Click **"Apply"**

## 🎯 Banner Content

```json
{
  "name": "Ethan Townsend",
  "title": "Software Engineer",
  "education": "B.S. Computer Science, Neumont University",
  "focus": "Backend Systems",
  "experience": {
    "TrueMark": "January (2026) - Present",
    "Neumont University": "May (2024) - Present"
  }
}
```

## 🔧 Customization
To update the codeblock banner (`linkedin-banner-codeblock.html`):
- **Content**: Edit the text inside the `.code-block` section
- **Safe-zone padding**: Adjust `.code-block` padding (left/top/right/bottom)
- **Colors**: Update the `.code-key-*` and `.code-string` styles

## 💡 Tips
- LinkedIn safe-zone guidance: keep critical text at least **24px** from top/bottom and **90px** from left/right
- Profile photo overlaps the lower-left area; keep important text shifted right (current left inset is tuned for this)
- Use the **Download PNG** button for a clean export without browser UI
- The banner is optimized for LinkedIn’s 1584x396 standard

---

**Updated**: February 2026  
**Dimensions**: 1584x396px (LinkedIn Standard)  
**Theme**: Full-bleed code window with red accents
