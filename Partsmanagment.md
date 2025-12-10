# Parts Management System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Frontend Components](#frontend-components)
4. [Backend API Integration](#backend-api-integration)
5. [Feature Breakdown](#feature-breakdown)
6. [Step-by-Step Workflows](#step-by-step-workflows)
7. [Data Flow](#data-flow)
8. [Technical Implementation Details](#technical-implementation-details)

---

## Overview

The **Parts Management System** is a comprehensive inventory management module that allows users to view, manage, and track parts/items in stock across different stores. It provides real-time inventory tracking, filtering capabilities, reporting features, and integration with rack/shelf management.

### Key Features
- **Inventory Stock Viewing**: View all parts with detailed information
- **Advanced Filtering**: Filter by Category, Sub-Category, Item, Store Type, and Store
- **Rack & Shelf Management**: Assign and manage parts to specific racks and shelves
- **Reporting**: Generate PDF and Excel reports
- **Kit Management**: Make and break kits (bundled parts)
- **Pagination**: Efficient data loading with pagination support

---

## System Architecture

### Frontend Structure
```
src/pages/allModules/inventory/parts/
├── index.js          # Main component with filters and search
├── view.js            # Table view component with data display
├── add.js             # Add new part component (currently minimal)
├── edit.js            # Edit part inventory (racks/shelves assignment)
├── makeKit.js         # Create kits from individual parts
├── breakKit.js        # Break kits back into individual parts
├── Report.js          # PDF report generation
└── ReportExcel.js     # Excel report generation
```

### Component Hierarchy
```
PageWrapper
└── Page
    └── Card
        ├── CardHeader (Title: "Inventory Stock")
        ├── CardBody
        │   ├── Filter Section (Category, Sub-Category, Item)
        │   ├── Search Button
        │   └── Export Buttons (PDF, Excel)
        └── View Component
            └── Table with Pagination
```

---

## Frontend Components

### 1. Main Component (`index.js`)

**Location**: `src/pages/allModules/inventory/parts/index.js`

**Purpose**: Main entry point that orchestrates all Parts Management functionality.

#### Key State Management
```javascript
// Table Data
const [tableData, setTableData] = useState([])           // Current page data
const [tableData2, setTableData2] = useState([])        // Full dataset for reports
const [tableDataLoading, setTableDataLoading] = useState(true)

// Filter Options
const [categoriesOptions, setCategoriesOptions] = useState([])
const [subOption, setSubOptions] = useState([])
const [machinePartsOptions, setMachinePartsOptions] = useState([])
const [partModelsOptions, setPartModelsOptions] = useState([])
const [storeTypeOptions, setStoreTypeOptions] = useState()
const [nameOptions, setNameOptions] = useState()

// Formik for Filter Management
const formik = useFormik({
  initialValues: {
    category_name: '',
    category_id: '',
    sub_category_id: '',
    machine_part_id: '',
    part_model_id: '',
  }
})
```

#### Key Functions

##### `refreshTableData()`
- **Purpose**: Fetches inventory data from backend with current filters
- **API Endpoint**: `GET /getItemsInventory`
- **Parameters**:
  - `records`: Items per page
  - `pageNo`: Current page number
  - `colName`: Sort column (default: 'id')
  - `sort`: Sort direction (default: 'desc')
  - `item_id`: Filter by item ID
  - `store_id`: Filter by store ID
  - `store_type_id`: Filter by store type ID
  - `category_id`: Filter by category ID
  - `sub_category_id`: Filter by sub-category ID
  - `part_model_id`: Filter by part model ID

##### `printReportAll(docType)`
- **Purpose**: Generates PDF report of all inventory
- **Process**:
  1. Fetches all data from backend
  2. Calls `GeneratePDF()` component
  3. Shows success notification

##### `printExcelAll()`
- **Purpose**: Generates Excel report of all inventory
- **Process**:
  1. Fetches all data from backend
  2. Calls `GenerateExcel()` component
  3. Shows success notification

#### Filter Cascade Logic

The filters work in a cascading manner:

1. **Category Selection** → Triggers Sub-Category fetch
   ```javascript
   useEffect(() => {
     // When category_id changes
     apiClient.get(`/getSubCategoriesByCategory?category_id=${category_id}`)
     // Updates subOption state
   }, [formik.values.category_id])
   ```

2. **Sub-Category Selection** → Triggers Item fetch
   ```javascript
   useEffect(() => {
     // When sub_category_id changes
     apiClient.get(`/getItemOemDropDown`)
     // Updates machinePartsOptions state
   }, [formik.values.sub_category_id])
   ```

3. **Item Selection** → Triggers Part Model fetch
   ```javascript
   useEffect(() => {
     // When machine_part_id changes
     apiClient.get(`/getMachinePartsModelsDropDown?machine_part_id=${machine_part_id}`)
     // Updates partModelsOptions state
   }, [formik.values.machine_part_id])
   ```

---

### 2. View Component (`view.js`)

**Location**: `src/pages/allModules/inventory/parts/view.js`

**Purpose**: Displays inventory data in a table format with actions.

#### Table Columns
1. **Checkbox**: Multi-select for bulk operations
2. **Sr. No**: Sequential number
3. **OEM/Part No**: OEM part number (number1/number2)
4. **Name**: Part name
5. **Brand**: Brand name
6. **Model**: Machine model name
7. **Uom**: Unit of measurement
8. **Qty**: Current quantity in stock
9. **Store**: Store name and type
10. **Racks**: Rack number
11. **Shelf**: Shelf number

#### Key Features

##### Pagination
- Uses Redux store for pagination state
- Stores: `inventoryManagementModule.parts.pageNo` and `perPage`
- Uses `react-js-pagination` component
- Updates Redux on page change

##### Edit Functionality
- Opens modal with `Edit` component
- Fetches item details via: `GET /editItemInventory?id={id}`
- Allows editing racks and shelves assignment

##### Delete Functionality (Currently Commented)
- Modal confirmation before deletion
- API: `DELETE /deleteMachine?id={id}`

---

### 3. Edit Component (`edit.js`)

**Location**: `src/pages/allModules/inventory/parts/edit.js`

**Purpose**: Edit inventory item's rack and shelf assignments.

#### Key Features

##### Rack & Shelf Management
- **Dynamic Rack/Shelf Rows**: Users can add multiple rack-shelf combinations
- **Cascading Dropdowns**: Selecting a rack filters available shelves
- **Quantity Assignment**: Assign quantity to each rack-shelf combination

##### Data Structure
```javascript
formik.values = {
  id: number,
  item_id: number,
  store_id: number,
  childArray: [{
    rackShelf: [{
      rack_id: number,
      shelf_id: number,
      quantity: number
    }]
  }]
}
```

##### Key Functions

**`getRacks(storeId)`**
- Fetches racks for a specific store
- API: `GET /getRackDropDown?store_id={storeId}`
- Filters racks by store_id

**`getShelves(rackId, rackIndex)`**
- Fetches shelves for a specific rack
- API: `GET /getShelvesDropdown?id={rackId}`
- Updates shelf options for specific rack row

**`addRow(childIndex)`**
- Adds a new rack-shelf row to the form
- Creates new entry: `{ rack_id: '', shelf_id: '', quantity: 0 }`

**`removeRackRow(rackIndex)`**
- Removes a rack-shelf row
- Prevents removal if only one row exists

**`submitForm(data)`**
- Updates inventory item
- API: `POST /updateItemInventory`
- Payload includes: racks, shelves, item_id, store_id, rack_id

---

### 4. Make Kit Component (`makeKit.js`)

**Location**: `src/pages/allModules/inventory/parts/makeKit.js`

**Purpose**: Create kits (bundled parts) from individual parts.

#### Workflow

1. **Select Store**: Choose store where kit will be created
2. **Select Kit**: Choose kit definition (type_id=2)
3. **View Recipe**: System fetches kit recipe showing:
   - Required items and quantities
   - Existing quantities in stock
   - Current kit stock
4. **Enter Quantity**: User enters how many kits to make
5. **Validation**: System validates:
   - Sufficient individual parts available
   - Required fields filled
6. **Submit**: Creates kits and reduces individual part quantities

#### API Endpoints

**Fetch Kit Recipe**
- `GET /viewKits?id={kit_id}&store_id={store_id}`
- Returns:
  - Kit recipe (child parts with quantities)
  - Existing item inventories
  - Existing kit quantity in stock

**Create Kit**
- `POST /makeKit`
- Payload:
  ```javascript
  {
    in_flow: number,      // Quantity of kits to make
    kit_id: number,       // Kit ID
    store_id: number,     // Store ID
    out_flow: 0,
    tableData: []         // Recipe data (for validation)
  }
  ```

#### Validation Logic
```javascript
// Validates each item in recipe
values.tableData.forEach((data, index) => {
  const requiredQty = data.reqQty * values.in_flow
  if (data.existingQty < requiredQty) {
    errors[`childArray[${index}]existingQty`] = 'Insufficient Qty!'
  }
})
```

---

### 5. Break Kit Component (`breakKit.js`)

**Location**: `src/pages/allModules/inventory/parts/breakKit.js`

**Purpose**: Break kits back into individual parts.

#### Workflow

1. **Select Store**: Choose store where kit is located
2. **Select Kit**: Choose kit to break
3. **View Recipe**: System shows:
   - Items that will be returned
   - Quantities per kit
   - Current kit stock
4. **Enter Quantity**: User enters how many kits to break
5. **Validation**: System validates:
   - Sufficient kits available
   - Quantity doesn't exceed stock
6. **Submit**: Breaks kits and increases individual part quantities

#### API Endpoints

**Fetch Kit Recipe** (Same as Make Kit)
- `GET /viewKits?id={kit_id}&store_id={store_id}`

**Break Kit**
- `POST /breakKit`
- Payload:
  ```javascript
  {
    out_flow: number,     // Quantity of kits to break
    kit_id: number,       // Kit ID
    store_id: number,     // Store ID
    in_flow: 0,
    tableData: []         // Recipe data
  }
  ```

#### Validation Logic
```javascript
// Validates kit stock availability
if (Number(values.out_flow) > Number(values.inStockKits)) {
  errors.out_flow = 'Exceeds Limit'
}
```

---

## Backend API Integration

### Complete API Endpoint List

#### 1. Get Inventory Items
```
GET /getItemsInventory
```
**Query Parameters:**
- `records`: Number of records per page
- `pageNo`: Page number
- `colName`: Column to sort by
- `sort`: Sort direction (asc/desc)
- `item_id`: Filter by item ID
- `store_id`: Filter by store ID
- `store_type_id`: Filter by store type ID
- `category_id`: Filter by category ID
- `sub_category_id`: Filter by sub-category ID
- `part_model_id`: Filter by part model ID

**Response:**
```json
{
  "itemsInventory": {
    "data": [
      {
        "id": 1,
        "quantity": 100,
        "item": {
          "id": 1,
          "machine_part_oem_part": {
            "oem_part_number": {
              "number1": "OEM001",
              "number2": "PART001"
            },
            "machine_part": {
              "name": "Brake Pad",
              "unit": { "name": "Piece" }
            }
          },
          "brand": { "name": "Brand A" },
          "machine_model": { "name": "Model X" }
        },
        "store": {
          "name": "Main Store",
          "store_type": { "name": "Warehouse" }
        },
        "racks": { "rack_number": "R001" },
        "shelves": { "shelf_number": "S001" }
      }
    ],
    "from": 1,
    "to": 10,
    "total": 100,
    "current_page": 1,
    "per_page": 10
  }
}
```

#### 2. Get Categories Dropdown
```
GET /getCategoriesDropDown
```
**Query Parameters:**
- `store_id` (optional): Filter categories by store

**Response:**
```json
{
  "categories": [
    { "id": 1, "name": "Engine Parts" },
    { "id": 2, "name": "Body Parts" }
  ]
}
```

#### 3. Get Sub-Categories by Category
```
GET /getSubCategoriesByCategory?category_id={category_id}
```
**Response:**
```json
{
  "subcategories": [
    { "id": 1, "name": "Engine Oil" },
    { "id": 2, "name": "Engine Filters" }
  ]
}
```

#### 4. Get Items Dropdown
```
GET /getItemOemDropDown
```
**Query Parameters:**
- `category_id` (optional): Filter by category
- `sub_category_id` (optional): Filter by sub-category
- `type_id` (optional): Filter by type (1=parts, 2=kits)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Category-SubCategory-ItemName"
    }
  ]
}
```

#### 5. Get Part Models Dropdown
```
GET /getMachinePartsModelsDropDown?machine_part_id={machine_part_id}
```
**Response:**
```json
{
  "machinepartmodel": [
    { "id": 1, "name": "Model A" },
    { "id": 2, "name": "Model B" }
  ]
}
```

#### 6. Get Store Types Dropdown
```
GET /getStoreTypeDropDown
```
**Response:**
```json
{
  "storeType": [
    { "id": 1, "name": "Warehouse" },
    { "id": 2, "name": "Retail Store" }
  ]
}
```

#### 7. Get Stores Dropdown
```
GET /getStoredropdown
```
**Query Parameters:**
- `store_type_id` (optional): Filter by store type

**Response:**
```json
{
  "store": [
    { "id": 1, "name": "Main Warehouse" },
    { "id": 2, "name": "Branch Store" }
  ]
}
```

#### 8. Get Racks Dropdown
```
GET /getRackDropDown
```
**Query Parameters:**
- `store_id` (optional): Filter racks by store

**Response:**
```json
{
  "racks": [
    { "id": 1, "rack_number": "R001", "store_id": 1 },
    { "id": 2, "rack_number": "R002", "store_id": 1 }
  ]
}
```

#### 9. Get Shelves Dropdown
```
GET /getShelvesDropdown
```
**Query Parameters:**
- `id` (optional): Filter by rack ID

**Response:**
```json
{
  "shelves": [
    { "id": 1, "shelf_number": "S001", "rack_id": 1 },
    { "id": 2, "shelf_number": "S002", "rack_id": 1 }
  ]
}
```

#### 10. Edit Item Inventory
```
GET /editItemInventory?id={id}
```
**Response:**
```json
{
  "editItemInventory": [
    {
      "id": 1,
      "item": { "id": 1 },
      "store": { "id": 1 },
      "store_id": 1,
      "racks": { "id": 1, "rack_number": "R001" },
      "shelves": { "id": 1, "shelf_number": "S001" },
      "childArray": [{
        "rackShelf": [{
          "rack_id": 1,
          "shelf_id": 1,
          "quantity": 50
        }]
      }]
    }
  ]
}
```

#### 11. Update Item Inventory
```
POST /updateItemInventory
```
**Payload:**
```json
{
  "id": 1,
  "item_id": 1,
  "store_id": 1,
  "rack_id": 1,
  "racks": { "id": 1 },
  "shelves": { "id": 1 },
  "purchase_order_id": 1
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Inventory updated successfully"
}
```

#### 12. View Kits
```
GET /viewKits?id={kit_id}&store_id={store_id}
```
**Response:**
```json
{
  "kitRecipe": {
    "machine_part_oem_part": {
      "machine_part": {
        "name": "Brake Kit",
        "kitchild": [
          {
            "id": 1,
            "quantity": 2,
            "item": {
              "machine_part_oem_part": {
                "machine_part": { "name": "Brake Pad" }
              }
            },
            "exisiting_item_inventory": {
              "existing_quantity": 100
            }
          }
        ]
      }
    },
    "existing_set_inventory": {
      "existing_set_quantity": 10
    }
  }
}
```

#### 13. Make Kit
```
POST /makeKit
```
**Payload:**
```json
{
  "in_flow": 5,
  "kit_id": 1,
  "store_id": 1,
  "out_flow": 0
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Kit created successfully"
}
```

#### 14. Break Kit
```
POST /breakKit
```
**Payload:**
```json
{
  "out_flow": 3,
  "kit_id": 1,
  "store_id": 1,
  "in_flow": 0
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Kit broken successfully"
}
```

---

## Feature Breakdown

### 1. Inventory Stock Viewing

#### Purpose
Display all parts/items in inventory with their current stock levels and locations.

#### Implementation
- **Component**: `View` component in `view.js`
- **Data Source**: Redux store (`inventoryManagementModule.parts.tableData`)
- **Display Format**: Responsive table with pagination

#### Key Data Points Displayed
- OEM/Part Numbers
- Part Name
- Brand and Model
- Unit of Measurement
- Current Quantity
- Store Location
- Rack and Shelf Assignment

---

### 2. Advanced Filtering System

#### Filter Hierarchy
```
Store Type (Optional)
  └── Store Name (Optional)
      └── Category
          └── Sub-Category
              └── Item (Machine Part)
                  └── Part Model (Optional)
```

#### Filter Implementation Details

**Category Filter**
- **Trigger**: User selects category
- **Action**: Fetches sub-categories for selected category
- **API**: `GET /getSubCategoriesByCategory?category_id={id}`
- **Side Effect**: Clears sub-category, item, and part model selections

**Sub-Category Filter**
- **Trigger**: User selects sub-category
- **Action**: Fetches items for selected category/sub-category
- **API**: `GET /getItemOemDropDown?category_id={id}&sub_category_id={id}`
- **Side Effect**: Clears item and part model selections

**Item Filter**
- **Trigger**: User selects item
- **Action**: Fetches part models for selected item
- **API**: `GET /getMachinePartsModelsDropDown?machine_part_id={id}`
- **Side Effect**: Clears part model selection

**Search Button**
- **Trigger**: User clicks "Search" button
- **Action**: Calls `refreshTableData()` with current filter values
- **Result**: Updates table with filtered results

---

### 3. Rack & Shelf Management

#### Purpose
Assign and manage physical locations (racks and shelves) for inventory items.

#### Workflow

1. **Edit Item**: Click edit on inventory item
2. **View Current Assignment**: See existing rack-shelf assignments
3. **Add Rack-Shelf Row**: Click "Add" to create new assignment
4. **Select Rack**: Choose rack from dropdown (filtered by store)
5. **Select Shelf**: Choose shelf from dropdown (filtered by selected rack)
6. **Enter Quantity**: Assign quantity to this rack-shelf combination
7. **Save**: Update inventory with new assignments

#### Data Structure
```javascript
{
  childArray: [{
    rackShelf: [
      {
        rack_id: 1,
        shelf_id: 1,
        quantity: 50
      },
      {
        rack_id: 2,
        shelf_id: 3,
        quantity: 30
      }
    ]
  }]
}
```

#### Business Rules
- One item can be assigned to multiple rack-shelf combinations
- Each combination has its own quantity
- Total quantity across all combinations = item's total quantity
- Racks are filtered by store
- Shelves are filtered by selected rack

---

### 4. Reporting System

#### PDF Report Generation

**Component**: `GeneratePDF` from `Report.js`

**Features:**
- Generates PDF of current filtered inventory
- Includes all table columns
- Formatted for printing
- Can generate for current page or all records

**Usage:**
```javascript
printReportAll(2)  // 2 = document type
```

#### Excel Report Generation

**Component**: `GenerateExcel` from `ReportExcel.js`

**Features:**
- Exports inventory data to Excel format
- Includes all table columns
- Can export current page or all records
- Downloadable file

**Usage:**
```javascript
printExcelAll()
```

---

### 5. Kit Management

#### Make Kit Feature

**Purpose**: Combine individual parts into kits (bundled products)

**Process:**
1. Select store where kit will be created
2. Select kit definition (predefined kit recipe)
3. System displays:
   - Required parts and quantities
   - Available quantities of each part
   - Current kit stock
4. Enter quantity of kits to make
5. System validates sufficient parts available
6. On submit:
   - Creates specified number of kits
   - Reduces individual part quantities
   - Increases kit quantity

**Example:**
- Kit Recipe: 2 Brake Pads + 1 Brake Fluid = 1 Brake Kit
- Making 5 kits requires:
  - 10 Brake Pads (2 × 5)
  - 5 Brake Fluid (1 × 5)
- System checks if 10 pads and 5 fluids are available

#### Break Kit Feature

**Purpose**: Break kits back into individual parts

**Process:**
1. Select store where kit is located
2. Select kit to break
3. System displays:
   - Parts that will be returned
   - Quantities per kit
   - Current kit stock
4. Enter quantity of kits to break
5. System validates sufficient kits available
6. On submit:
   - Breaks specified number of kits
   - Increases individual part quantities
   - Decreases kit quantity

**Example:**
- Breaking 3 Brake Kits returns:
  - 6 Brake Pads (2 × 3)
  - 3 Brake Fluid (1 × 3)

---

## Step-by-Step Workflows

### Workflow 1: Viewing Inventory Stock

1. **Navigate to Parts Management**
   - Path: `Inventory → Parts`
   - Component loads: `index.js`

2. **Initial Data Load**
   - System fetches categories dropdown
   - System fetches store types dropdown
   - System fetches initial inventory data (first page)

3. **View Inventory Table**
   - Table displays with columns: Sr. No, OEM/Part No, Name, Brand, Model, Uom, Qty, Store, Racks, Shelf
   - Pagination controls visible at bottom
   - Loading spinner shows during data fetch

4. **Navigate Pages**
   - Click page number or Next/Prev
   - Redux store updates page number
   - New data fetched automatically

---

### Workflow 2: Filtering Inventory

1. **Select Category**
   - User selects category from dropdown
   - System fetches sub-categories for selected category
   - Sub-category dropdown populates
   - Item and Part Model dropdowns clear

2. **Select Sub-Category**
   - User selects sub-category
   - System fetches items for category + sub-category
   - Item dropdown populates
   - Part Model dropdown clears

3. **Select Item (Optional)**
   - User selects item
   - System fetches part models for selected item
   - Part Model dropdown populates

4. **Apply Filters**
   - User clicks "Search" button
   - System calls `refreshTableData()` with all filter values
   - Table updates with filtered results
   - Pagination resets to page 1

5. **Clear Filters**
   - User clears any dropdown
   - Dependent dropdowns also clear
   - Click "Search" to refresh with cleared filters

---

### Workflow 3: Editing Rack & Shelf Assignment

1. **Open Edit Modal**
   - User clicks edit button on inventory item (if available)
   - System fetches item details: `GET /editItemInventory?id={id}`
   - Modal opens with current assignments

2. **View Current Assignments**
   - Table shows existing rack-shelf-quantity combinations
   - Each row represents one location assignment

3. **Add New Assignment**
   - Click "Add" button
   - New row appears with empty rack, shelf, quantity fields
   - Select rack from dropdown (filtered by store)
   - Select shelf from dropdown (filtered by selected rack)
   - Enter quantity

4. **Remove Assignment**
   - Click cancel icon on row
   - Row removed (if more than one row exists)

5. **Save Changes**
   - Click "Update" button
   - System validates form
   - API call: `POST /updateItemInventory`
   - Modal closes, table refreshes

---

### Workflow 4: Making a Kit

1. **Open Make Kit Modal**
   - Click "Make New Kit" button
   - Modal opens with empty form

2. **Select Store**
   - Choose store from dropdown
   - System fetches stores: `GET /getStoredropdown`

3. **Select Kit**
   - Choose kit from dropdown
   - System fetches kits: `GET /getItemOemDropDown?type_id=2`
   - Kit dropdown populates

4. **View Kit Recipe**
   - System automatically fetches recipe: `GET /viewKits?id={kit_id}&store_id={store_id}`
   - Table displays:
     - Item names
     - Required quantity per kit
     - Existing quantity in stock
   - Shows current kit stock

5. **Enter Quantity**
   - User enters number of kits to make
   - System calculates required parts: `reqQty × in_flow`
   - System validates: `existingQty ≥ (reqQty × in_flow)`

6. **Submit**
   - Click "Submit" button
   - System validates all fields
   - API call: `POST /makeKit`
   - On success:
     - Modal closes
     - Inventory table refreshes
     - Kit quantity increased
     - Individual part quantities decreased

---

### Workflow 5: Breaking a Kit

1. **Open Break Kit Modal**
   - Click "Break Kit" button
   - Modal opens with empty form

2. **Select Store**
   - Choose store from dropdown

3. **Select Kit**
   - Choose kit to break
   - System fetches recipe and current stock

4. **View Break Details**
   - Table shows:
     - Items that will be returned
     - Quantity per kit
     - Current stock of each item
   - Shows current kit stock

5. **Enter Break Quantity**
   - User enters number of kits to break
   - System validates: `out_flow ≤ inStockKits`

6. **Submit**
   - Click "Submit" button
   - API call: `POST /breakKit`
   - On success:
     - Modal closes
     - Inventory table refreshes
     - Kit quantity decreased
     - Individual part quantities increased

---

### Workflow 6: Generating Reports

#### PDF Report

1. **Click "Print Report" Button**
   - Button shows loading state
   - System fetches all inventory data: `GET /getItemsInventory` (without pagination)

2. **Generate PDF**
   - `GeneratePDF` component creates PDF document
   - Includes all inventory columns
   - Formatted for printing

3. **Download/Print**
   - PDF opens in new window
   - User can print or save

#### Excel Report

1. **Click "Print Excel" Button**
   - Button shows loading state
   - System fetches all inventory data

2. **Generate Excel**
   - `GenerateExcel` component creates Excel file
   - Includes all inventory columns
   - Formatted as spreadsheet

3. **Download**
   - Excel file downloads automatically
   - User can open in Excel/LibreOffice

---

## Data Flow

### Component Data Flow

```
User Action
    ↓
Formik State Update
    ↓
useEffect Hook Triggered
    ↓
API Call (apiClient)
    ↓
Backend Processing
    ↓
Response Received
    ↓
State Update (useState/Redux)
    ↓
Component Re-render
    ↓
UI Update
```

### Redux State Management

**Store Structure:**
```javascript
{
  tableCrud: {
    data: {
      inventoryManagementModule: {
        parts: {
          pageNo: 1,
          perPage: 10,
          tableData: {
            data: [...],
            from: 1,
            to: 10,
            total: 100,
            current_page: 1,
            per_page: 10
          }
        }
      }
    }
  }
}
```

**Actions:**
- `updateSingleState([value, 'inventoryManagementModule', 'parts', 'pageNo'])`
- `updateSingleState([value, 'inventoryManagementModule', 'parts', 'perPage'])`
- `updateSingleState([data, 'inventoryManagementModule', 'parts', 'tableData'])`

---

## Technical Implementation Details

### State Management

#### Local State (useState)
- Component-specific data
- Filter options
- Loading states
- Modal states

#### Redux State
- Pagination state
- Table data
- Global settings

#### Formik State
- Form values
- Form validation
- Form errors
- Form submission

### API Client Configuration

**Location**: `src/baseURL/apiClient.js`

**Base URL**: Configured in `src/baseURL/baseURL.js`

**Authentication**: Bearer token (if required)

**Error Handling**: 
- 401: Unauthorized (redirect to login)
- Other errors: Show notification

### Form Validation

**Library**: Formik

**Validation Rules:**
- Required fields
- Numeric validations
- Quantity validations (sufficient stock)
- Custom business rules

### Pagination Implementation

**Library**: `react-js-pagination`

**Features:**
- Server-side pagination
- Configurable items per page
- Page number tracking in Redux
- Automatic data refresh on page change

### Filter Implementation

**Cascading Dropdowns:**
- Each filter level depends on previous level
- Clearing parent clears children
- Loading states for each dropdown
- Debouncing (if needed)

### Modal Management

**Library**: Custom Modal component

**States:**
- `isOpen`: Modal visibility
- `isStaticBackdrop`: Prevent closing on backdrop click
- `isScrollable`: Enable scrolling
- `isCentered`: Center modal
- `size`: Modal size (sm, md, lg, xl)

---

## Best Practices for Developers

### 1. Adding New Filters

```javascript
// 1. Add to formik initialValues
initialValues: {
  new_filter_id: '',
}

// 2. Create state for options
const [newFilterOptions, setNewFilterOptions] = useState([])
const [newFilterLoading, setNewFilterLoading] = useState(false)

// 3. Create useEffect for fetching options
useEffect(() => {
  setNewFilterLoading(true)
  apiClient.get(`/getNewFilterDropdown`)
    .then((response) => {
      const rec = response.data.data.map(({ id, name }) => ({
        id,
        value: id,
        label: name,
      }))
      setNewFilterOptions(rec)
      setNewFilterLoading(false)
    })
}, [])

// 4. Add filter to refreshTableData API call
apiClient.get(`/getItemsInventory?...&new_filter_id=${formik.values.new_filter_id}`)

// 5. Add UI component in filter section
<FormGroup id='new_filter_id' label='New Filter'>
  <ReactSelect
    options={newFilterOptions}
    isLoading={newFilterLoading}
    value={...}
    onChange={...}
  />
</FormGroup>
```

### 2. Adding New Table Columns

```javascript
// In view.js, add to table header
<th>New Column</th>

// In table body, add data display
<td>{item.newField}</td>
```

### 3. Adding New Actions

```javascript
// Add button in table row
<td>
  <Button
    onClick={() => handleNewAction(item.id)}
    color='primary'
    icon='ActionIcon'>
    Action Name
  </Button>
</td>

// Implement handler
const handleNewAction = (id) => {
  // Your logic here
}
```

### 4. Error Handling

```javascript
apiClient.get('/endpoint')
  .then((response) => {
    // Success handling
  })
  .catch((err) => {
    if (err.response?.status === 401) {
      // Handle unauthorized
    } else {
      // Handle other errors
      showNotification(_titleError, err.message, 'Danger')
    }
  })
```

---

## Common Issues and Solutions

### Issue 1: Filters Not Working
**Solution**: Check if `refreshTableData()` is called after filter change and includes all filter parameters in API call.

### Issue 2: Pagination Not Updating
**Solution**: Ensure Redux state is updated correctly and component re-renders on state change.

### Issue 3: Rack-Shelf Not Loading
**Solution**: Verify store_id is passed correctly and API endpoints return data in expected format.

### Issue 4: Kit Validation Failing
**Solution**: Check if quantities are being compared correctly (string vs number conversion).

---

## Future Enhancements

1. **Bulk Operations**: Select multiple items and perform bulk actions
2. **Advanced Search**: Search by part number, name, or other fields
3. **Stock Alerts**: Low stock warnings and notifications
4. **Movement History**: Track inventory movements over time
5. **Barcode Scanning**: Scan barcodes for quick item lookup
6. **Export Templates**: Customizable report templates
7. **Multi-Store View**: View inventory across all stores simultaneously

---

## Conclusion

The Parts Management System is a comprehensive inventory management solution that provides:
- Real-time inventory tracking
- Flexible filtering and search
- Physical location management (racks/shelves)
- Kit assembly and disassembly
- Comprehensive reporting

This documentation should serve as a complete guide for new developers to understand and work with the Parts Management module.

---

