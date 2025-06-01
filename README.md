# LindyVerse
LindyVerse is a personal website for a professional Lindy Hop dancer and instructor. The platform will offer class schedules, private lesson bookings, dance resources, and educational content to help students elevate their dance skills.

## Tech Stack
- React
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io
- Stripe
- Tailwind CSS
- Chart.js
- React Router
- React Icons
- Lucide React
- Axios
- Bcrypt
- JWT
- Stripe
- PDFKit
- Express Rate Limit
- Nodemon

## Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the server
5. Run the client

## Usage

1. Start the server
2. Start the client
3. Open http://localhost:5173 in your browser

## License

MIT
# Project Structure

This document outlines the structure of the LindyVerse project and provides guidelines for maintaining consistent code organization.

## Directory Structure

project-root/
├── public/
│   └── ... (keep your assets here)
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── utils/
│   ├── config/              
│   └── index.js             
├── src/
│   ├── api/
│   │   ├── auth.js           
│   │   ├── courses.js
│   │   └── profile.js
│   ├── assets/               
│   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── ui/
│   │   │   ├── base/
│   │   │   └── data/
│   │   └── index.js
│   ├── pages/               
│   │   └── Home.jsx etc.
│   ├── App.jsx
│   └── main.jsx              
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
└── README.md

## Naming Conventions

### Files
- Use PascalCase for component files (e.g., Button.jsx)
- Use kebab-case for utility files (e.g., get-colors.js)
- Use index files for barrel exports

### Components
- Use PascalCase for component names
- Use descriptive names that indicate purpose
- Avoid generic names like Component or Item

### Functions
- Use camelCase for function names
- Use descriptive names that indicate purpose
- Use verbs for actions (e.g., handleClick, fetchData)

### Variables
- Use camelCase for variable names
- Use descriptive names that indicate purpose
- Avoid single letter variables except for counters

## Code Organization

### Components
- Keep components small and focused
- Extract complex logic into custom hooks
- Use composition over inheritance
- Document component props and usage

### Files
- Keep files under 200 lines
- Group related functionality together
- Use barrel exports for large directories
- Avoid circular dependencies

### Imports
- Group imports by type
- Order imports alphabetically within groups
- Use absolute imports when possible
- Avoid deep imports

## Best Practices

1. **Consistency**
   - Follow established patterns
   - Use consistent naming
   - Maintain consistent spacing

2. **Reusability**
   - Extract common patterns
   - Create reusable hooks
   - Avoid code duplication

3. **Performance**
   - Use memoization for complex components
   - Avoid unnecessary re-renders
   - Optimize imports

4. **Maintainability**
   - Add comments for complex logic
   - Document API usage
   - Keep dependencies up to date

## 🔧 Refactor & Modularization Tasks

### 🧹 Cleanup
- [ ] Remove unused assets/components
- [ ] Rename unclear file/component names
- [ ] Delete test files or leftovers from prototyping

### 📦 Modularization
- [ ] Split large components into smaller, focused ones
- [ ] Group course-related logic into a module
- [ ] Move duplicated logic into reusable hooks
- [ ] Create `hooks/` folder if needed
- [ ] Use absolute imports

### 🏗️ Structure & Convention
- [ ] Enforce naming conventions (PascalCase, camelCase, kebab-case)
- [ ] Add barrel exports
- [ ] Move all inline styles to Tailwind or CSS modules
- [ ] Create a `constants.js` or `config.js` file for shared values

### 📜 Documentation & Comments
- [ ] Document props for major components
- [ ] Add file/module headers for non-obvious logic
- [ ] Write inline comments for critical logic

### 🧪 Testing & Verification
- [ ] Add quick manual checklist to test views before deployment
- [ ] (Optional) Add basic component tests with Vitest/Jest


## Migration Guide

1. **Components**
   - Move layout components to components/layout/
   - Move UI components to components/ui/
   - Move course-specific components to components/course/
   - Move modals to components/modals/

2. **Pages**
   - Move admin pages to pages/admin/
   - Move public pages to pages/public/

3. **Utils**
   - Move utility functions to appropriate directories
   - Create barrel exports for common utilities

4. **Services**
   - Create service layer for data fetching

