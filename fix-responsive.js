// Script to fix responsive issues in corporate and city pages
const fs = require('fs');
const path = require('path');

// Patterns to fix
const fixes = [
  // Fix grid layouts
  {
    pattern: /grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8/g,
    replacement: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'
  },
  // Fix padding in cards
  {
    pattern: /bg-white rounded-xl shadow-lg p-8 border border-gray-100/g,
    replacement: 'bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100'
  },
  // Fix table responsiveness
  {
    pattern: /table className="min-w-full bg-white"/g,
    replacement: 'table className="min-w-full bg-white text-sm sm:text-base"'
  },
  // Fix table headers
  {
    pattern: /py-4 px-6 text-left/g,
    replacement: 'py-3 sm:py-4 px-2 sm:px-6 text-left text-xs sm:text-sm'
  },
  // Fix table cells
  {
    pattern: /py-4 px-6/g,
    replacement: 'py-3 sm:py-4 px-2 sm:px-6 text-xs sm:text-sm'
  },
  // Fix section padding
  {
    pattern: /py-16 px-4 sm:px-6 lg:px-8/g,
    replacement: 'py-8 sm:py-12 lg:py-16 px-2 sm:px-4 lg:px-8'
  }
];

// Function to process files
function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  fixes.forEach(fix => {
    const originalContent = content;
    content = content.replace(fix.pattern, fix.replacement);
    if (content !== originalContent) {
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

// Find and process files
const { execSync } = require('child_process');
try {
  const output = execSync('find "d:/WTLALL/WTL_Website_30-08-25/app" -name "page.tsx" 2>nul', { encoding: 'utf8' });
  const files = output.split('\n').filter(f => f && (f.includes('corporate') || f.includes('cities')));

  files.forEach(processFile);
  console.log(`Processed ${files.length} files`);
} catch (error) {
  console.log('No files found or error occurred');
}
