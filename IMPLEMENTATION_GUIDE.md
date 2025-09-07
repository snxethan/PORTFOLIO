# Step-by-Step Implementation Guide

## How to Apply the Component Library Styling Fix

### Prerequisites
- Git access to the repository
- Ability to switch to the `component-library` branch

### Step 1: Switch to the component-library branch
```bash
git fetch origin
git checkout component-library
```

### Step 2: Backup current files (optional)
```bash
cp src/app/globals.css src/app/globals.css.backup
cp package.json package.json.backup
```

### Step 3: Fix src/app/globals.css

**Option A: Manual editing**
1. Open `src/app/globals.css`
2. Remove these lines:
   ```css
   @source "../node_modules/@snxethan/snex-components";
   @import "@snxethan/snex-components/styles.css";
   ```
3. Keep the first line: `@import "tailwindcss";`
4. Keep all other existing styles and animations

**Option B: Replace with corrected file**
```bash
# Use the provided corrected template
cp globals-corrected-for-component-library.css src/app/globals.css
```

### Step 4: Fix package.json

**Option A: Manual editing**
1. Open `package.json`
2. Remove this line from dependencies:
   ```json
   "@snxethan/snex-components": "github:snxethan/snex-components",
   ```

**Option B: Replace with corrected file**
```bash
# Use the provided corrected template
cp package-corrected-for-component-library.json package.json
```

### Step 5: Clean and reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Step 6: Verify the fix
```bash
# Run the verification script
./verify-component-library-fix.sh

# If all checks pass, proceed to testing
```

### Step 7: Test the application
```bash
# Build the application
npm run build

# Start development server (if build succeeds)
npm run dev
```

### Step 8: Manual Testing Checklist
- [ ] Application starts without CSS errors
- [ ] Contact modal opens when clicked
- [ ] Contact modal displays **on top** of page content
- [ ] Modal has blurred background
- [ ] Modal animates smoothly
- [ ] Modal can be closed by clicking outside or X button
- [ ] All other tooltips and overlays work correctly

### Step 9: Commit the changes
```bash
git add src/app/globals.css package.json
git commit -m "Fix component library styling issues

- Remove invalid @source directive
- Remove conflicting component library imports
- Preserve all existing animations and styles
- Fix modal z-index stacking issues"
```

### Troubleshooting

**If build fails:**
- Check that all problematic imports are removed
- Verify package.json syntax is valid
- Run `npm install` again

**If modal still renders incorrectly:**
- Check that ContactFormModal.tsx has `z-[60]` class
- Verify backdrop-blur classes are present
- Check browser developer tools for CSS conflicts

**If animations don't work:**
- Verify all @keyframes rules are present in globals.css
- Check that animate-* classes are preserved

### Success Criteria
✅ Application builds without errors  
✅ Contact modal renders on top of all content  
✅ All animations work smoothly  
✅ No console errors related to CSS  
✅ All existing functionality preserved