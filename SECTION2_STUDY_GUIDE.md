# Section 2 Study Guide: CSS & HTML Structure

## 📚 Overview
This study guide covers the "What You Get" section (Section 2) of the NandeNihon website, explaining both the HTML structure and CSS styling.

## 🏗️ HTML Structure Analysis

### Section Container
```html
<section class="what-you-get">
    <div class="container">
        <h2 class="section-title">Apa yang Kamu Dapatkan di Nande Nihon?</h2>
        <div class="features-grid">
            <!-- Feature cards go here -->
        </div>
    </div>
</section>
```

### Key HTML Elements Used:
1. **`<section>`** - Semantic HTML5 element for grouping related content
2. **`<div class="container">`** - Wrapper for content centering and max-width
3. **`<h2>`** - Main section heading with semantic hierarchy
4. **`<div class="features-grid">`** - Grid container for feature cards

### Feature Card Structure
```html
<div class="feature-card">
    <div class="feature-icon">
        <!-- SVG icon here -->
    </div>
    <h3 class="feature-title">Card Title</h3>
    <p class="feature-description">Card description text</p>
</div>
```

### SVG Icon Implementation
```html
<svg width="60" height="60" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round" 
     stroke-linejoin="round" class="icon-0-percent">
    <!-- SVG paths and elements -->
</svg>
```

## 🎨 CSS Styling Breakdown

### 1. Section Container Styles
```css
.what-you-get {
  background-color: white;
  padding: 80px 0;  /* 80px top/bottom, 0 left/right */
}
```

**Key Properties:**
- `background-color: white` - Clean white background
- `padding: 80px 0` - Vertical spacing for breathing room

### 2. Container Wrapper
```css
.what-you-get .container {
  max-width: 1200px;     /* Maximum content width */
  margin: 0 auto;         /* Center horizontally */
  padding: 0 32px;        /* Horizontal padding for mobile */
}
```

**Key Properties:**
- `max-width: 1200px` - Prevents content from becoming too wide on large screens
- `margin: 0 auto` - Centers the container horizontally
- `padding: 0 32px` - Adds horizontal spacing on smaller screens

### 3. Section Title
```css
.section-title {
  font-family: 'Noto Sans', sans-serif;
  font-size: 48px;                    /* 48px = 36pt equivalent */
  font-weight: 700;                   /* Bold weight */
  color: #333333;                     /* Dark gray for readability */
  text-align: center;                 /* Center alignment */
  margin-bottom: 64px;                /* Space below title */
  line-height: 1.2;                   /* Tight line spacing */
  letter-spacing: -1.5px;             /* Tighter letter spacing */
}
```

**Typography Scale Reference:**
- `48px` = `text-48-regular` class equivalent
- Uses Noto Sans font family
- Negative letter-spacing for modern look

### 4. Features Grid Layout
```css
.features-grid {
  display: grid;                       /* CSS Grid layout */
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 32px;                          /* Space between cards */
  margin-top: 48px;                   /* Space above grid */
}
```

**Grid System:**
- `repeat(3, 1fr)` - Creates 3 equal-width columns
- `gap: 32px` - Consistent spacing between all grid items
- Responsive: Automatically adjusts on smaller screens

### 5. Feature Card Styling
```css
.feature-card {
  background-color: #FAFAFA;          /* Light gray background */
  border-radius: 16px;                /* Rounded corners */
  padding: 32px 24px;                 /* Internal spacing */
  text-align: center;                 /* Center content */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* Subtle shadow */
  transition: all 0.3s ease;          /* Smooth animations */
  border: 1px solid #F0F0F0;          /* Light border */
}
```

**Design Principles:**
- **Card-based design** - Each feature gets its own visual container
- **Subtle shadows** - Creates depth without being overwhelming
- **Rounded corners** - Modern, friendly appearance
- **Consistent padding** - 32px vertical, 24px horizontal

### 6. Hover Effects
```css
.feature-card:hover {
  transform: translateY(-8px);         /* Lift card up */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); /* Enhanced shadow */
  border-color: var(--primary-20);    /* Primary color border */
}
```

**Interactive States:**
- `transform: translateY(-8px)` - Subtle upward movement
- Enhanced shadow for depth perception
- Primary color border for brand consistency

