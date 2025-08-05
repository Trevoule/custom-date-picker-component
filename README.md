# TDD Custom Date Picker

A customizable date picker component with full min/max date controls and robust input validation for ensuring date accuracy within a specified range.

## Features

- **Customizable Date Range**: Set minimum and maximum dates to restrict user selection.
- **Date Highlight**: Highlights current date, and shows available dates
- **Input Validation**: Ensures accurate date input with real-time feedback.
- **TDD**: Development according with TDD

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/trevoule/custom-date-picker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd custom-date-picker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Validation

- **Format Validation**: Ensures input matches the specified format (e.g., YYYY-MM-DD).
- **Range Validation**: Prevents selection or input of dates outside the min/max range.
- **Real-Time Feedback**: Displays error messages for invalid inputs (e.g., non-existent dates like 2023-02-30).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
