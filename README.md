# Recruitler's Customized DragDrop CDK Library

TODO: 
- support nested drop lists
- support signals
- support virtual scrolling
- support paginating drag and drop elements

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Angular's CDK drag-drop package
This project is a fork of the [Angular's CDK drag-drop package](https://github.com/angular/components/tree/main/src/cdk/drag-drop).
The following is an outline of modifications to the Angular CDK drag-drop package to implement drag-drop nesting. We have implemented the core tree data structure with interfaces:

1. Core Tree Implementation (/projects/sortable/src/lib/drag-drop/drag-drop-tree.ts):

 - Implements the core tree data structure with interfaces:
```typescript
export interface CdkDropDownItem {
  [key: string]: any;
  children?: CdkDropDownItem[];
}
export interface CdkIndexTree {
  root: CdkIndexTreeNode;
  dropItems: CdkDropDownItem[];
}
```
 - Key functions for tree operations:
     - nestTreeNode(): Handles nesting items into other items
     - splitTree(): Splits tree at specific indices
     - swapTreeNodes(): Handles node swapping
     - constructCdkIndexTree(): Builds the index-based tree structure

3. Tree Component (/projects/sortable/src/lib/drag-drop/components/tree-component/):

 - nested-drag-drop.component.ts:
     - Main component for handling nested drag-drop operations
     - Uses CdkDropListGroup for managing groups of drop lists
     - Implements event handlers for drag/drop/nest operations

 - nested-drag-drop.component.html:
     - Template for the nested drag-drop structure
     - Uses recursive templates for rendering nested lists

3. Core Drag-Drop Modifications (/projects/sortable/src/lib/drag-drop/):
 - drop-list-ref.ts:
     - Added nestEnabled property
     - Modified to handle nested drop zones
 - drag-ref.ts:
    - Added DragNestInfo interface for handling nesting information
    - Modified drag operations to support nesting

4. Event Handling (/projects/sortable/src/lib/drag-drop/drag-events.ts):
```typescript
export interface CdkDragNest<T = any> {
  nestIndex: number;
}
export interface CdkNestDrop {
  isNesting: boolean;
}
```
5. Sorting Strategy (/projects/sortable/src/lib/drag-drop/sorting/):
 - single-axis-sort-strategy.ts:
     - Added nesting-aware sorting logic
     - Implemented nest() and unnest() methods

The main architectural changes made:

1. Added a complete tree-based data structure for handling nested items
2. Extended the original drag-drop system to support nesting operations
3. Created a dedicated component for nested drag-drop functionality
4. Modified the core sorting strategy to handle nested items
5. Added new events and interfaces for nesting operations

## The Angular CDK and workflow

We linked the Angular CDK to our local CDK development:

Initially, we tried using TypeScript path aliases to directly use the CDK source files, but this approach caused dependency issues.

We then switched to using npm's link feature, which is the proper way to use local packages during development:
Found the built CDK at /Users/home/dev/drag-drop/components/dist/releases/cdk
Created a global symlink using npm link in the CDK directory
Linked your project to the global symlink using npm link @angular/cdk in your project root

### Verified the setup:
Confirmed the global link was created in ~/.nvm/versions/node/v22.9.0/lib/node_modules/@angular/cdk
Verified your project's node_modules/@angular/cdk now points to your local CDK build
Now when you make changes to the CDK source code, you just need to rebuild the CDK, and your project will automatically use the updated version since it's linked to your local build.

This setup allows you to develop and test the nested drag-drop functionality while working directly with the local CDK source code.