### 7. Icon Styling
```css
.feature-icon {
  margin-bottom: 24px;                /* Space below icon */
  display: flex;                       /* Flexbox for centering */
  justify-content: center;             /* Horizontal center */
  align-items: center;                 /* Vertical center */
}

.feature-icon svg {
  color: var(--primary-base);         /* Primary blue color */
  width: 60px;                        /* Fixed icon size */
  height: 60px;                       /* Maintains aspect ratio */
}
```

**Icon System:**
- **60x60px** - Consistent size across all icons
- **Primary color** - Uses CSS custom property for brand consistency
- **Flexbox centering** - Perfect alignment within cards

### 8. Typography in Cards
```css
.feature-title {
  font-family: 'Noto Sans', sans-serif;
  font-size: 20px;                    /* 20px = 15pt equivalent */
  font-weight: 600;                   /* Semi-bold weight */
  color: #333333;                     /* Dark text for readability */
  margin-bottom: 16px;                /* Space below title */
  line-height: 1.3;                   /* Comfortable reading */
  letter-spacing: -1.5px;             /* Consistent with design system */
}

.feature-description {
  font-family: 'Noto Sans', sans-serif;
  font-size: 14px;                    /* 14px = 10.5pt equivalent */
  font-weight: 400;                   /* Regular weight */
  color: #666666;                     /* Medium gray for secondary text */
  line-height: 1.6;                   /* Generous line spacing */
  letter-spacing: -1.5px;             /* Consistent spacing */
  margin: 0;                          /* Remove default margins */
}
```

## 🔧 CSS Custom Properties (Variables)

### Color System
```css
:root {
  --primary-base: #2563EB;            /* Main blue color */
  --primary-20: #D3E0FB;              /* Light blue for borders */
}
```

**Usage:**
- `var(--primary-base)` - Main brand color
- `var(--primary-20)` - Light variant for subtle elements

## 📱 Responsive Design

### Grid Responsiveness
The grid automatically adjusts based on screen size:
- **Desktop**: 3 columns
- **Tablet**: 2 columns (CSS Grid handles this)
- **Mobile**: 1 column (CSS Grid handles this)

### Container Responsiveness
```css
.what-you-get .container {
  max-width: 1200px;                  /* Desktop max width */
  padding: 0 32px;                    /* Mobile padding */
}
```

## 🎯 Best Practices Demonstrated

### 1. **Semantic HTML**
- Uses `<section>` for content grouping
- Proper heading hierarchy (`<h2>` for section title)
- Descriptive class names

### 2. **CSS Organization**
- Logical grouping of related styles
- Consistent naming conventions
- Use of CSS custom properties

### 3. **Accessibility**
- Proper contrast ratios
- Semantic structure
- Readable font sizes

### 4. **Performance**
- Efficient CSS selectors
- Minimal DOM nesting
- Optimized transitions

## 🚀 How to Extend This Section

### Adding New Feature Cards
1. Copy the existing card structure
2. Update the SVG icon
3. Change title and description
4. The grid automatically adjusts

### Modifying Colors
1. Update CSS custom properties in `:root`
2. All related elements automatically update
3. Maintains consistency across the design

### Changing Layout
1. Modify `grid-template-columns` for different column counts
2. Adjust `gap` for different spacing
3. Update `max-width` for different container sizes

## 📝 Key Takeaways

1. **Grid-based layouts** provide flexible, responsive designs
2. **CSS custom properties** ensure consistency and maintainability
3. **Component-based approach** makes it easy to add/remove features
4. **Semantic HTML** improves accessibility and SEO
5. **Consistent spacing** creates visual harmony
6. **Interactive states** enhance user experience

## 🔍 Common Issues & Solutions

### Issue: Cards not aligning properly
**Solution**: Ensure all cards have the same height or use `align-items: stretch`

### Issue: Icons not centered
**Solution**: Use flexbox with `justify-content: center` and `align-items: center`

### Issue: Grid not responsive
**Solution**: CSS Grid automatically handles responsiveness, but you can add media queries for specific breakpoints

### Issue: Hover effects not working
**Solution**: Ensure `transition` property is set and `:hover` selector is properly defined

---

*This study guide covers the complete structure and styling of Section 2. Use it as a reference for understanding the code and extending the functionality.*
