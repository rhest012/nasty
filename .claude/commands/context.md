---
description: Create a UI Component in /lib/
argument-hint: Component Name | Component Summary
---

## Context

Parse $ARGUMENTS to get the following values:

- [name]: Component name from $ARGUMENTS, converted to PascalCase
- [summary]: Component summary from $ARGUMENTS

## Task

- Context should be added to `src/components/ui/[name]/[name].tsx`
- Use RSVPContext as a template
- Add a console log with component name for testing purposes
- Use Pascal Case
- If no Provider file, add Provider component in the app folder
- Wrap Provider in the layout component
