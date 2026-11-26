# Noor Studio (نور اسٹوڈیو)

A bilingual (English / Urdu) storefront for luxury artisan and tech lifestyle products. The shopping cart works on every page, with login and checkout, and all shared state is managed with React's Context API and `useReducer`.

## Features

- **Shopping cart on every page**: add, remove and change quantities from anywhere in the app
- **Login and checkout** flow
- **English / Urdu language switcher** powered by Context
- **Persistent state**: cart data is saved so it survives a page reload
- **Responsive design** built with Tailwind CSS

## State management

| Concept | How it is used |
|---------|----------------|
| Context API + `useContext` | Share cart, auth and language state without prop drilling |
| Provider pattern | Providers wrap the app so any component can read global state |
| `useReducer` | Cart updates go through a reducer with typed actions |
| `dispatch` | Components send actions such as add, remove and clear |
| Custom hooks | `useCart` exposes cart state and actions in one call |
| Global vs local state | Cart, auth and language are global; form and UI state stay local |

## Tech stack

- React
- TypeScript
- Tailwind CSS
