#!/bin/bash

# Component Library Branch Fix Verification Script
# This script verifies that the styling fix has been applied correctly

echo "=== Component Library Branch Styling Fix Verification ==="
echo ""

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Function to check globals.css content
check_globals_css() {
    echo "Checking src/app/globals.css..."
    
    # Check for problematic imports
    if grep -q "@source" src/app/globals.css; then
        echo "❌ ERROR: Found @source directive in globals.css"
        echo "   This needs to be removed."
        return 1
    else
        echo "✅ GOOD: No @source directive found"
    fi
    
    if grep -q "@snxethan/snex-components" src/app/globals.css; then
        echo "❌ ERROR: Found @snxethan/snex-components import in globals.css"
        echo "   This needs to be removed."
        return 1
    else
        echo "✅ GOOD: No component library import found"
    fi
    
    # Check that required styles are present
    if grep -q "@import \"tailwindcss\"" src/app/globals.css; then
        echo "✅ GOOD: Tailwind import present"
    else
        echo "❌ ERROR: Missing Tailwind import"
        return 1
    fi
    
    if grep -q "animate-elastic-in" src/app/globals.css; then
        echo "✅ GOOD: Custom animations preserved"
    else
        echo "❌ ERROR: Custom animations missing"
        return 1
    fi
    
    echo ""
    return 0
}

# Function to check package.json
check_package_json() {
    echo "Checking package.json..."
    
    if grep -q "@snxethan/snex-components" package.json; then
        echo "❌ ERROR: Found @snxethan/snex-components dependency in package.json"
        echo "   This needs to be removed."
        return 1
    else
        echo "✅ GOOD: No component library dependency found"
    fi
    
    echo ""
    return 0
}

# Function to verify modal z-index styles
check_modal_styles() {
    echo "Checking modal component styles..."
    
    # Check ContactFormModal for proper z-index
    if grep -q "z-\[60\]" src/app/components/ContactFormModal.tsx; then
        echo "✅ GOOD: Contact modal has high z-index (z-[60])"
    else
        echo "⚠️  WARNING: Contact modal z-index may need verification"
    fi
    
    # Check for backdrop blur
    if grep -q "backdrop-blur" src/app/components/ContactFormModal.tsx; then
        echo "✅ GOOD: Modal backdrop blur effect present"
    else
        echo "⚠️  WARNING: Modal backdrop effects may need verification"
    fi
    
    echo ""
    return 0
}

# Run all checks
echo "Running verification checks..."
echo ""

OVERALL_STATUS=0

check_globals_css
if [ $? -ne 0 ]; then
    OVERALL_STATUS=1
fi

check_package_json
if [ $? -ne 0 ]; then
    OVERALL_STATUS=1
fi

check_modal_styles

# Final status
echo "=== VERIFICATION RESULTS ==="
if [ $OVERALL_STATUS -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED - Component library styling fix appears correct"
    echo ""
    echo "Expected results after this fix:"
    echo "- Contact modal displays on top of page content"
    echo "- All overlays have proper z-index stacking"
    echo "- No CSS parsing errors"
    echo "- All animations preserved"
else
    echo "❌ SOME CHECKS FAILED - Review the errors above"
    echo ""
    echo "Common fixes needed:"
    echo "1. Remove @source directive from globals.css"
    echo "2. Remove @snxethan/snex-components import from globals.css"
    echo "3. Remove @snxethan/snex-components dependency from package.json"
fi

echo ""
echo "To test the fix:"
echo "1. npm install"
echo "2. npm run build"
echo "3. Test contact modal functionality"
echo "4. Verify tooltip and overlay rendering"

exit $OVERALL_STATUS